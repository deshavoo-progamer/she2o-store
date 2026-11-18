import { realShots, social } from '../data.js'

export default function RealShots() {
  return (
    <section id="real" className="scroll-mt-28 bg-ink text-paper py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid md:grid-cols-[1fr_1.4fr] gap-6 md:gap-16 items-end">
          <h2 className="font-display font-bold text-3xl sm:text-4xl leading-snug">
            اللي بتشوفه،
            <br />
            <span className="text-teal">هو اللي هيوصلك.</span>
          </h2>
          <p className="text-paper/70 leading-loose">
            دي صور الكوتشيات متصورة عندنا قدام المراية، مش صور من النت. لو عايز تشوف أي موديل من
            زاوية تانية، ابعتلنا على الواتساب ونصورهولك.
          </p>
        </div>

        <div className="mt-10 -mx-4 px-4 sm:mx-0 sm:px-0 flex sm:grid sm:grid-cols-5 gap-3 overflow-x-auto snap-x snap-mandatory pb-2 sm:pb-0">
          {realShots.map((s, i) => (
            <figure
              key={s.src}
              className={`shrink-0 w-[62%] sm:w-auto snap-start rounded-xl overflow-hidden bg-ink-soft ${
                i % 2 ? 'sm:translate-y-6' : ''
              }`}
            >
              <img src={s.src} alt={s.alt} loading="lazy" className="aspect-square w-full object-cover" />
            </figure>
          ))}
        </div>

        <a
          href={social.facebook}
          target="_blank"
          rel="noreferrer"
          className="inline-block mt-12 text-sm text-teal underline underline-offset-4 hover:text-paper"
        >
          صور أكتر على صفحتنا على فيسبوك
        </a>
      </div>
    </section>
  )
}
