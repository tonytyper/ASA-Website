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
            <p className="section-label">What&apos;s Happening</p>
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
              <div className="event-month">April</div>
              <div className="event-date">24</div>
            </div>
            <div className="event-card-body">
              <div className="event-name">Armenian Genocide Remembrance Day</div>
              <p className="event-desc">A solemn and powerful commemorative ceremony honoring the 1.5 million lives lost in the Armenian Genocide of 1915.</p>
              <div className="event-meta">
                <span>🕯 On Campus</span>
                <span>📅 April 24</span>
              </div>
            </div>
          </div>

          <div className="event-card">
            <div className="event-card-top">
              <div className="event-month">Spring</div>
              <div className="event-date">TBD</div>
            </div>
            <div className="event-card-body">
              <div className="event-name">Armenian Culture Night</div>
              <p className="event-desc">An evening celebrating Armenian music, dance, cuisine, and art. Open to all UNLV students and the Las Vegas Armenian community.</p>
              <div className="event-meta">
                <span>🎶 UNLV Campus</span>
                <span>📅 Spring 2025</span>
              </div>
            </div>
          </div>

          <div className="event-card">
            <div className="event-card-top">
              <div className="event-month">Ongoing</div>
              <div className="event-date">★</div>
            </div>
            <div className="event-card-body">
              <div className="event-name">Peer Mentor Program</div>
              <p className="event-desc">Connect with mentors in Medical, Law, and Psychology fields. Meet at least three times a semester and build your professional network.</p>
              <div className="event-meta">
                <span>📚 Medical · Law · Psychology</span>
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
