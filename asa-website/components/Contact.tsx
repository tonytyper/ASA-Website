export default function Contact() {
  return (
    <section id="contact">
      <div className="contact-grid">
        <div>
          <p className="section-label">Get Involved</p>
          <h2 className="section-title">Join Our <em>Community</em></h2>
          <div className="divider"></div>
          <p className="section-body">
            Whether you're looking to connect with Armenian culture, find community, or build your professional network — we'd love to have you. Fill out the form or reach us directly.
          </p>

          <div className="contact-info-list">
            <div className="contact-item">
              <div className="contact-icon">📍</div>
              <div>
                <div className="contact-item-label">Location</div>
                <div className="contact-item-value">University of Nevada, Las Vegas</div>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-icon">📸</div>
              <div>
                <div className="contact-item-label">Instagram</div>
                <div className="contact-item-value"><a href="https://www.instagram.com/asaofunlv/" target="_blank" rel="noopener noreferrer">@asaofunlv</a></div>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-icon">✉️</div>
              <div>
                <div className="contact-item-label">Involvement Center</div>
                <div className="contact-item-value"><a href="https://involvementcenter.unlv.edu/organization/armenianstudentassociation" target="_blank" rel="noopener noreferrer">Join us here!</a></div>
              </div>
            </div>
          </div>
        </div>

        {/* PLACEHOLDER FOR CONTACT FORM */}
        <div>
          <div className="contact-form">
            <div className="form-row">
              <div className="form-group">
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
