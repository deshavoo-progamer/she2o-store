import { useState } from 'react'
import { product, specs } from '../data.js'
import { whatsappLink } from '../whatsapp.js'

// crops from the cover photo: [background-size, background-position]
const shots = [
  { size: '230%', pos: '70% 74%', label: 'الجوز' },
  { size: '420%', pos: '77% 72%', label: 'من الجنب' },
  { size: '400%', pos: '57% 76%', label: 'الفردة الشمال' },
]

export default function Product() {
  const [shot, setShot] = useState(0)
  const [size, setSize] = useState(null)
  const [warn, setWarn] = useState(false)

  const order = (e) => {
    if (!size) {
      e.preventDefault()
      setWarn(true)
    }
  }

  return (
    <section id="model" className="scroll-mt-28 py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 grid md:grid-cols-[1.1fr_1fr] gap-10 md:gap-16">
        {/* gallery */}
        <div>
          <div
            className="crop aspect-square rounded-2xl bg-ink transition-[background-position,background-size] duration-500"
            style={{ backgroundSize: shots[shot].size, backgroundPosition: shots[shot].pos }}
            role="img"
            aria-label={`كوتشي ${product.name} — ${shots[shot].label}`}
          />
          <div className="mt-3 grid grid-cols-3 gap-3">
            {shots.map((s, i) => (
              <button
                key={s.label}
                onClick={() => setShot(i)}
                className={`crop aspect-square rounded-xl bg-ink ring-2 ring-offset-2 ring-offset-paper transition ${
                  shot === i ? 'ring-rust' : 'ring-transparent opacity-70 hover:opacity-100'
                }`}
                style={{ backgroundSize: s.size, backgroundPosition: s.pos }}
                aria-label={s.label}
              />
            ))}
          </div>
        </div>

        {/* details */}
        <div className="md:pt-4">
          <p className="text-sm text-ink/50 font-display">{product.code}</p>
          <h2 className="font-display font-bold text-4xl mt-1">{product.name}</h2>
          <p className="mt-2 text-ink/60">{product.color}</p>

          <p className="mt-6 font-display text-3xl font-semibold">
            {product.price.toLocaleString('en')} <span className="text-lg font-medium">ج.م</span>
          </p>

          <div className="mt-8">
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold">المقاس</span>
              <a href="#sizes" className="text-sm text-rust underline underline-offset-4">
                دليل المقاسات
              </a>
            </div>
            <div className="grid grid-cols-6 gap-2">
              {product.sizes.map((s) => {
                const out = product.soldOut.includes(s)
                return (
                  <button
                    key={s}
                    disabled={out}
                    onClick={() => {
                      setSize(s)
                      setWarn(false)
                    }}
                    className={`h-12 rounded-lg border font-display text-sm transition ${
                      out
                        ? 'border-ink/10 text-ink/25 line-through cursor-not-allowed'
                        : size === s
                          ? 'border-ink bg-ink text-paper'
                          : 'border-ink/20 hover:border-ink'
                    }`}
                  >
                    {s}
                  </button>
                )
              })}
            </div>
            <p className={`mt-2 text-sm h-5 ${warn ? 'text-rust' : 'text-transparent'}`}>
              اختار المقاس الأول
            </p>
          </div>

          <a
            href={whatsappLink(size)}
            onClick={order}
            target="_blank"
            rel="noreferrer"
            className="mt-2 flex items-center justify-center gap-2 h-14 rounded-full bg-ink text-paper font-semibold hover:bg-ink-soft transition-colors"
          >
            اطلب على واتساب
            {size && <span className="text-sand">— مقاس {size}</span>}
          </a>
          <p className="mt-3 text-center text-sm text-ink/50">هنرد عليك ونأكد العنوان ومصاريف الشحن</p>

          <dl className="mt-10 border-t border-ink/10">
            {specs.map(([k, v]) => (
              <div key={k} className="flex justify-between gap-6 py-3.5 border-b border-ink/10 text-sm">
                <dt className="text-ink/50">{k}</dt>
                <dd className="font-medium text-left">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
