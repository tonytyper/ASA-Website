// PLACEHOLDER, this will be set to the association's real Venmo username
const VENMO_HANDLE = "TBD"

const NOTE = "Donation to ASA at UNLV"
const PRESET_AMOUNTS = [5, 10, 20]

// Venmo's web payment link. Opens the app on mobile and venmo.com on
// desktop, with the recipient, note, and (optionally) amount pre-filled.
function venmoUrl(amount?: number) {
  const params = new URLSearchParams({ txn: "pay", note: NOTE })
  if (amount) params.set("amount", String(amount))
  return `https://venmo.com/${VENMO_HANDLE}?${params.toString()}`
}

const supports = [
  {
    title: "Cultural Events",
    desc: "Culture Night, Genocide Remembrance, and the gatherings that keep our traditions alive on campus.",
  },
  {
    title: "Community Outreach",
    desc: "Volunteering, fundraisers, and partnerships with Armenian organizations across Las Vegas.",
  },
  {
    title: "Student Support",
    desc: "Mentorship, professional development, and resources for Armenian students at UNLV.",
  },
]

export default function Donate() {
  return (
    <>
      <section id="donate">
        <div className="donate-inner">
          {/* The header lives inside the grid's left column so the cards on
              the right start level with "Support Us", not below the title. */}
          <div className="donate-grid">
            <div>
              <p className="section-label">Support Us</p>
              <h2 className="section-title">Support Our <em>Community</em></h2>
              <div className="divider"></div>

              <p className="donate-lead">
                The Armenian Student Association is run entirely by students. Every
                contribution goes directly back into the events, outreach, and
                resources that keep our community thriving at UNLV.
              </p>

              <div className="donate-actions">
                <div className="donate-amounts">
                  {PRESET_AMOUNTS.map((amount) => (
                    <a
                      key={amount}
                      className="donate-amount"
                      href={venmoUrl(amount)}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Donate $${amount} via Venmo`}
                    >
                      ${amount}
                    </a>
                  ))}
                </div>

                <a
                  href={venmoUrl()}
                  className="btn-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Donate on Venmo
                </a>

                <p className="donate-note">
                  Opens Venmo to <strong>@{VENMO_HANDLE}</strong>. Amounts are a
                  suggestion, you can enter any amount in the app.
                </p>
              </div>
            </div>

            <ul className="donate-uses">
              {supports.map((item) => (
                <li className="donate-use" key={item.title}>
                  <div className="donate-use-title">{item.title}</div>
                  <p className="donate-use-desc">{item.desc}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <div className="ornament-border ornament-border--donate-contact"></div>
    </>
  )
}
