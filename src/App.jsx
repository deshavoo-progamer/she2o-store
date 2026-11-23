import { useCallback, useEffect, useRef, useState } from 'react'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import Perks from './components/Perks.jsx'
import Products from './components/Products.jsx'
import SizeGuide from './components/SizeGuide.jsx'
import Faq from './components/Faq.jsx'
import Footer from './components/Footer.jsx'
import MobileBar from './components/MobileBar.jsx'
import Admin from './components/Admin.jsx'
import { CartPage, OrderPage } from './components/Checkout.jsx'
import { api, getCart, saveCart } from './shop.js'
import './commerce.css'

function Storefront() {
  const path = window.location.pathname.replace(/\/$/, '') || '/'
  const home = path === '/'
  const [store, setStore] = useState(null)
  const [error, setError] = useState('')
  const [cart, setCart] = useState(getCart)
  const mainRef = useRef(null)
  const orderId = path.startsWith('/order/') ? path.split('/')[2] : null
  const onCartChange = useCallback(() => setCart(getCart()), [])

  useEffect(() => {
    if (!orderId) api('/store').then(setStore).catch(err => setError(err.message))
    window.addEventListener('storage', onCartChange)
    return () => window.removeEventListener('storage', onCartChange)
  }, [onCartChange, orderId])

  useEffect(() => {
    if (!home || !('IntersectionObserver' in window)) return

    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.setAttribute('data-revealed', '')
        observer.unobserve(entry.target)
      }
    }, { threshold: 0.12 })

    mainRef.current?.querySelectorAll('[data-reveal]:not([data-revealed])').forEach(element => observer.observe(element))
    return () => observer.disconnect()
  }, [home, store])

  function updateCart(items) {
    saveCart(items)
    setCart(items)
  }

  function addToCart(product, size) {
    const index = cart.findIndex(item => item.id === product.id && item.size === size)
    const current = index < 0 ? 0 : cart[index].quantity
    if (current >= Math.min(product.stock[size], 10)) return false
    updateCart(index < 0 ? [...cart, { id: product.id, size, quantity: 1 }]
      : cart.map((item, i) => i === index ? { ...item, quantity: current + 1 } : item))
    return true
  }

  const count = cart.reduce((total, item) => total + item.quantity, 0)
  const cairoFree = store?.shipping.some(zone => zone.zone === 'القاهرة' && zone.fee === 0)
  return (
    <>
      <Header cartCount={count} cairoFree={cairoFree} />
      {home ? <main ref={mainRef}>
        <Hero />
        <Perks cairoFree={cairoFree} />
        <Products products={store?.products} error={error} add={addToCart} />
        <div className="shell help-grid">
          <SizeGuide />
          <Faq />
        </div>
      </main> : orderId ? <OrderPage id={orderId} onCartChange={onCartChange} />
        : error ? <main className="shell commerce-page"><p role="alert">{error}</p><a className="text-link" href={path}>جرّب تاني</a></main>
          : <CartPage store={store} cart={cart} setCart={updateCart} checkout={path === '/checkout'} />}
      <Footer />
      {home && <MobileBar cartCount={count} />}
    </>
  )
}

export default function App() {
  return /^\/admin\/?$/.test(window.location.pathname) ? <Admin /> : <Storefront />
}
