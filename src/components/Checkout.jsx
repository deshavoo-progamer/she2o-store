import { useEffect, useState } from 'react'
import { api, checkoutId, completeCart, money, statusLabels } from '../shop.js'

const emptyCustomer = { name: '', phone: '', email: '', zone: '', city: '', address: '', notes: '' }

export function CartPage({ store, cart, setCart, checkout }) {
  const [customer, setCustomer] = useState(emptyCustomer)
  const [method, setMethod] = useState('cod')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [updatedStore, setUpdatedStore] = useState(null)
  const catalog = updatedStore ?? store
  const delivery = catalog?.shipping.find(item => item.zone === customer.zone)
  const lines = cart.map(item => ({ ...item, product: catalog?.products.find(p => p.id === item.id) }))
  const invalid = lines.some(item => !item.product?.price || (item.product.stock[item.size] ?? 0) < item.quantity)
  const subtotal = lines.reduce((total, item) => total + (item.product?.price ?? 0) * item.quantity, 0)
  const total = subtotal + (delivery?.fee ?? 0)

  const change = event => setCustomer(current => ({ ...current, [event.target.name]: event.target.value }))
  function updateQuantity(index, quantity) {
    setCart(quantity === 0 ? cart.filter((_, i) => i !== index) : cart.map((item, i) => i === index ? { ...item, quantity } : item))
  }

  async function submit(event) {
    event.preventDefault()
    if (busy || invalid || !delivery || !cart.length) return
    setBusy(true)
    setError('')
    try {
      const payload = { customer, method, items: cart, expectedTotal: total }
      const id = await checkoutId(payload)
      const result = await api('/orders', { method: 'POST', body: { ...payload, id } })
      window.location.assign(result.checkout ?? `/order/${result.order.id}`)
    } catch (err) {
      setError(err.message)
      if (err.status === 409) {
        try { setUpdatedStore(await api('/store')) } catch {}
      }
      setBusy(false)
    }
  }

  return (
    <main className="shell commerce-page">
      <a className="text-link" href={checkout ? '/cart' : '/#models'}>{checkout ? 'ارجع للسلة' : 'كمّل تسوّق'} <span aria-hidden="true">↗</span></a>
      <h1>{checkout ? 'كمّل طلبك.' : 'سلتك.'}</h1>
      {!cart.length ? <div className="shop-panel"><p>السلة لسه فاضية.</p><a className="button button-lime" href="/#models">شوف الكوتشيات</a></div>
        : !catalog ? <p role="status">بنحمّل السلة…</p>
          : <div className="checkout-layout">
            <section className="shop-panel" aria-label="الكوتشيات في السلة">
              {lines.map((item, index) => {
                const available = Math.min(item.product?.stock[item.size] ?? 0, 10)
                return (
                  <article className="cart-line" key={`${item.id}-${item.size}`}>
                    {item.product && <img src={item.product.image} alt="" width="100" height="75" />}
                    <div>
                      <strong>{item.product?.name ?? 'منتج مبقاش متاح'}</strong>
                      <p>مقاس {item.size}{item.product?.price ? ` · ${money(item.product.price)}` : ''}</p>
                      {(!available || available < item.quantity || !item.product?.price) && <p className="shop-error">الكمية دي مبقتش متاحة.</p>}
                      <div className="quantity">
                        <button type="button" disabled={busy || item.quantity <= 1} aria-label="قلّل العدد" onClick={() => updateQuantity(index, item.quantity - 1)}>−</button>
                        <span>{item.quantity}</span>
                        <button type="button" disabled={busy || item.quantity >= available} aria-label="زوّد العدد" onClick={() => updateQuantity(index, item.quantity + 1)}>+</button>
                        <button type="button" disabled={busy} className="inline-action" onClick={() => updateQuantity(index, 0)}>شيل من السلة</button>
                      </div>
                    </div>
                  </article>
                )
              })}
              <dl className="totals">
                <div><dt>الكوتشيات</dt><dd>{money(subtotal)}</dd></div>
                <div><dt>التوصيل</dt><dd>{delivery ? (delivery.fee ? money(delivery.fee) : 'ببلاش') : 'حسب المحافظة'}</dd></div>
                <div><dt>الإجمالي{delivery ? '' : ' قبل التوصيل'}</dt><dd>{money(total)}</dd></div>
              </dl>
              {!checkout && (invalid ? <p className="shop-error">ظبّط السلة الأول عشان تكمّل الطلب.</p> : <a className="button button-lime" href="/checkout">كمّل الطلب ←</a>)}
            </section>
            {checkout && <form className="shop-panel shop-form" onSubmit={submit}>
              <h2>هنوصّل لك فين؟</h2>
              <fieldset disabled={busy} className="form-fields">
                <label>اسمك<input name="name" autoComplete="name" value={customer.name} onChange={change} maxLength="120" required /></label>
                <label>رقم موبايلك<input name="phone" type="tel" autoComplete="tel" value={customer.phone} onChange={change} maxLength="20" required /></label>
                <label>المحافظة<select name="zone" value={customer.zone} onChange={change} required>
                  <option value="">اختار المحافظة</option>
                  {catalog.shipping.map(zone => <option value={zone.zone} key={zone.zone}>{zone.zone} · {zone.fee ? money(zone.fee) : 'ببلاش'}</option>)}
                </select></label>
                <label>المدينة أو المنطقة<input name="city" autoComplete="address-level2" value={customer.city} onChange={change} maxLength="100" required /></label>
                <label className="full-field">العنوان بالتفصيل<input name="address" autoComplete="street-address" value={customer.address} onChange={change} maxLength="240" required /></label>
                <label className="full-field">الإيميل{method === 'cod' ? ' (لو حابب)' : ''}<input name="email" type="email" autoComplete="email" value={customer.email} onChange={change} maxLength="160" required={method === 'online'} /></label>
                <label className="full-field">في حاجة تحب تقولها للتوصيل؟<textarea name="notes" rows="2" value={customer.notes} onChange={change} maxLength="400" /></label>
              </fieldset>
              <fieldset className="payment-choice" disabled={busy}>
                <legend>هتدفع إزاي؟</legend>
                <label><input type="radio" checked={method === 'cod'} onChange={() => setMethod('cod')} /> ادفع لما تستلم</label>
                {catalog.online && <label><input type="radio" checked={method === 'online'} onChange={() => setMethod('online')} /> ادفع أونلاين مع Paymob</label>}
              </fieldset>
              {error && <p className="shop-error" role="alert">{error}</p>}
              <button className="button button-lime" disabled={busy || invalid || !delivery}>
                {busy ? 'بنجهّز طلبك…' : method === 'online' ? `روح للدفع · ${money(total)}` : `أكد الطلب · ${money(total)}`}
              </button>
            </form>}
          </div>}
    </main>
  )
}

