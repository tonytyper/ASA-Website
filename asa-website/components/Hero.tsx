import Image from "next/image";

export default function Hero() {
  return (
    <>
      <section id="hero">
        <div className="hero-ornament tl">❧</div>
        <div className="hero-ornament tr">❧</div>
        <div className="hero-ornament bl">❧</div>
        <div className="hero-ornament br">❧</div>

        <div className="hero-seal">
          <Image
            src="/ASA_logo.png"
            alt="Armenian Student Association at UNLV logo"
            width={379}
            height={384}
            priority
          />
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
      </section>

      <div className="ornament-border"></div>
    </>
  );
}
