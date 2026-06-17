export default function Officers(){
    return (
      <>
        <section id="officers">
          <div className="officers-header">
            <p className="section-label">Leadership</p>
            <h2 className="section-title">Meet Our <em>Officers</em></h2>
            <div className="divider"></div>
          </div>

          <div className="officers-grid">
            <div className="officer-card">
              <div className="officer-avatar">
                <div className="officer-initials">P</div>
              </div>
              <div className="officer-info">
                <div className="officer-name">President</div>
                <div className="officer-role">Executive Board</div>
              </div>
            </div>
            <div className="officer-card">
              <div className="officer-avatar">
                <div className="officer-initials">VP</div>
              </div>
              <div className="officer-info">
                <div className="officer-name">Vice President</div>
                <div className="officer-role">Executive Board</div>
              </div>
            </div>
            <div className="officer-card">
              <div className="officer-avatar">
                <div className="officer-initials">S</div>
              </div>
              <div className="officer-info">
                <div className="officer-name">Secretary</div>
                <div className="officer-role">Executive Board</div>
              </div>
            </div>
            <div className="officer-card">
              <div className="officer-avatar">
                <div className="officer-initials">T</div>
              </div>
              <div className="officer-info">
                <div className="officer-name">Treasurer</div>
                <div className="officer-role">Executive Board</div>
              </div>
            </div>
            <div className="officer-card">
              <div className="officer-avatar">
                <div className="officer-initials">PR</div>
              </div>
              <div className="officer-info">
                <div className="officer-name">Public Relations</div>
                <div className="officer-role">Officer</div>
              </div>
            </div>
            <div className="officer-card">
              <div className="officer-avatar">
                <div className="officer-initials">EO</div>
              </div>
              <div className="officer-info">
                <div className="officer-name">Events Officer</div>
                <div className="officer-role">Officer</div>
              </div>
            </div>
          </div>
        </section>

        <div className="ornament-border"></div>
      </>
    )
}
