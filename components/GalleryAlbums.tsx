"use client"

import { useCallback, useEffect, useState, type CSSProperties } from "react"
import Image, { getImageProps } from "next/image"

import type { GalleryAlbum, GalleryPhoto } from "@/lib/gallery"

// Mirrors the .lightbox-image width in globals.css: min(92vw, 1100px, 82vh *
// aspect ratio). Describing that box exactly lets the browser pick the right
// srcset candidate — a portrait photo is bounded by the viewport's height, and
// sizing it as if it were full width downloads ~3x the pixels it can show.
const LIGHTBOX_VW = 92
const LIGHTBOX_VH = 82
const LIGHTBOX_MAX_PX = 1100

function lightboxSizes(width: number, height: number): string {
  const ratio = width / height
  // The photo's width, in vh, when the height cap is what binds.
  const heightBoundVh = Math.round(LIGHTBOX_VH * ratio * 100) / 100
  // Viewports narrower than this aspect ratio run out of width first.
  const widthBound = `(max-aspect-ratio: ${Math.round(heightBoundVh * 100)}/${LIGHTBOX_VW * 100})`
  const pxCapWidth = Math.floor(LIGHTBOX_MAX_PX / (LIGHTBOX_VW / 100))
  const pxCapHeight = Math.ceil(LIGHTBOX_MAX_PX / (heightBoundVh / 100))

  return [
    // The CSS caps height lower on phones, but a portrait screen runs out of
    // width first for all but the tallest photos.
    `(max-width: 640px) ${LIGHTBOX_VW}vw`,
    `${widthBound} and (max-width: ${pxCapWidth}px) ${LIGHTBOX_VW}vw`,
    `${widthBound} ${LIGHTBOX_MAX_PX}px`,
    `(min-height: ${pxCapHeight}px) ${LIGHTBOX_MAX_PX}px`,
    `${heightBoundVh}vh`,
  ].join(", ")
}

// Shared by the rendered lightbox and the neighbour preload, so both resolve
// to the same srcset candidate and the preload is an actual cache hit.
function lightboxImageProps(photo: GalleryPhoto) {
  return {
    src: photo.src,
    width: photo.width,
    height: photo.height,
    sizes: lightboxSizes(photo.width, photo.height),
    // The one view where a visitor looks closely enough to see compression;
    // allowlisted in next.config.ts.
    quality: 90,
  }
}

// `event_date` is a calendar date, not an instant. Formatting it in the
// visitor's zone would drag a November 1st event back to October 31st for
// anyone west of UTC, so pin the zone to the one Postgres handed it over in.
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

