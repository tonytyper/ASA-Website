import { getGalleryAlbums } from "@/lib/gallery"
import GalleryAlbums from "@/components/GalleryAlbums"

// Empty tiles hold the grid's shape until the first album is ingested.
const PLACEHOLDER_COUNT = 6

export default async function Gallery() {
  const albums = await getGalleryAlbums()

  return (
    <>
      <section id="gallery">
        <div className="gallery-header">
          <h2 className="section-title">ASA over the <em>Years</em></h2>
          <div className="divider"></div>
        </div>

        {albums.length > 0 ? (
          // The data is fetched on the server; only the card grid and its
          // dialog need to be interactive.
          <GalleryAlbums albums={albums} />
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
