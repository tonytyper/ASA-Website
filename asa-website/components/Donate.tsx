import QRCode from "qrcode"

// The association's Venmo account, stored without the leading "@" so it can
// drop straight into the URL path. The display copy adds the "@" back.
//
// UNVERIFIED: venmo.com/asaofunlv1 does not resolve, so every link and the QR
// below currently lead nowhere. Replace this with the username from the Venmo
// app (Me -> Share Profile -> Copy link) and confirm the bare profile URL
// loads before shipping. A wrong handle fails silently — the buttons still
// look fine and donations simply never arrive.
const VENMO_HANDLE = "asaofunlv1"

const NOTE = "Donation to ASA at UNLV"
const PRESET_AMOUNTS = [5, 10, 20]

// Venmo's payment deep link. On mobile the URL is claimed by the Venmo app,
// which opens with the recipient, note, and amount already filled in. Venmo
// dropped support for starting a transaction from their website, so on desktop
// the same URL resolves to the profile and the donor finishes in the app —
// the note under the buttons sets that expectation.
function venmoUrl(amount?: number) {
  const params = new URLSearchParams({ txn: "pay", note: NOTE })
  // Venmo wants a bare decimal, no currency symbol.
  if (amount) params.set("amount", amount.toFixed(2))
  return `https://venmo.com/${VENMO_HANDLE}?${params.toString()}`
}

// The QR spec's minimum margin, in modules. Scanners rely on this blank
// border to find the code's edges, so it is part of the code, not padding.
const QR_QUIET_ZONE = 4

// Flattens the QR matrix into a single SVG path. Adjacent dark modules in a
// row collapse into one rectangle rather than one per module, which roughly
// halves the emitted path. Emitting a <path> rather than a <rect> per module
// also keeps this to a single DOM node instead of several hundred. Runs at
// build time, so the browser is handed finished markup and the encoder itself
// never reaches the client bundle.
function qrCodePath(text: string) {
  const { size, data } = QRCode.create(text, { errorCorrectionLevel: "M" }).modules

  let path = ""
  for (let y = 0; y < size; y++) {
    let x = 0
    while (x < size) {
      if (!data[y * size + x]) {
        x++
        continue
      }
      const start = x
      while (x < size && data[y * size + x]) x++
      const run = x - start
      path += `M${start},${y}h${run}v1h-${run}z`
    }
  }

  return { path, extent: size + QR_QUIET_ZONE * 2 }
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
  // The QR encodes the plain payment link. Amounts stay off it deliberately:
  // one static code cannot track the preset the donor picked, and a code that
  // silently disagreed with their choice would be worse than no code.
  const qr = qrCodePath(venmoUrl())

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

                <p className="donate-methods-label">
                  Two ways to give — use whichever suits the device you&apos;re on.
                </p>

                <div className="donate-methods">
                  <div className="donate-method">
                    <a
                      href={venmoUrl()}
                      className="btn-primary"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Donate on Venmo
                    </a>
                    <p className="donate-method-caption">
                      <strong>On your phone</strong> — opens the Venmo app with
                      the note already filled in.
                    </p>
                  </div>

                  <div className="donate-method">
                    <svg
                      className="donate-qr"
                      viewBox={`${-QR_QUIET_ZONE} ${-QR_QUIET_ZONE} ${qr.extent} ${qr.extent}`}
                      shapeRendering="crispEdges"
                      role="img"
                      aria-label={`QR code that opens a Venmo payment to @${VENMO_HANDLE}`}
                    >
                      {/* The quiet zone has to be opaque, not inherited, or the
                          code stops scanning wherever the section background
                          changes. */}
                      <rect
                        className="donate-qr-quiet"
                        x={-QR_QUIET_ZONE}
                        y={-QR_QUIET_ZONE}
                        width={qr.extent}
                        height={qr.extent}
                      />
                      <path className="donate-qr-modules" d={qr.path} />
                    </svg>
                    <p className="donate-method-caption">
                      <strong>On a computer</strong> — scan it with your
                      phone&apos;s camera, then enter any amount.
                    </p>
                  </div>
                </div>

                <p className="donate-note">
                  Both go to <strong>@{VENMO_HANDLE}</strong>. Any amount is welcome.
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
