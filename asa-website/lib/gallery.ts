import { getSupabaseClient } from "@/lib/supabase"

/** Storage bucket created by the gallery migration. */
export const GALLERY_BUCKET = "gallery"

// The homepage shows a taste of each event rather than the whole roll. Every
// uploaded photo stays queryable for a dedicated album page later.
const PHOTOS_PER_ALBUM = 8

export type GalleryPhoto = {
  id: string
  /** Public storage URL, passed straight to `next/image`. */
  src: string
  /** Tiny inline preview that fills the tile until the real file decodes. */
  blurDataURL: string
  alt: string
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
    .select("id, slug, title, event_date, photos ( id, storage_path, blur_data_url, alt )")
    // Newest event first; undated albums sink to the bottom rather than the top.
    .order("event_date", { ascending: false, nullsFirst: false })
    .order("sort_order", { referencedTable: "photos", ascending: true })
    .limit(PHOTOS_PER_ALBUM, { referencedTable: "photos" })
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
        alt: photo.alt ?? `${album.title} — Armenian Student Association at UNLV`,
      })),
    }))
}
