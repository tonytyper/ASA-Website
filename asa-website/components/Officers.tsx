"use client"

import { useState } from 'react'
import Image from "next/image";

type Officer = {
  role: string
  name: string
  initials: string
  img?: string
}

// PLACEHOLDER DATA for 2026/2027 — replace the `name` values (and add an
// `img` once photos exist; cards fall back to initials without one).
const officersByYear: Record<string, Officer[]> = {
  "2025/26": [
    { role: "President", name: "Ariana Khzarjyan", initials: "P", img: "/officers/p25.jpg" },
    { role: "Vice President", name: "Mary Makaryan", initials: "VP", img: "/officers/vp25.jpg" },
    { role: "Secretary", name: "Martin Mnatsakanyan", initials: "S", img: "/officers/s25.jpg" },
    { role: "Treasurer", name: "Samvel Janvelyan", initials: "T", img: "/officers/t25.jpg" },
    { role: "Historian", name: "Mane Hovhannisyan", initials: "H", img: "/officers/h25.jpg" },
  ],
  "2026/27": [
    { role: "President", name: "TBD", initials: "P" },
    { role: "Vice President", name: "TBD", initials: "VP" },
    { role: "Secretary", name: "TBD", initials: "S" },
    { role: "Treasurer", name: "TBD", initials: "T" },
    { role: "Historian", name: "TBD", initials: "H" },
  ],
}

const years = Object.keys(officersByYear)

export default function Officers() {
  const [activeYear, setActiveYear] = useState(years[0])

  return (
    <>
      <section id="officers">
        <div className="officers-header">
          <p className="section-label">Leadership</p>
          <h2 className="section-title">Meet Our <em>Officers</em></h2>
          <div className="divider"></div>
        </div>

        <div className="year-tabs" role="tablist" aria-label="Officer school year">
          {years.map((year) => (
            <button
              key={year}
              type="button"
              role="tab"
              id={`year-tab-${year.replace("/", "-")}`}
              aria-selected={year === activeYear}
              aria-controls="officers-panel"
              className="year-tab"
              onClick={() => setActiveYear(year)}
            >
              {year}
            </button>
          ))}
        </div>

        <div
          className="officers-grid"
          id="officers-panel"
          role="tabpanel"
          aria-labelledby={`year-tab-${activeYear.replace("/", "-")}`}
        >
          {officersByYear[activeYear].map((officer) => {
            // Always render the name as exactly two lines (first / rest) so
            // every card is the same height regardless of name length. The
            // nbsp keeps the second line occupying space for one-word
            // placeholders like "TBD".
            const [firstName, ...restOfName] = officer.name.split(" ")
            const lastName = restOfName.join(" ") || " "

            return (
            <div className="officer-card" key={`${activeYear}-${officer.role}`}>
              <div className="officer-avatar">
                {officer.img ? (
                  <Image
                    src={officer.img}
                    alt={`${officer.name}, ${officer.role}`}
                    fill
                    sizes="240px"
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <span className="officer-initials">{officer.initials}</span>
                )}
              </div>
              <div className="officer-info">
                <div className="officer-name">{firstName}<br />{lastName}</div>
                <div className="officer-role">{officer.role}</div>
              </div>
            </div>
            )
          })}
        </div>
      </section>

      <div className="ornament-border ornament-border--officers-contact"></div>
    </>
  )
}
