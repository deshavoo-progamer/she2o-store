import { useEffect, useState } from 'react'
import { SIZES } from '../data.js'
import { api, money, statusLabels } from '../shop.js'

const emptyProduct = {
  name: '', description: '', tag: '', price: null, image: '', active: false,
  stock: Object.fromEntries(SIZES.map(size => [size, 0])),
}

function ProductEditor({ product, close, refresh }) {
  const [draft, setDraft] = useState(product)
  const [price, setPrice] = useState(product.price == null ? '' : String(product.price / 100))
  const [size, setSize] = useState('')
  const [file, setFile] = useState(null)
  const [uploadedImage, setUploadedImage] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const change = (key, value) => setDraft(current => ({ ...current, [key]: value }))

  async function save(event) {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      let image = uploadedImage || draft.image
      if (file && !uploadedImage) {
        if (file.size > 2097152) throw new Error('اختار صورة حجمها لحد ٢ ميجا.')
        const data = await new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result.split(',')[1])
          reader.onerror = reject
          reader.readAsDataURL(file)
        })
        image = (await api('/admin/images', { method: 'POST', body: { type: file.type, data } })).image
        setUploadedImage(image)
      }
      const body = { ...draft, price: price === '' ? null : Math.round(Number(price) * 100), image }
      await api(product.id ? `/admin/products/${product.id}` : '/admin/products', { method: product.id ? 'PUT' : 'POST', body })
      close()
      await refresh()
    } catch (err) {
      setError(err.message ?? 'مقدرناش نحفظ التعديل.')
    } finally {
      setBusy(false)
    }
  }

  function addSize(event) {
    event.preventDefault()
    const value = Number(size)
    if (!Number.isInteger(value) || value < 20 || value > 60) return
    if (!(value in draft.stock)) change('stock', { ...draft.stock, [value]: 0 })
    setSize('')
  }

  return <section className="shop-panel product-editor">
    <div className="admin-row"><h2>{product.id ? 'عدّل الموديل' : 'ضيف موديل'}</h2><button type="button" className="inline-action" onClick={close} disabled={busy}>اقفل</button></div>
    <form className="shop-form" onSubmit={save}>
      <fieldset disabled={busy} className="form-fields">
        <label>اسم الموديل<input value={draft.name} onChange={e => change('name', e.target.value)} maxLength="120" required /></label>
        <label>السعر بالجنيه<input value={price} onChange={e => setPrice(e.target.value)} type="number" min=".01" max="100000" step=".01" placeholder="سيبه فاضي لو لسه" /></label>
        <label className="full-field">وصف الكوتشي<textarea rows="2" value={draft.description} onChange={e => change('description', e.target.value)} maxLength="600" /></label>
        <label>الكلمة اللي على الصورة<input value={draft.tag} onChange={e => change('tag', e.target.value)} maxLength="32" /></label>
        <label>صورة الكوتشي<input type="file" accept="image/jpeg,image/png,image/webp" onChange={e => { setFile(e.target.files[0]); setUploadedImage('') }} required={!draft.image && !uploadedImage} /></label>
        {(uploadedImage || draft.image) && <img className="admin-preview" src={uploadedImage || draft.image} alt="" />}
        <label className="checkbox-field"><input type="checkbox" checked={draft.active} onChange={e => change('active', e.target.checked)} /> ظاهر في المتجر</label>
      </fieldset>
      <fieldset disabled={busy} className="inventory-editor">
        <legend>المخزون لكل مقاس</legend>
        <div className="inventory-list">{Object.entries(draft.stock).map(([key, quantity]) => (
          <div key={key}>
            <label>مقاس {key}<input type="number" min="0" max="100000" required value={quantity} onChange={e => change('stock', { ...draft.stock, [key]: e.target.valueAsNumber || 0 })} /></label>
            <button type="button" className="inline-action" aria-label={`شيل مقاس ${key}`} onClick={() => change('stock', Object.fromEntries(Object.entries(draft.stock).filter(([value]) => value !== key)))}>شيل</button>
          </div>
        ))}</div>
        <div className="admin-row add-size">
          <label>مقاس تاني<input type="number" value={size} onChange={e => setSize(e.target.value)} /></label>
          <button type="button" className="button button-dark" onClick={addSize}>ضيف المقاس</button>
        </div>
      </fieldset>
      {error && <p className="shop-error" role="alert">{error}</p>}
      <button className="button button-lime" disabled={busy}>{busy ? 'بنحفظ…' : 'احفظ الموديل'}</button>
    </form>
  </section>
}

