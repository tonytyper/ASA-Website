/**
 * Publishes a staging directory of event photos to Supabase Storage and the
 * `albums` / `photos` tables that back the site's gallery section.
 *
 *   npm run gallery:ingest -- [staging-dir] [--dry-run]
 *
 * The staging directory holds one folder per club event; download an event's
 * folder out of Google Drive, unzip it here, and run the script:
 *
 *   gallery-staging/
 *     culture-night-2025/
 *       album.json          <- optional, see AlbumMetadata below
 *       IMG_4821.jpg
 *       IMG_4822.jpg
 *
 * Storage keys are content addressed (`<album-slug>/<sha256 prefix>.webp`), so
 * the run is idempotent: re-ingesting a folder after adding three photos
 * uploads exactly those three, and re-uploading the same file under a new
 * name is a no-op rather than a duplicate tile.
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY. The secret key
 * bypasses row level security, which is why this runs from a terminal and
 * never from the site.
 */

import { createHash } from "node:crypto"
import { readdir, readFile } from "node:fs/promises"
import { extname, join, resolve } from "node:path"
import { parseArgs } from "node:util"

import { createClient, type SupabaseClient } from "@supabase/supabase-js"
import sharp from "sharp"

const BUCKET = "gallery"
const DEFAULT_STAGING_DIR = "gallery-staging"

// Phone cameras hand over 4000px+ originals. Nothing on the site displays a
// photo wider than ~1100 CSS px, so storing more than this pays egress for
// pixels no visitor will ever see. WebP at 82 is visually lossless at these
// dimensions and roughly a third the size of the source JPEG.
const MAX_EDGE_PX = 2400
const WEBP_QUALITY = 82

// Sixteen pixels on the long edge is enough colour information for the blur-up
// placeholder and keeps the inlined data URL well under a kilobyte.
const BLUR_EDGE_PX = 16
const BLUR_QUALITY = 40

// Encoding is CPU bound and uploading is network bound; a small pool keeps
// both busy without letting sharp's own thread pool thrash.
const CONCURRENCY = 4

// Extensions sharp can decode without a platform-specific libvips build. HEIC
// is deliberately absent — see the warning emitted for skipped files.
const SOURCE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".tif", ".tiff", ".avif"])

const METADATA_FILENAME = "album.json"

/** Optional `album.json` sidecar, letting officers override what the folder name implies. */
type AlbumMetadata = {
  /** Display name. Defaults to the folder name, title-cased. */
  title?: string
  /** Calendar date as `YYYY-MM-DD`. Drives the gallery's newest-first ordering. */
  eventDate?: string
  description?: string
  /** Source filename -> alt text, for photos that deserve a real description. */
  alt?: Record<string, string>
}

type PlannedPhoto = {
  sourcePath: string
  filename: string
  storagePath: string
  sortOrder: number
}

type IngestSummary = {
  albums: number
  uploaded: number
  skipped: number
  reordered: number
}

// ── helpers ──────────────────────────────────────────────────────────────────

function slugify(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function titleFromSlug(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

/** Rejects dates Postgres would accept but that mean the officer mistyped. */
function parseEventDate(value: string | undefined, albumSlug: string): string | null {
  if (!value) return null

  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error(`${albumSlug}/${METADATA_FILENAME}: eventDate must be YYYY-MM-DD, got "${value}"`)
  }

  const parsed = new Date(`${value}T00:00:00Z`)
  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`${albumSlug}/${METADATA_FILENAME}: "${value}" is not a real date`)
  }

  return value
}

async function readAlbumMetadata(albumDir: string, albumSlug: string): Promise<AlbumMetadata> {
  let raw: string
  try {
    raw = await readFile(join(albumDir, METADATA_FILENAME), "utf8")
  } catch (error) {
    // A missing sidecar is the normal case; anything else is a real problem.
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return {}
    throw error
  }

  try {
    return JSON.parse(raw) as AlbumMetadata
  } catch (error) {
    throw new Error(`${albumSlug}/${METADATA_FILENAME} is not valid JSON: ${(error as Error).message}`)
  }
}

async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  worker: (item: T) => Promise<R>,
): Promise<R[]> {
  const results = new Array<R>(items.length)
  let cursor = 0

  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const index = cursor++
      results[index] = await worker(items[index])
    }
  })

  await Promise.all(runners)
  return results
}

/**
 * Normalises one source image into the file that ships, plus the blur-up
 * placeholder and the final dimensions `next/image` needs for a remote source.
 */
