import { useEffect, useRef } from 'react'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import Perks from './components/Perks.jsx'
import Products from './components/Products.jsx'
import RealShots from './components/RealShots.jsx'
import SizeGuide from './components/SizeGuide.jsx'
import Faq from './components/Faq.jsx'
import Footer from './components/Footer.jsx'
import MobileBar from './components/MobileBar.jsx'

export default function App() {
  const mainRef = useRef(null)

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return

    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.setAttribute('data-revealed', '')
        observer.unobserve(entry.target)
      }
    }, { threshold: 0.12 })

    mainRef.current?.querySelectorAll('[data-reveal]').forEach(element => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <Header />
      <main ref={mainRef}>
        <Hero />
        <Perks />
        <Products />
        <RealShots />
        <div className="shell help-grid">
          <SizeGuide />
          <Faq />
        </div>
      </main>
      <Footer />
      <MobileBar />
    </>
  )
}
