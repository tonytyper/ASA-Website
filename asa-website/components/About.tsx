import Image from 'next/image'

export default function About() {
    return (
        <>
            <section id="about">
                <div className="about-grid">
                    <div>
                        <p className="section-label">Who We Are</p>
                        <h2 className="section-title">
                            A Home Away<br />from <em>Home</em>
                        </h2>
                        <div className="divider"></div>
                        <p className="section-body">
                            The Armenian Student Association at UNLV is a cultural and social organization dedicated to celebrating Armenian heritage, fostering a supportive community on campus, and educating the broader UNLV family about Armenian history and culture.
                        </p>
                        <p className="section-body" style={{ marginTop: "1rem" }}>
                            Whether you're Armenian, Armenian-American, or simply curious about our culture, you are welcome here. We host cultural events, volunteering opportunities, and social gatherings throughout the academic year.
                        </p>

                        <div className="about-stats">
                            <div className="stat-card">
                                <div className="stat-num">25+</div>
                                <div className="stat-label">Years Active</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-num">100+</div>
                                <div className="stat-label">Members</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-num">10+</div>
                                <div className="stat-label">Annual Events</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-num">3</div>
                                <div className="stat-label">Mentor Tracks</div>
                            </div>
                        </div>
                    </div>

                    <div className="about-visual">
                        <div className="about-img-frame">
                            <Image
                                src="/about_img.PNG"
                                alt="Armenian Student Association at UNLV members"
                                fill
                                style={{ objectFit: "cover" }}
                            />
                        </div>
                        <div className="about-tag">Est. 2001 at UNLV</div>
                    </div>
                </div>
            </section>

            <div className="ornament-border"></div>
        </>
    );
}
