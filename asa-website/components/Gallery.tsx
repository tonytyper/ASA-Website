import Image, { type StaticImageData } from "next/image"

type Photo = {
  src: StaticImageData
  /* describe the moment, e.g. "Dancing at Culture Night 2025" */
  alt: string
}

// Drop files in assets/gallery/, import them here, and add them to the list.
const photos: Photo[] = []

// Empty tiles hold the grid's shape until real photos land.
const PLACEHOLDER_COUNT = 6

export default function Gallery() {
  return (
    <>
      <section id="gallery">
        <div className="gallery-header">
          <p className="section-label">Gallery</p>
          <h2 className="section-title">Moments Over The <em>Years</em></h2>
          <div className="divider"></div>
        </div>

        <div className="gallery-grid">
          {photos.length > 0
            ? photos.map((photo) => (
                <div className="gallery-item" key={photo.alt}>
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 340px"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              ))
            : Array.from({ length: PLACEHOLDER_COUNT }, (_, i) => (
                <div className="gallery-item gallery-item--empty" key={i} aria-hidden="true"></div>
              ))}
        </div>
      </section>

      <div className="ornament-border ornament-border--gallery-donate"></div>
    </>
  )
}
