import { getSupabaseClient } from "@/lib/supabase"

/** Storage bucket created by the gallery migration. */
export const GALLERY_BUCKET = "gallery"

// Every photo of every album is sent to the page, but only the 16 covers are
// rendered as <Image> up front — the rest live inside a dialog that mounts on
// click, so the browser requests them only when someone opens that album.

export type GalleryPhoto = {
  id: string
  /** Public storage URL, passed straight to `next/image`. */
  src: string
  /** Tiny inline preview that fills the tile until the real file decodes. */
  blurDataURL: string
  alt: string
  /** Stored dimensions. A remote source gives next/image no way to infer an
   *  aspect ratio, so the full-screen view needs these to reserve its box. */
  width: number
  height: number
}

export type GalleryAlbum = {
  id: string
  slug: string
  title: string
  /** Calendar date as `YYYY-MM-DD`, or null for albums with no fixed date. */
  eventDate: string | null
  photos: GalleryPhoto[]
}

// Shape of the select below. Written by hand rather than generated because the
// two tables are small and stable; `npx supabase gen types typescript` can
// replace this with a full `Database` type if the schema grows.
type AlbumRow = {
  id: string
  slug: string
  title: string
  event_date: string | null
  photos: {
    id: string
    storage_path: string
    blur_data_url: string
    alt: string | null
    is_cover: boolean
    width: number
    height: number
  }[]
}

/**
 * Loads the albums shown in the gallery section, newest event first, with each
 * album's photos in their curated order.
 */
export async function getGalleryAlbums(): Promise<GalleryAlbum[]> {
  const supabase = getSupabaseClient()
  if (!supabase) return []

  const { data, error } = await supabase
    .from("albums")
    .select(
      "id, slug, title, event_date, " +
        "photos ( id, storage_path, blur_data_url, alt, is_cover, width, height )",
    )
    // Newest event first; undated albums sink to the bottom rather than the top.
    .order("event_date", { ascending: false, nullsFirst: false })
    // Postgres gives no guaranteed order among rows that tie, so without this
    // a set of undated albums could come back in a different order on every
    // regeneration. Slug is stable and, given the club's naming convention
    // ("fall-25-…", "spring-26-…"), reads chronologically until real dates land.
    .order("slug", { ascending: true })
    // Cover first — it is the card's preview, and it should also lead the
    // album once opened. Ingest picks the first photo, but an officer can
    // move the flag in the dashboard and this respects that.
    .order("is_cover", { referencedTable: "photos", ascending: false })
    .order("sort_order", { referencedTable: "photos", ascending: true })
    .overrideTypes<AlbumRow[], { merge: false }>()

  if (error) {
    // A gallery outage should not take the rest of the homepage down with it.
    console.error("[gallery] failed to load albums:", error.message)
    return []
  }

  const storage = supabase.storage.from(GALLERY_BUCKET)

  return data
    // An album whose photos have not been ingested yet would render as an
    // empty heading over an empty grid.
    .filter((album) => album.photos.length > 0)
    .map((album) => ({
      id: album.id,
      slug: album.slug,
      title: album.title,
      eventDate: album.event_date,
      photos: album.photos.map((photo) => ({
        id: photo.id,
        src: storage.getPublicUrl(photo.storage_path).data.publicUrl,
        blurDataURL: photo.blur_data_url,
        // Ingest fills `alt` from the album's sidecar file when the officers
        // wrote one; the album title is the honest fallback.
        alt: photo.alt ?? `${album.title}, Armenian Student Association at UNLV`,
        width: photo.width,
        height: photo.height,
      })),
    }))
}
