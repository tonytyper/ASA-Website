"use client"

import { useEffect, useState } from 'react'

type UpcomingEvent = {
  /** Month and day, shown as one line in the card's navy band. */
  date: string
  name: string
  desc: string
  location: string
  time: string
  /** Flyer or post with more detail. The button is omitted when absent. */
  link?: string
}

const upcomingEvents: UpcomingEvent[] = [
  {
    date: "October 6",
    name: "Second General Meeting",
    desc: "Join us for an evening of making friends, playing fun games, and enjoying delicious food!",
    location: "TBE-B 178",
    time: "6-8pm",
    link: "https://www.instagram.com/p/Dd2O72XSqZl/?hl=en",
  },
  {
    date: "October 24",
    name: "ACYO Fall Festival",
    desc: "An evening of music, food, games, and raffles hosted by the Armenian Church Youth Organization.",
    location: "6820 Ponderosa Way, Las Vegas",
    time: "5pm",
    link: "https://www.instagram.com/p/Dd7dbL-PC4D/?hl=en",
  },
]

const pastEvents = [
  {
    day: "9",
    month: "September",
    year: "2026",
    name: "First General Meeting",
    desc: "The first meeting of the Fall semester, getting to know each other over Stephano’s.",
    meta: "BEH 110",
  },
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
          {upcomingEvents.map((event) => (
            <div className="event-card" key={event.name}>
              <div className="event-card-top">
                <div className="event-date">{event.date}</div>
              </div>
              <div className="event-card-body">
                <div className="event-name">{event.name}</div>
                <p className="event-desc">{event.desc}</p>
                <div className="event-footer">
                  <div className="event-meta">
                    <span>📍 {event.location}</span>
                    <span>🕒 {event.time}</span>
                  </div>
                  {event.link && (
                    <a
                      className="btn-primary event-more"
                      href={event.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open ${event.name} on Instagram`}
                    >
                      Open on Instagram →
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
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
