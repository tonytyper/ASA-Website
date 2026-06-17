export default function Events() {
  return (
    <>
      <section id="events">
        <div className="events-header">
          <div>
            <p className="section-label">What's Happening</p>
            <h2 className="section-title">Upcoming <em>Events</em></h2>
          </div>
          <a
            href="#contact"
            className="btn-outline"
            style={{ borderColor: "var(--terracotta)", color: "var(--terracotta)" }}
          >
            All Events →
          </a>
        </div>

        <div className="events-grid">
          <div className="event-card">
            <div className="event-card-top">
              <div className="event-month">April</div>
              <div className="event-date">24</div>
              <div className="event-tag">Memorial</div>
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
              <div className="event-tag">Cultural</div>
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
              <div className="event-tag">Program</div>
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

      <div className="ornament-border"></div>
    </>
  );
}
