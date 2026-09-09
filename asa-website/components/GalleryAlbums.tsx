"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"

import type { GalleryAlbum } from "@/lib/gallery"

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

  const zoomed = openAlbum && zoomedIndex !== null ? openAlbum.photos[zoomedIndex] : null

  return (
    <>
      <div className="gallery-grid">
        {albums.map((album, index) => {
          const [cover] = album.photos
          const eventDate = formatEventDate(album.eventDate)

          return (
            <button
              type="button"
              className="gallery-card"
              key={album.id}
              onClick={() => setOpenAlbum(album)}
              aria-label={`Open ${album.title} — ${album.photos.length} photos`}
            >
              <div className="gallery-card-media">
                <Image
                  src={cover.src}
                  alt=""
                  fill
                  placeholder="blur"
                  blurDataURL={cover.blurDataURL}
                  sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 340px"
                  style={{ objectFit: "cover" }}
                  // `preload`, not the `priority` prop deprecated in Next 16.
                  // Only the first row is plausibly above the fold.
                  preload={index < 3}
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
                      sizes="(max-width: 640px) 45vw, 220px"
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
              src={zoomed.src}
              alt={zoomed.alt}
              width={zoomed.width}
              height={zoomed.height}
              placeholder="blur"
              blurDataURL={zoomed.blurDataURL}
              // Ask for a variant sized to the viewport rather than the 220px
              // thumbnail, and at the higher quality allowlisted in
              // next.config.ts — this is the one view where a visitor is
              // looking closely enough to see compression.
              sizes="(max-width: 1100px) 95vw, 1100px"
              quality={90}
              className="lightbox-image"
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