export default function GalleryAlbums({ albums }: { albums: GalleryAlbum[] }) {
  const [openAlbum, setOpenAlbum] = useState<GalleryAlbum | null>(null)
  // Index into openAlbum.photos, so the arrow keys have something to step
  // through; null means the album grid is showing rather than one photo.
  const [zoomedIndex, setZoomedIndex] = useState<number | null>(null)

  const closeAlbum = useCallback(() => {
    setOpenAlbum(null)
    setZoomedIndex(null)
  }, [])

  const stepZoom = useCallback(
    (delta: number) => {
      setZoomedIndex((current) => {
        if (current === null || !openAlbum) return current
        // Wrap, so arrowing off either end continues round the album rather
        // than dead-ending on a key that silently does nothing.
        const count = openAlbum.photos.length
        return (current + delta + count) % count
      })
    },
    [openAlbum],
  )

  // One handler for both layers: Escape backs out a single step, so a visitor
  // who zoomed in returns to the album grid instead of losing their place.
  useEffect(() => {
    if (!openAlbum) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (zoomedIndex !== null) setZoomedIndex(null)
        else closeAlbum()
        return
      }

      if (zoomedIndex === null) return
      if (e.key === "ArrowRight") stepZoom(1)
      if (e.key === "ArrowLeft") stepZoom(-1)
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [openAlbum, zoomedIndex, stepZoom, closeAlbum])

  // Fetch the photos either side of the open one, so arrowing through an album
  // shows the next photo at once instead of waiting on the image optimizer.
  useEffect(() => {
    if (!openAlbum || zoomedIndex === null) return

    const count = openAlbum.photos.length
    const neighbours = new Set([(zoomedIndex + 1) % count, (zoomedIndex - 1 + count) % count])
    neighbours.delete(zoomedIndex)

    for (const index of neighbours) {
      const { props } = getImageProps({ ...lightboxImageProps(openAlbum.photos[index]), alt: "" })
      const preload = new window.Image()
      // sizes before srcset, so the candidate is chosen against the real slot.
      preload.sizes = props.sizes ?? ""
      preload.srcset = props.srcSet ?? ""
    }
  }, [openAlbum, zoomedIndex])

  const zoomed = openAlbum && zoomedIndex !== null ? openAlbum.photos[zoomedIndex] : null

  return (
    <>
      <div className="gallery-grid">
        {albums.map((album) => {
          const [cover] = album.photos
          const eventDate = formatEventDate(album.eventDate)

          return (
            <button
              type="button"
              className="gallery-card"
              key={album.id}
              onClick={() => setOpenAlbum(album)}
              aria-label={`Open ${album.title}, ${album.photos.length} photos`}
            >
              <div className="gallery-card-media">
                <Image
                  src={cover.src}
                  alt=""
                  fill
                  placeholder="blur"
                  blurDataURL={cover.blurDataURL}
                  // Tracks .gallery-grid in globals.css: one column below 604px,
                  // two below 920px, three after that, capped at a 1100px row.
                  sizes="(max-width: 603px) 90vw, (max-width: 919px) 45vw, (max-width: 1221px) 30vw, 351px"
                  style={{ objectFit: "cover" }}
                  // Left lazy: the gallery sits four sections down, so
                  // preloading covers would only compete with the hero image.
                />
                <span className="gallery-card-count">{album.photos.length}</span>
              </div>

              <div className="gallery-card-body">
                <span className="gallery-card-title">{album.title}</span>
                {eventDate && <span className="gallery-card-date">{eventDate}</span>}
              </div>
            </button>
          )
        })}
      </div>

      {openAlbum && (
        <div className="modal-overlay" onClick={closeAlbum}>
          <div
            className="modal gallery-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="gallery-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <p className="section-label">
                  {formatEventDate(openAlbum.eventDate) ?? `${openAlbum.photos.length} photos`}
                </p>
                <h3 className="modal-title" id="gallery-modal-title">{openAlbum.title}</h3>
              </div>

              <button
                type="button"
                className="modal-close"
                onClick={closeAlbum}
                aria-label="Close album"
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="gallery-modal-grid">
                {openAlbum.photos.map((photo, index) => (
                  <button
                    type="button"
                    className="gallery-item gallery-thumb"
                    key={photo.id}
                    onClick={() => setZoomedIndex(index)}
                    aria-label={`Enlarge photo ${index + 1} of ${openAlbum.photos.length}`}
                  >
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      placeholder="blur"
                      blurDataURL={photo.blurDataURL}
                      // Tracks .gallery-modal-grid: most phones get a single
                      // column, then two, three and four as the dialog widens.
                      sizes="(max-width: 413px) 90vw, (max-width: 560px) 45vw, (max-width: 699px) 40vw, (max-width: 912px) 27vw, (max-width: 1111px) 21vw, 225px"
                      style={{ objectFit: "cover" }}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {zoomed && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={zoomed.alt}
          onClick={() => setZoomedIndex(null)}
        >
          <button
            type="button"
            className="lightbox-close"
            onClick={() => setZoomedIndex(null)}
            aria-label="Close photo"
          >
            ×
          </button>

          {openAlbum && openAlbum.photos.length > 1 && (
            <>
              <button
                type="button"
                className="lightbox-nav lightbox-nav--prev"
                onClick={(e) => { e.stopPropagation(); stepZoom(-1) }}
                aria-label="Previous photo"
              >
                ‹
              </button>
              <button
                type="button"
                className="lightbox-nav lightbox-nav--next"
                onClick={(e) => { e.stopPropagation(); stepZoom(1) }}
                aria-label="Next photo"
              >
                ›
              </button>
            </>
          )}

          <figure className="lightbox-figure" onClick={(e) => e.stopPropagation()}>
            <Image
              {...lightboxImageProps(zoomed)}
              alt={zoomed.alt}
              // Remount per photo, so the next one shows its own blur-up
              // rather than the previous photo squeezed into the new box.
              key={zoomed.id}
              placeholder="blur"
              blurDataURL={zoomed.blurDataURL}
              className="lightbox-image"
              style={{ "--photo-ratio": zoomed.width / zoomed.height } as CSSProperties}
            />
            <figcaption className="lightbox-caption">
              {zoomedIndex !== null && openAlbum
                ? `${zoomedIndex + 1} of ${openAlbum.photos.length}`
                : null}
            </figcaption>
          </figure>
        </div>
      )}
    </>
  )
}