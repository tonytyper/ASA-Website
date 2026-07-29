"use client"

import { useEffect, useState } from 'react'
import Image from "next/image";

type Officer = {
  role: string
  name: string
  initials: string
  img?: string
  /* one line, e.g. "B.S. of Kinesiology, Class of 2028" */
  academics: string
  bio: string
}

// PLACEHOLDER DATA — `academics` and `bio` are stubs on every officer;
// replace them with the real details. 2026/27 is a full placeholder year
// (add an `img` once photos exist; cards fall back to initials without one).
const officersByYear: Record<string, Officer[]> = {
  "2025/26": [
    { role: "President", name: "Ariana Khzarjyan", initials: "P", img: "/officers/p25.jpg", academics: "B.S. of TBD, Class of TBD", bio: "“It was a profound honor to serve as the President of the Armenian Student Association of UNLV for the 2025-26 academic year. I am deeply grateful to everyone who supported our mission, guided our community, and helped us thrive. Together, we kept our culture strong and our community united. As William Saroyan beautifully wrote, when two Armenians meet anywhere in the world, see if they will not create a New Armenia. Thank you all for helping us create that home away from home this year!”" },
    { role: "Vice President", name: "Mary Makaryan", initials: "VP", img: "/officers/vp25.jpg", academics: "B.S. of TBD, Class of TBD", bio: "“Hello everyone! I was ASA’s former Vice President and I was so fortunate to be a part of such an amazing team and wonderful community. ASA is all about bringing our community together to uplift one another, and strengthen our culture. May we continue to grow as a community, and expand our horizons!”" },
    { role: "Secretary", name: "Martin Mnatsakanyan", initials: "S", img: "/officers/s25.jpg", academics: "B.S. of TBD, Class of TBD", bio: "“Hello everyone! I’m so excited to serve as your Vice President for the upcoming semester. Let’s continue expanding our club and show everyone how strong our community has become!”" },
    { role: "Treasurer", name: "Samvel Janvelyan", initials: "T", img: "/officers/t25.jpg", academics: "B.S. of TBD, Class of TBD", bio: "“Being on the board of ASA has helped me make a lot of new friends. I also developed many technical and professional skills. This unique experience allowed me to become a more well-rounded and social person.”" },
    { role: "Historian", name: "Mane Hovhannisyan", initials: "H", img: "/officers/h25.jpg", academics: "B.S. of TBD, Class of TBD", bio: "“Hi everyone! I’m thrilled to serve as your President for the 2026-2027 term and can’t wait to continue building our community on campus. Together, we’ll create memorable experiences and leave a lasting impact.”" },
  ],
  "2026/27": [
    { role: "President", name: "Mane Hovhannisyan", initials: "P", academics: "B.S. of TBD, Class of TBD", bio: "Hi everyone! I’m thrilled to serve as your President for the 2026-2027 term and can’t wait to continue building our community on campus. Together, we’ll create memorable experiences and leave a lasting impact." },
    { role: "Vice President", name: "Martin Mnatsakanyan", initials: "VP", academics: "B.S. of TBD, Class of TBD", bio: "Bio coming soon." },
    { role: "Secretary", name: "TBD", initials: "S", academics: "B.S. of TBD, Class of TBD", bio: "Bio coming soon." },
    { role: "Treasurer", name: "TBD", initials: "T", academics: "B.S. of TBD, Class of TBD", bio: "Bio coming soon." },
    { role: "Historian", name: "TBD", initials: "H", academics: "B.S. of TBD, Class of TBD", bio: "Bio coming soon." },
  ],
}

const years = Object.keys(officersByYear)

// Always two lines (first / rest) so every card is the same height. The
// nbsp keeps line two occupying space for one-word names like "TBD".
function splitName(name: string): [string, string] {
  const [first, ...rest] = name.split(" ")
  return [first, rest.join(" ") || " "]
}

export default function Officers() {
  const [activeYear, setActiveYear] = useState(years[0])
  const [selected, setSelected] = useState<Officer | null>(null)

  // Close on Escape, and stop the page behind the modal from scrolling.
  useEffect(() => {
    if (!selected) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null)
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [selected])

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
            const [firstName, lastName] = splitName(officer.name)

            return (
              <button
                type="button"
                className="officer-card"
                key={`${activeYear}-${officer.role}`}
                onClick={() => setSelected(officer)}
                aria-label={`View details for ${officer.name}, ${officer.role}`}
              >
                <div className="officer-avatar">
                  {officer.img ? (
                    <Image
                      src={officer.img}
                      alt=""
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
              </button>
            )
          })}
        </div>
      </section>

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div
            className="modal officer-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="officer-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="modal-close officer-modal-close"
              onClick={() => setSelected(null)}
              aria-label="Close officer details"
            >
              ×
            </button>

            <div className="officer-modal-body">
              <div className="officer-modal-photo">
                {selected.img ? (
                  <Image
                    src={selected.img}
                    alt={`${selected.name}, ${selected.role}`}
                    fill
                    sizes="(max-width: 680px) 90vw, 300px"
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <span className="officer-initials">{selected.initials}</span>
                )}
              </div>

              <div className="officer-modal-info">
                <p className="section-label">{selected.role}</p>
                <h3 className="modal-title" id="officer-modal-title">{selected.name}</h3>

                <p className="officer-modal-academics">{selected.academics}</p>

                <p className="officer-modal-bio">{selected.bio}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="ornament-border ornament-border--officers-contact"></div>
    </>
  )
}
