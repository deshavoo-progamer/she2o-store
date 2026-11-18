import { realShots, social } from '../data.js'

export default function RealShots() {
  return (
    <section id="real" className="real-shots">
      <div className="shell">
        <div className="section-heading" data-reveal>
          <div>
            <h2>صور <span>على الطبيعة.</span></h2>
            <p>دي صور إحنا مصوّرينها للكوتشيات. عايز تشوف كوتشي من زاوية تانية؟ ابعتلنا على واتساب.</p>
          </div>
          <a href={social.facebook} target="_blank" rel="noreferrer" className="text-link">
            صور أكتر على فيسبوك <span aria-hidden="true">↗</span>
          </a>
        </div>
        <div className="real-gallery">
          {realShots.map(shot => (
            <figure key={shot.src} data-reveal>
              <img src={shot.src} alt={shot.alt} loading="lazy" width="206" height="206" />
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