export function OrderPage({ id, onCartChange }) {
  const [order, setOrder] = useState(null)
  const [error, setError] = useState('')
  const retry = ['payment_failed', 'payment_expired'].includes(order?.status)
  useEffect(() => {
    let done = false
    let timer
    async function load() {
      try {
        const result = await api(`/orders/${encodeURIComponent(id)}`)
        if (done) return
        setOrder(result)
        setError('')
        if (['awaiting_payment', 'preparing_payment'].includes(result.status)) {
          timer = setTimeout(load, 6000)
        } else {
          completeCart(id, ['confirmed', 'paid', 'payment_review', 'shipped', 'delivered'].includes(result.status))
          onCartChange()
        }
      } catch (err) {
        if (!done) setError(err.message)
      }
    }
    load()
    return () => { done = true; clearTimeout(timer) }
  }, [id, onCartChange])

  return (
    <main className="shell commerce-page">
      <h1>تابع طلبك.</h1>
      {error && <p className="shop-error" role="alert">{error}</p>}
      {!order && !error && <p role="status">بنجيب تفاصيل الطلب…</p>}
      {order && <section className="shop-panel receipt">
        <h2 role="status">{statusLabels[order.status]}</h2>
        <p>رقم الطلب <bdi>{order.id.slice(0, 8).toUpperCase()}</bdi></p>
        {order.method === 'cod' && order.status === 'confirmed' && <p>هتدفع لما تستلم، وهنكلمك على الرقم اللي سيبته قبل التوصيل.</p>}
        {order.status === 'awaiting_payment' && <p>لو خلّصت الدفع، استنى التأكيد هنا. احتفظ بلينك الطلب عشان ترجعله.</p>}
        {order.status === 'payment_failed' && <p>مقدرناش نبدأ الدفع. ارجع للسلة وجرّب تاني.</p>}
        {order.status === 'payment_expired' && <p>وقت الدفع خلص. تقدر ترجع للسلة وتبدأ طلب جديد.</p>}
        {order.status === 'payment_review' && <p>تأكيد الدفع وصل متأخر. هنراجع الطلب وهنكلمك على الرقم اللي سيبته.</p>}
        <ul>{order.items.map((item, index) => <li key={index}>{item.name} · مقاس {item.size} × {item.quantity}</li>)}</ul>
        <strong>{money(order.total)}</strong>
        <a className="button button-lime" href={retry ? '/cart' : '/#models'}>
          {retry ? 'ارجع للسلة' : 'ارجع للموديلات'}
        </a>
      </section>}
    </main>
  )
}
