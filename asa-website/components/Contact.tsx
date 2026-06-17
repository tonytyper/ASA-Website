"use client"

import { useState } from 'react'

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)

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

        <div>
          {submitted ? (
            <div className="contact-form contact-form-success">
              <h3>Շնորհակալություն!</h3>
              <p>Thank you for reaching out, we&apos;ll be in touch soon.</p>
            </div>
          ) : (
            <form
              className="contact-form"
              onSubmit={(e) => {
                e.preventDefault()
                setSubmitted(true)
              }}
            >
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input id="firstName" name="firstName" type="text" placeholder="Anahit" required />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input id="lastName" name="lastName" type="text" placeholder="Sarkisyan" required />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" placeholder="you@unlv.edu" required />
              </div>

              <div className="form-group">
                <label htmlFor="interest">I&apos;m Interested In</label>
                <select id="interest" name="interest" defaultValue="" required>
                  <option value="" disabled>Select an option</option>
                  <option value="membership">Becoming a member</option>
                  <option value="events">Upcoming events</option>
                  <option value="volunteering">Volunteering</option>
                  <option value="general">General questions</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea id="message" name="message" placeholder="Tell us a little about yourself..." required />
              </div>

              <button type="submit" className="btn-primary">Send Message</button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
