import { useState } from 'react'
import { products, SIZES } from '../data.js'
import { whatsappLink } from '../whatsapp.js'

function ProductCard({ p }) {
  const [size, setSize] = useState(null)
  const [warn, setWarn] = useState(false)

  return (
    <article className="group flex flex-col bg-white rounded-2xl overflow-hidden ring-1 ring-ink/5">
      <div className="relative aspect-square overflow-hidden bg-ink">
        <img
          src={`/products/${p.id}.jpg`}
          alt={p.name}
          loading="lazy"
          className="h-full w-full object-cover"
          style={{ transform: `scale(${p.zoom})`, transformOrigin: p.focus }}
        />
        {/* ظل غامق بيخبي بقايا الكلام المكتوب على بوستات الفيسبوك */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(to bottom, #181c1f 0%, rgba(24,28,31,.7) 9%, transparent 22%), linear-gradient(to right, #181c1f 0%, rgba(24,28,31,.75) 9%, transparent 20%)',
          }}
        />
        {p.tag && (
          <span className="absolute top-3 right-3 bg-flame text-ink text-[11px] font-semibold px-2.5 py-1 rounded-full">
            {p.tag}
          </span>
        )}
      </div>

      <div className="p-3 sm:p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display font-semibold text-[15px] sm:text-base leading-snug">{p.name}</h3>
          <p className="font-display font-semibold whitespace-nowrap text-sm sm:text-base">
            {p.price ? (
              <>
                {p.price} <span className="text-xs font-medium text-ink/60">ج.م</span>
              </>
            ) : (
              <span className="text-xs font-medium text-teal-dark">اسأل على السعر</span>
            )}
          </p>
        </div>

        <div className="mt-3 grid grid-cols-5 gap-1">
          {SIZES.map((s) => (
            <button
              key={s}
              onClick={() => {
                setSize(s)
                setWarn(false)
              }}
              className={`h-8 rounded-md border font-display text-xs transition ${
                size === s ? 'border-ink bg-ink text-paper' : 'border-ink/15 hover:border-ink'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <p className={`mt-1 text-xs h-4 ${warn ? 'text-flame-dark' : 'text-transparent'}`}>اختار المقاس الأول</p>

        <a
          href={whatsappLink(p.name, size)}
          onClick={(e) => {
            if (!size) {
              e.preventDefault()
              setWarn(true)
            }
          }}
          target="_blank"
          rel="noreferrer"
          className="mt-auto flex items-center justify-center h-10 rounded-full bg-ink text-paper text-sm font-semibold hover:bg-teal hover:text-ink transition-colors"
        >
          اطلب {size ? `مقاس ${size}` : 'على واتساب'}
        </a>
      </div>
    </article>
  )
}

export default function Products() {
  return (
    <section id="models" className="scroll-mt-28 py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex items-end justify-between gap-6 mb-8">
          <div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl">الموديلات</h2>
            <p className="mt-2 text-ink/60">اختار الموديل والمقاس، والطلب بيكمل على الواتساب.</p>
          </div>
          <p className="hidden sm:block text-sm text-ink/50 font-display">{products.length} موديلات</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
          {products.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      </div>
    </section>
  )
}
