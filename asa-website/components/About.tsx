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
                            {/* Decorative SVG Armenian pattern */}
                            <svg viewBox="0 0 200 240" width="180" opacity="0.25" xmlns="http://www.w3.org/2000/svg">
                                <g stroke="#C24535" strokeWidth="1" fill="none">
                                    <path d="M100 20 Q130 50 100 80 Q70 50 100 20Z"></path>
                                    <path d="M100 20 Q130 50 100 80 Q70 50 100 20Z" transform="translate(0,80)"></path>
                                    <path d="M100 20 Q130 50 100 80 Q70 50 100 20Z" transform="translate(0,160)"></path>
                                    <circle cx="100" cy="120" r="30"></circle>
                                    <circle cx="100" cy="120" r="20"></circle>
                                    <circle cx="100" cy="120" r="8"></circle>
                                    <line x1="70" y1="120" x2="130" y2="120"></line>
                                    <line x1="100" y1="90" x2="100" y2="150"></line>
                                    <line x1="79" y1="99" x2="121" y2="141"></line>
                                    <line x1="121" y1="99" x2="79" y2="141"></line>
                                </g>
                            </svg>
                            <div className="about-frame-text">
                                Հայ ուսանողների<br />ակումբ
                            </div>
                        </div>
                        <div className="about-tag">Est. 2001 at UNLV</div>
                    </div>
                </div>
            </section>

            <div className="ornament-border"></div>
        </>
    );
}