async function encodePhoto(source: Buffer) {
  // `.rotate()` with no argument bakes in EXIF orientation. Without it, photos
  // shot in portrait on a phone arrive on their side, because the optimizer
  // strips the metadata that told the browser to turn them.
  const display = await sharp(source)
    .rotate()
    .resize({ width: MAX_EDGE_PX, height: MAX_EDGE_PX, fit: "inside", withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY })
    .toBuffer({ resolveWithObject: true })

  const blur = await sharp(source)
    .rotate()
    .resize({ width: BLUR_EDGE_PX, height: BLUR_EDGE_PX, fit: "inside" })
    .webp({ quality: BLUR_QUALITY })
    .toBuffer()

  return {
    buffer: display.data,
    width: display.info.width,
    height: display.info.height,
    blurDataUrl: `data:image/webp;base64,${blur.toString("base64")}`,
  }
}

function createAdminClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const secretKey = process.env.SUPABASE_SECRET_KEY

  if (!url || !secretKey) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY must be set. " +
        "Copy .env.example to .env.local and fill in both.",
    )
  }

  return createClient(url, secretKey, {
    auth: { persistSession: false, autoRefreshToken: false, skipAutoInitialize: true },
  })
}

// ── ingest ───────────────────────────────────────────────────────────────────

async function ingestAlbum(
  supabase: SupabaseClient,
  albumDir: string,
  albumSlug: string,
  dryRun: boolean,
): Promise<Omit<IngestSummary, "albums">> {
  const metadata = await readAlbumMetadata(albumDir, albumSlug)

  const entries = await readdir(albumDir, { withFileTypes: true })
  const filenames = entries
    .filter((entry) => entry.isFile() && SOURCE_EXTENSIONS.has(extname(entry.name).toLowerCase()))
    .map((entry) => entry.name)
    // Filename order is the album's order: cameras number sequentially, so
    // this is chronological for free, and officers can force an order by
    // renaming with a numeric prefix.
    .sort((a, b) => a.localeCompare(b, "en", { numeric: true }))

  const unsupported = entries.filter(
    (entry) => entry.isFile() && entry.name !== METADATA_FILENAME && !filenames.includes(entry.name),
  )
  for (const entry of unsupported) {
    console.warn(`  ! skipping ${entry.name} — unsupported format (convert HEIC to JPEG first)`)
  }

  if (filenames.length === 0) {
    console.warn(`  ! no images found, skipping album`)
    return { uploaded: 0, skipped: 0, reordered: 0 }
  }

  // Hash the source bytes rather than the encoded output: it lets an unchanged
  // photo be recognised without paying to decode and re-encode it, at the cost
  // of not re-uploading if the encoding constants above ever change.
  const planned: PlannedPhoto[] = await mapWithConcurrency(filenames, CONCURRENCY, async (filename) => {
    const sourcePath = join(albumDir, filename)
    const digest = createHash("sha256").update(await readFile(sourcePath)).digest("hex").slice(0, 16)

    return {
      sourcePath,
      filename,
      storagePath: `${albumSlug}/${digest}.webp`,
      sortOrder: 0,
    }
  })
  planned.forEach((photo, index) => {
    photo.sortOrder = index
  })

  // Look the album up before upserting so a dry run can report accurately.
  const { data: existingAlbum, error: albumLookupError } = await supabase
    .from("albums")
    .select("id")
    .eq("slug", albumSlug)
    .maybeSingle()

  if (albumLookupError) throw new Error(`looking up album ${albumSlug}: ${albumLookupError.message}`)

  const existingByPath = new Map<string, number>()
  if (existingAlbum) {
    const { data: existingPhotos, error } = await supabase
      .from("photos")
      .select("storage_path, sort_order")
      .eq("album_id", existingAlbum.id)

    if (error) throw new Error(`listing photos for ${albumSlug}: ${error.message}`)
    for (const photo of existingPhotos) existingByPath.set(photo.storage_path, photo.sort_order)
  }

  const fresh = planned.filter((photo) => !existingByPath.has(photo.storagePath))
  const misordered = planned.filter(
    (photo) =>
      existingByPath.has(photo.storagePath) && existingByPath.get(photo.storagePath) !== photo.sortOrder,
  )

  console.log(
    `  ${planned.length} image(s): ${fresh.length} new, ` +
      `${planned.length - fresh.length} already published` +
      (misordered.length > 0 ? `, ${misordered.length} to reorder` : ""),
  )

  if (dryRun) {
    for (const photo of fresh) console.log(`    + ${photo.filename} -> ${photo.storagePath}`)
    return { uploaded: fresh.length, skipped: planned.length - fresh.length, reordered: misordered.length }
  }

  const { data: album, error: upsertAlbumError } = await supabase
    .from("albums")
    .upsert(
      {
        slug: albumSlug,
        title: metadata.title ?? titleFromSlug(albumSlug),
        event_date: parseEventDate(metadata.eventDate, albumSlug),
        description: metadata.description ?? null,
      },
      { onConflict: "slug" },
    )
    .select("id")
    .single()

  if (upsertAlbumError) throw new Error(`upserting album ${albumSlug}: ${upsertAlbumError.message}`)

  await mapWithConcurrency(fresh, CONCURRENCY, async (photo) => {
    const encoded = await encodePhoto(await readFile(photo.sourcePath))

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(photo.storagePath, encoded.buffer, {
        contentType: "image/webp",
        // The key is a hash of the contents, so the bytes at a given key can
        // never change and the browser is free to keep them for a year.
        cacheControl: "31536000",
        // A collision here means a previous run uploaded the file and then
        // failed before writing its row; the bytes are identical either way,
        // so the upsert below simply finishes the job.
        upsert: true,
      })

    if (uploadError) throw new Error(`uploading ${photo.filename}: ${uploadError.message}`)

    const { error: insertError } = await supabase.from("photos").upsert(
      {
        album_id: album.id,
        storage_path: photo.storagePath,
        width: encoded.width,
        height: encoded.height,
        blur_data_url: encoded.blurDataUrl,
        alt: metadata.alt?.[photo.filename] ?? null,
        sort_order: photo.sortOrder,
      },
      { onConflict: "storage_path" },
    )

    if (insertError) throw new Error(`recording ${photo.filename}: ${insertError.message}`)
    console.log(`    + ${photo.filename}`)
  })

  // Bring already-published photos back in line when new files land between
  // them, so the grid order always matches the folder.
  await mapWithConcurrency(misordered, CONCURRENCY, async (photo) => {
    const { error } = await supabase
      .from("photos")
      .update({ sort_order: photo.sortOrder })
      .eq("storage_path", photo.storagePath)

    if (error) throw new Error(`reordering ${photo.filename}: ${error.message}`)
  })

  await ensureCover(supabase, album.id, albumSlug)

  return { uploaded: fresh.length, skipped: planned.length - fresh.length, reordered: misordered.length }
}

