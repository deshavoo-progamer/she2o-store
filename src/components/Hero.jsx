import { whatsappLink } from '../whatsapp.js'

export default function Hero() {
  return (
    <section id="top" className="hero" aria-labelledby="hero-title">
      <img
        src="/shaqo-hero-1440.jpg"
        srcSet="/shaqo-hero-800.jpg 800w, /shaqo-hero-1440.jpg 1440w, /shaqo-hero-1920.jpg 1920w"
        sizes="100vw"
        alt=""
        fetchPriority="high"
        className="hero-image"
      />
      <div className="shell hero-inner">
        <div className="hero-copy">
          <h1 id="hero-title">
            <span className="hero-line">خلّي خطوتك</span>{' '}
            <span className="hero-line hero-line-accent">تتشاف.</span>
          </h1>
          <p>رانر، سكيت ولا دانك؟ اختار الكوتشي اللي شبهك، من مقاس 41 لـ 45.</p>
          <div className="hero-actions">
            <a className="button button-orange" href="#models">
              شوف الموديلات <span aria-hidden="true">↙</span>
            </a>
            <a className="button button-outline" href={whatsappLink()} target="_blank" rel="noreferrer">
              اطلب على واتساب <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
