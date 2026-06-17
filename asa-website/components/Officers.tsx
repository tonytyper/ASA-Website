import Image from "next/image";

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
                <Image src="/officers/p25.PNG" alt="Ariana Khzarjyan, President" fill sizes="240px" style={{ objectFit: "cover" }} />
              </div>
              <div className="officer-info">
                <div className="officer-name">President</div>
                <div className="officer-role">Ariana Khzarjyan</div>
              </div>
            </div>
            <div className="officer-card">
              <div className="officer-avatar">
                <Image src="/officers/vp25.PNG" alt="Mary Makaryan, Vice President" fill sizes="240px" style={{ objectFit: "cover" }} />
              </div>
              <div className="officer-info">
                <div className="officer-name">Vice President</div>
                <div className="officer-role">Mary Makaryan</div>
              </div>
            </div>
            <div className="officer-card">
              <div className="officer-avatar">
                <Image src="/officers/s25.PNG" alt="Martin Mnatsakanyan, Secretary" fill sizes="240px" style={{ objectFit: "cover" }} />
              </div>
              <div className="officer-info">
                <div className="officer-name">Secretary</div>
                <div className="officer-role">Martin Mnatsakanyan</div>
              </div>
            </div>
            <div className="officer-card">
              <div className="officer-avatar">
                <Image src="/officers/t25.PNG" alt="Samvel Janvelyan, Treasurer" fill sizes="240px" style={{ objectFit: "cover" }} />
              </div>
              <div className="officer-info">
                <div className="officer-name">Treasurer</div>
                <div className="officer-role">Samvel Janvelyan</div>
              </div>
            </div>
            <div className="officer-card">
              <div className="officer-avatar">
                <Image src="/officers/h25.PNG" alt="Mane Hovhannisyan, Historian" fill sizes="240px" style={{ objectFit: "cover" }} />
              </div>
              <div className="officer-info">
                <div className="officer-name">Historian</div>
                <div className="officer-role">Mane Hovhannisyan</div>
              </div>
            </div>

          </div>
        </section>

        <div className="ornament-border"></div>
      </>
    )
}
