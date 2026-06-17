export default function Hero() {
  return (
    <>
      <section id="hero">
        <div className="hero-ornament tl">❧</div>
        <div className="hero-ornament tr">❧</div>
        <div className="hero-ornament bl">❧</div>
        <div className="hero-ornament br">❧</div>

        <div className="hero-seal">
          {/* Mount Ararat + Eternity Wheel icon */}
          <svg viewBox="0 0 90 90" xmlns="http://www.w3.org/2000/svg">
            {/* sky/background */}
            <circle cx="45" cy="45" r="43" fill="#0F5066" />
            {/* outer ring */}
            <circle cx="45" cy="45" r="42" fill="none" stroke="#B85C38" strokeWidth="1.5" />
            <circle cx="45" cy="45" r="37" fill="none" stroke="#B85C38" strokeWidth="0.6" strokeDasharray="3 3" />
            {/* mountain snow cap */}
            <polygon points="45,18 54,35 36,35" fill="#E8EEF5" />
            <polygon points="45,22 51,33 39,33" fill="white" />
            {/* mountain body */}
            <polygon points="32,52 45,28 58,52" fill="#195265" />
            <polygon points="38,52 45,32 52,52" fill="#1a6880" />
            {/* horizon */}
            <rect x="20" y="52" width="50" height="2" fill="#B85C38" opacity="0.6" />
            {/* eternity wheel (Arevakhach) */}
            <circle cx="45" cy="62" r="9" fill="#8B1A1A" />
            <circle cx="45" cy="62" r="6" fill="none" stroke="#F5F0E8" strokeWidth="0.8" />
            <circle cx="45" cy="62" r="2" fill="#F5F0E8" />
            {/* wheel spokes */}
            <g stroke="#F5F0E8" strokeWidth="0.7" opacity="0.9">
              <line x1="45" y1="53" x2="45" y2="57" />
              <line x1="45" y1="67" x2="45" y2="71" />
              <line x1="36" y1="62" x2="40" y2="62" />
              <line x1="50" y1="62" x2="54" y2="62" />
              <line x1="38.5" y1="55.5" x2="41.3" y2="58.3" />
              <line x1="48.7" y1="65.7" x2="51.5" y2="68.5" />
              <line x1="51.5" y1="55.5" x2="48.7" y2="58.3" />
              <line x1="41.3" y1="65.7" x2="38.5" y2="68.5" />
            </g>
          </svg>
        </div>

        <p className="hero-eyebrow">University of Nevada, Las Vegas</p>
        <h1 className="hero-title">
          Armenian Student<br />
          <em>Association</em>
        </h1>
        <p className="hero-sub">Preserving Heritage · Building Community · Inspiring Future Leaders</p>

        <div className="hero-ctas">
          <a href="#contact" className="btn-primary">Join Our Community</a>
          <a href="#about" className="btn-primary">Learn More</a>
        </div>

        <div className="hero-scroll">
          <span>Scroll</span>
          <div className="scroll-line"></div>
        </div>
      </section>

      <div className="ornament-border"></div>
    </>
  );
}