/** Every album needs one cover for the album index; the first photo is the default. */
async function ensureCover(supabase: SupabaseClient, albumId: string, albumSlug: string): Promise<void> {
  const { data: cover, error: coverError } = await supabase
    .from("photos")
    .select("id")
    .eq("album_id", albumId)
    .eq("is_cover", true)
    .maybeSingle()

  if (coverError) throw new Error(`checking cover for ${albumSlug}: ${coverError.message}`)
  if (cover) return

  const { data: first, error: firstError } = await supabase
    .from("photos")
    .select("id")
    .eq("album_id", albumId)
    .order("sort_order", { ascending: true })
    .limit(1)
    .maybeSingle()

  if (firstError) throw new Error(`choosing cover for ${albumSlug}: ${firstError.message}`)
  if (!first) return

  const { error } = await supabase.from("photos").update({ is_cover: true }).eq("id", first.id)
  if (error) throw new Error(`setting cover for ${albumSlug}: ${error.message}`)
}

async function main(): Promise<void> {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: { "dry-run": { type: "boolean", default: false } },
  })

  const stagingDir = resolve(positionals[0] ?? DEFAULT_STAGING_DIR)
  const dryRun = values["dry-run"] === true

  let albumDirs: string[]
  try {
    const entries = await readdir(stagingDir, { withFileTypes: true })
    albumDirs = entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort()
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      throw new Error(
        `No staging directory at ${stagingDir}. Create it and put one folder per event inside, ` +
          `or pass a path: npm run gallery:ingest -- path/to/photos`,
      )
    }
    throw error
  }

  if (albumDirs.length === 0) {
    console.log(`No album folders in ${stagingDir}. Nothing to do.`)
    return
  }

  const supabase = createAdminClient()
  console.log(`${dryRun ? "Previewing" : "Ingesting"} ${albumDirs.length} album(s) from ${stagingDir}\n`)

  const totals: IngestSummary = { albums: 0, uploaded: 0, skipped: 0, reordered: 0 }

  for (const dirName of albumDirs) {
    const albumSlug = slugify(dirName)
    if (!albumSlug) {
      console.warn(`! "${dirName}" has no usable characters for a slug, skipping\n`)
      continue
    }

    console.log(`${dirName} (${albumSlug})`)
    const result = await ingestAlbum(supabase, join(stagingDir, dirName), albumSlug, dryRun)
    console.log("")

    totals.albums += 1
    totals.uploaded += result.uploaded
    totals.skipped += result.skipped
    totals.reordered += result.reordered
  }

  console.log(
    `${dryRun ? "Would publish" : "Published"} ${totals.uploaded} photo(s) across ` +
      `${totals.albums} album(s); ${totals.skipped} already published.`,
  )

  if (!dryRun && totals.uploaded + totals.reordered > 0) {
    console.log("The site picks these up within the hour, or immediately on the next deploy.")
  }
}

main().catch((error: unknown) => {
  console.error(`\nIngest failed: ${error instanceof Error ? error.message : String(error)}`)
  process.exitCode = 1
})
