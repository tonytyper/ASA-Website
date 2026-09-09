"use client"

import { useEffect, useState } from 'react'

const pastEvents = [
  {
    day: "1",
    month: "June",
    year: "2026",
    name: "Children's Day Toy Drive",
    desc: "In honor of Armenia’s Children’s Protection Day on June 1st, we successfully distributed our second batch of donation boxes to these wonderful children. Bringing joy to their lives is deeply fulfilling, and we extend our sincere gratitude to everyone who donated.",
    meta: "Yerevan, Armenia",
  },
  {
    day: "24",
    month: "April",
    year: "2026",
    name: "Armenian Genocide Rememberance Day 2026",
    desc: "A commemorative ceremony honoring the 1.5 million lives lost in the Armenian Genocide.",
    meta: "Armenian Genocide Memorial Monument, Sunset Park",
  },
  {
    day: "20",
    month: "April",
    year: "2026",
    name: "Last General Meeting",
    desc: "The final meeting of the Spring Semester, saying goodbye with food and games",
    meta: "Student Union Room 219",
  },
  {
    day: "15",
    month: "April",
    year: "2026",
    name: "The Armenian Genocide & The Holocaust In Historical Context",
    desc: "The UNLV President’s Office and College of Liberal Arts have organized a discussion panel where they are flying out scholars such as Bedross Der Matossian to bring light to the Armenian Genocide.",
    meta: "Greenspun Hall, UNLV",
  },
  {
    day: "28",
    month: "March",
    year: "2026",
    name: "Easter Egg Painting",
    desc: "Join us for egg painting with the ARS Shoushi Chapter Vergine Koujakian Saturday School kids at St. Garabed!",
    meta: "St. Garabed Armenian Apostolic Church of Las Vegas",
  },
]

export default function Events() {
  const [showPast, setShowPast] = useState(false)

  // Close on Escape, and stop the page behind the modal from scrolling.
  useEffect(() => {
    if (!showPast) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowPast(false)
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [showPast])

  return (
    <>
      <section id="events">
        <div className="events-header">
          <div>
            <h2 className="section-title">Upcoming <em>Events</em></h2>
          </div>
          <button
            type="button"
            className="btn-outline"
            style={{ borderColor: "var(--terracotta)", color: "var(--terracotta)" }}
            onClick={() => setShowPast(true)}
          >
            Past Events →
          </button>
        </div>

        <div className="events-grid">
          <div className="event-card">
            <div className="event-card-top">
              <div className="event-date">September 9</div>
            </div>
            <div className="event-card-body">
              <div className="event-name">First General Meeting</div>
              <p className="event-desc">Come and join us for our first meeting of the Spring semester, hang out, and enjoy Stephano&apos;s!</p>
              {/* Meta and the call to action share a row so the button sits
                  on the card's right edge, level with the details. */}
              <div className="event-footer">
                <div className="event-meta">
                  <span>📍 BEH 110</span>
                  <span>🕒 6-8pm</span>
                </div>
                <a
                  className="btn-primary event-more"
                  href="https://www.instagram.com/p/Dc4bCxHy0Br/?hl=en"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="More info about the First General Meeting on Instagram"
                >
                  More info
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {showPast && (
        <div className="modal-overlay" onClick={() => setShowPast(false)}>
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="past-events-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <p className="section-label">The Archive</p>
                <h3 className="modal-title" id="past-events-title">Past <em>Events</em></h3>
              </div>
              <button
                type="button"
                className="modal-close"
                onClick={() => setShowPast(false)}
                aria-label="Close past events"
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <ul className="past-list">
                {pastEvents.map((event) => (
                  <li className="past-item" key={`${event.name}-${event.year}`}>
                    <div className="past-date">
                      <div className="past-month">{event.month}</div>
                      <div className="past-day">{event.day}</div>
                      <div className="past-year">{event.year}</div>
                    </div>
                    <div className="past-info">
                      <div className="past-name-row">
                        <span className="past-name">{event.name}</span>
                      </div>
                      <p className="past-desc">{event.desc}</p>
                      <div className="past-meta">{event.meta}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="ornament-border ornament-border--events-officers"></div>
    </>
  );
}
