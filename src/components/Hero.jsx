import { product } from '../data.js'

export default function Hero() {
  return (
    <section id="top" className="bg-ink text-paper">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 md:py-16 grid md:grid-cols-2 gap-10 md:gap-14 items-center">
        <div className="order-2 md:order-1">
          <p className="text-sand text-sm mb-5">
            <span className="font-display font-semibold">EST. 2024</span>
            <span className="mx-2 text-paper/30">/</span>
            القاهرة
          </p>

          <h1 className="font-display font-extrabold leading-[1.15] text-[2.5rem] sm:text-5xl lg:text-[3.6rem]">
            خطوتك اللي جاية
            <br />
            <span className="text-sand">شقو.</span>
          </h1>

          <p className="mt-6 text-paper/70 text-lg leading-relaxed max-w-md">
            كوتشي خفيف يمشي معاك من أول اليوم لآخره. اتعمل علشان شوارع مصر —
            الزحمة، والحر، والمشاوير اللي مبتخلصش.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href="#model"
              className="inline-flex items-center h-12 px-7 rounded-full bg-rust text-paper font-semibold hover:bg-rust-dark transition-colors"
            >
              شوف الموديل
            </a>
            <p className="text-paper/60 text-sm">
              {product.name} — <span className="text-paper font-semibold">{product.price.toLocaleString('en')} ج.م</span>
            </p>
          </div>
        </div>

        <div className="order-1 md:order-2">
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
            <img
              src="/cover.jpg"
              alt="كوتشي شقو في شارع في وسط البلد"
              className="absolute inset-0 h-full w-full object-cover object-[76%_center]"
            />
            <span className="absolute bottom-4 right-4 bg-ink/80 text-paper text-xs px-3 py-1.5 rounded-full">
              موديل {product.name} · {product.code}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
