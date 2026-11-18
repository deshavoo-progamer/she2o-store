import { useState } from 'react'
import { money } from '../shop.js'

function ProductCard({ p, add }) {
  const [size, setSize] = useState(null)
  const [message, setMessage] = useState('')
  const inStock = Object.values(p.stock).some(quantity => quantity > 0)

  return (
    <article className="product-card" data-reveal>
      <div className="product-image">
        <img
          src={p.image}
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
          <p className="product-price">{p.price ? money(p.price) : <small>السعر لسه هيتحدد</small>}</p>
        </div>
        {p.description && <p className="product-description">{p.description}</p>}

        <div className="size-options" role="group" aria-label="اختار المقاس">
          {Object.entries(p.stock).map(([key, available]) => {
            const s = Number(key)
            return (
            <button
              key={s}
              type="button"
              aria-pressed={size === s}
              aria-label={`مقاس ${s}${available ? '' : ' مش متاح'}`}
              disabled={!available}
              onClick={() => {
                setSize(s)
                setMessage('')
              }}
            >
              {s}
            </button>
            )
          })}
        </div>
        <p className="size-message" aria-live="polite">
          {message}
        </p>

        <button
          type="button"
          disabled={!p.price || !inStock}
          onClick={() => setMessage(!size ? 'اختار المقاس الأول' : add(p, size) ? 'اتضاف للسلة.' : 'وصلت للكمية المتاحة.')}
          className="button button-dark product-order"
        >
          {p.price && inStock ? 'ضيف للسلة' : 'لسه مش متاح للطلب'} <span aria-hidden="true">+</span>
        </button>
      </div>
    </article>
  )
}

export default function Products({ products, error, add }) {
  return (
    <section id="models" className="catalog">
      <div className="shell">
        <div className="section-heading" data-reveal>
          <div>
            <h2>أنهي <span>موديل شبهك؟</span></h2>
            <p>اختار المقاس، ضيف للسلة، وكمّل طلبك من هنا.</p>
          </div>
          <a className="text-link" href="#sizes">اعرف مقاسك <span aria-hidden="true">↙</span></a>
        </div>

        {error && <p role="alert">{error}</p>}
        {!error && !products && <p role="status">بنجيب الموديلات…</p>}
        {products?.length === 0 && <p>لسه مفيش موديلات معروضة.</p>}
        <div className="product-grid">
          {products?.map((p) => (
            <ProductCard key={p.id} p={p} add={add} />
          ))}
        </div>
      </div>
    </section>
  )
}