function ShippingEditor({ shipping, update, run }) {
  const [zone, setZone] = useState('')
  const [fee, setFee] = useState('')
  async function save(event) {
    event.preventDefault()
    await run(async () => {
      update(await api('/admin/shipping', { method: 'PUT', body: { zone, fee: Math.round(Number(fee) * 100) } }))
      setZone('')
      setFee('')
    })
  }
  return <section className="shop-panel">
    <h2>مصاريف التوصيل</h2>
    <ul className="admin-list">{shipping.map(delivery => (
      <li className="admin-row" key={delivery.zone}>
        <span>{delivery.zone} · {delivery.fee ? money(delivery.fee) : 'ببلاش'}</span>
        <button type="button" className="inline-action" onClick={() => { setZone(delivery.zone); setFee(String(delivery.fee / 100)) }}>عدّل</button>
        <button type="button" className="inline-action" onClick={() => run(async () => update(await api('/admin/shipping', { method: 'PUT', body: { zone: delivery.zone, fee: null } })))}>وقّف التوصيل</button>
      </li>
    ))}</ul>
    <form className="shop-form" onSubmit={save}>
      <label>المحافظة<input value={zone} onChange={e => setZone(e.target.value)} maxLength="80" required /></label>
      <label>المصاريف بالجنيه<input type="number" min="0" max="1000" step=".01" value={fee} onChange={e => setFee(e.target.value)} required /></label>
      <button className="button button-lime">احفظ المصاريف</button>
    </form>
  </section>
}

