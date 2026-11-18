import { useState } from 'react'
import { products, SIZES } from '../data.js'
import { whatsappLink } from '../whatsapp.js'

function ProductCard({ p }) {
  const [size, setSize] = useState(null)
  const [warn, setWarn] = useState(false)

  return (
    <article className="product-card" data-reveal>
      <div className="product-image">
        <img
          src={`/products/${p.id}-studio.jpg`}
          alt={p.name}
          loading="lazy"
          width="960"
          height="720"
        />
        {p.tag && (
          <span className="product-tag">
            {p.tag}
          </span>
        )}
      </div>

      <div className="product-info">
        <div className="product-heading">
          <h3>{p.name}</h3>
          <p className="product-price">
            {p.price ? (
              <>
                {p.price} <small>ج.م</small>
              </>
            ) : (
              <small>اسأل على السعر</small>
            )}
          </p>
        </div>

        <div className="size-options" role="group" aria-label="اختار المقاس">
          {SIZES.map((s) => (
            <button
              key={s}
              type="button"
              aria-pressed={size === s}
              aria-label={`مقاس ${s}`}
              onClick={() => {
                setSize(s)
                setWarn(false)
              }}
            >
              {s}
            </button>
          ))}
        </div>
        <p className="size-message" aria-live="polite">
          {warn && 'اختار المقاس الأول'}
        </p>

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
          className="button button-grape product-order"
        >
          اطلب {size ? `مقاس ${size}` : 'على واتساب'} <span aria-hidden="true">↗</span>
        </a>
      </div>
    </article>
  )
}

export default function Products() {
  return (
    <section id="models" className="catalog">
      <div className="shell">
        <div className="section-heading" data-reveal>
          <div>
            <h2>أنهي <span>موديل شبهك؟</span></h2>
            <p>اختار المقاس اللي يريحك واطلبه على واتساب.</p>
          </div>
          <a className="text-link" href="#sizes">اعرف مقاسك <span aria-hidden="true">↙</span></a>
        </div>

        <div className="product-grid">
          {products.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      </div>
    </section>
  )
}
