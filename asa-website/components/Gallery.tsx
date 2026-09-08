import Image from "next/image"

import { getGalleryAlbums, type GalleryAlbum } from "@/lib/gallery"

// Empty tiles hold the grid's shape until the first album is ingested.
const PLACEHOLDER_COUNT = 6

// `event_date` is a calendar date, not an instant. Formatting it in the build
// machine's zone would drag a November 1st event back to October 31st, so pin
// the zone to UTC — the zone Postgres handed the date over in.
const eventDateFormat = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
})

function formatEventDate(isoDate: string | null): string | null {
  if (!isoDate) return null

  const parsed = new Date(`${isoDate}T00:00:00Z`)
  return Number.isNaN(parsed.getTime()) ? null : eventDateFormat.format(parsed)
}

export default async function Gallery() {
  const albums = await getGalleryAlbums()

  return (
    <>
      <section id="gallery">
        <div className="gallery-header">
          <p className="section-label">Gallery</p>
          <h2 className="section-title">Moments Over The <em>Years</em></h2>
          <div className="divider"></div>
        </div>

        {albums.length > 0 ? (
          albums.map((album, index) => (
            // Only the newest album can sit above the fold, so it is the only
            // one allowed to preload images.
            <Album key={album.id} album={album} eager={index === 0} />
          ))
        ) : (
          <div className="gallery-grid">
            {Array.from({ length: PLACEHOLDER_COUNT }, (_, i) => (
              <div className="gallery-item gallery-item--empty" key={i} aria-hidden="true"></div>
            ))}
          </div>
        )}
      </section>

      <div className="ornament-border ornament-border--gallery-donate"></div>
    </>
  )
}

function Album({ album, eager }: { album: GalleryAlbum; eager: boolean }) {
  const eventDate = formatEventDate(album.eventDate)

  return (
    <div className="gallery-album">
      <div className="gallery-album-header">
        <h3 className="gallery-album-title">{album.title}</h3>
        {eventDate && <p className="gallery-album-date">{eventDate}</p>}
      </div>

      <div className="gallery-grid">
        {album.photos.map((photo, index) => (
          <div className="gallery-item" key={photo.id}>
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              placeholder="blur"
              blurDataURL={photo.blurDataURL}
              sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 340px"
              style={{ objectFit: "cover" }}
              priority={eager && index < 3}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