export default function Admin() {
  const [data, setData] = useState(null)
  const [tab, setTab] = useState('products')
  const [password, setPassword] = useState('')
  const [editing, setEditing] = useState(null)
  const [offset, setOffset] = useState(0)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function refresh(page = offset) {
    setData(await api(`/admin/data?offset=${page}`))
    setOffset(page)
  }

  useEffect(() => {
    api('/admin/data').then(setData).catch(err => {
      if (err.status !== 401) setError(err.message)
    }).finally(() => setLoading(false))
  }, [])

  async function run(action) {
    if (busy) return
    setBusy(true)
    setError('')
    try { await action() } catch (err) {
      if (err.status === 401) setData(null)
      setError(err.message)
    } finally { setBusy(false) }
  }

  async function login(event) {
    event.preventDefault()
    await run(async () => {
      await api('/admin/login', { method: 'POST', body: { password } })
      setPassword('')
      await refresh(0)
    })
  }

  function archive(product) {
    if (!window.confirm(`تشيل «${product.name}» من المتجر؟`)) return
    return run(async () => {
      await api(`/admin/products/${product.id}`, { method: 'DELETE', body: { revision: product.revision } })
      await refresh()
    })
  }

  return <main className="shell commerce-page admin-page">
    <header className="admin-masthead">
      <a className="brand" href="/"><img src="/shaqo-mark.png" width="82" height="62" alt="شقّو" /></a>
      <a className="button button-outline" href="/">افتح المتجر ↗</a>
    </header>
    <h1>إدارة شقّو.</h1>
    {error && <p className="shop-error" role="alert">{error}</p>}
    {loading && <p role="status">بنحمّل لوحة الإدارة…</p>}
    {!loading && !data && <form className="shop-panel shop-form admin-login" onSubmit={login}>
      <h2>سجّل دخولك</h2>
      <label>كلمة السر<input type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} required /></label>
      <button className="button button-lime" disabled={busy}>{busy ? 'لحظة…' : 'ادخل'}</button>
    </form>}
    {data && <>
      <nav className="admin-tabs" aria-label="أقسام الإدارة">
        {[
          ['products', 'الموديلات'], ['orders', 'الطلبات'], ['shipping', 'التوصيل'],
        ].map(([value, label]) => <button key={value} type="button" className="button button-dark" aria-pressed={tab === value} onClick={() => { setTab(value); setEditing(null) }}>{label}</button>)}
        <button type="button" className="button button-dark admin-logout" disabled={busy} onClick={() => run(async () => {
          await api('/admin/logout', { method: 'POST' })
          setData(null)
          setEditing(null)
        })}>سجّل خروج</button>
      </nav>
      {tab === 'products' && (editing
        ? <ProductEditor key={editing.id ?? 'new'} product={editing} close={() => setEditing(null)} refresh={() => refresh()} />
        : <section className="shop-panel">
          <div className="admin-row"><h2>الموديلات والمخزون</h2>
            <button type="button" className="button button-lime" onClick={() => setEditing(emptyProduct)}>ضيف موديل +</button>
            <button type="button" className="inline-action" onClick={() => run(() => refresh())}>حدّث القائمة</button>
          </div>
          <ul className="admin-list">{data.products.map(product => (
            <li className="admin-product" key={product.id}>
              <img src={product.image} alt="" loading="lazy" width="80" height="60" />
              <div><strong>{product.name}</strong><p>{product.price ? money(product.price) : 'لسه من غير سعر'} · {Object.values(product.stock).reduce((total, count) => total + count, 0)} في المخزون · {product.archived ? 'متشال من المتجر' : product.active ? 'ظاهر' : 'مستخبي'}</p></div>
              <div className="admin-row">
                <button type="button" className="button button-dark" onClick={() => setEditing(product)}>عدّل</button>
                {!product.archived && <button type="button" className="inline-action" disabled={busy} onClick={() => archive(product)}>شيل من المتجر</button>}
              </div>
            </li>
          ))}</ul>
        </section>)}
      {tab === 'orders' && <section className="shop-panel">
        <div className="admin-row"><h2>الطلبات</h2><button type="button" className="inline-action" disabled={busy} onClick={() => run(() => refresh(0))}>حدّث الطلبات</button></div>
        {!data.orders.length && <p>لسه مفيش طلبات.</p>}
        <div className="admin-list">{data.orders.map(order => <details key={order.id} className="admin-order">
          <summary><bdi>#{order.id.slice(0, 8).toUpperCase()}</bdi> · {order.customer.name} · {money(order.total)} · {statusLabels[order.status]}</summary>
          <p>{new Date(order.createdAt).toLocaleString('ar-EG', { timeZone: 'Africa/Cairo' })} · {order.method === 'online' ? 'دفع أونلاين' : 'دفع عند الاستلام'}</p>
          <p>{order.customer.zone}، {order.customer.city}، {order.customer.address}</p>
          <p><a href={`tel:${order.customer.phone}`} dir="ltr">{order.customer.phone}</a>{order.customer.email && <> · <bdi>{order.customer.email}</bdi></>}</p>
          {order.customer.notes && <p>{order.customer.notes}</p>}
          {order.providerOrder && <p>رقم العملية عند Paymob <bdi>{order.providerOrder}</bdi></p>}
          {order.status === 'payment_review' && <p className="shop-error">تأكيد الدفع وصل بعد ما المخزون اتحرّر. راجع العملية في Paymob وتواصل مع العميل قبل الشحن.</p>}
          <ul>{order.items.map((item, i) => <li key={i}>{item.name} · مقاس {item.size} × {item.quantity}</li>)}</ul>
          <div className="admin-row">
            {({ confirmed: [['shipped', 'الطلب اتشحن'], ['cancelled', 'الغي الطلب']], paid: [['shipped', 'الطلب اتشحن']], shipped: [['delivered', 'الطلب وصل']] }[order.status] ?? []).map(([status, label]) => (
              <button type="button" className="button button-dark" key={status} disabled={busy} onClick={() => run(async () => {
                if (status === 'cancelled' && !window.confirm('تلغي الطلب وترجّع الكمية للمخزون؟')) return
                await api(`/admin/orders/${order.id}`, { method: 'PATCH', body: { status } })
                await refresh()
              })}>{label}</button>
            ))}
          </div>
        </details>)}</div>
        <div className="admin-row">
          {offset > 0 && <button type="button" className="inline-action" onClick={() => run(() => refresh(offset - 50))}>الطلبات الأحدث</button>}
          {data.hasMore && <button type="button" className="inline-action" onClick={() => run(() => refresh(offset + 50))}>طلبات أقدم</button>}
        </div>
      </section>}
      {tab === 'shipping' && <ShippingEditor shipping={data.shipping} update={shipping => setData(current => ({ ...current, shipping }))} run={run} />}
    </>}
  </main>
}
