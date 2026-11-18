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
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Perks />
        <Products />
        <RealShots />
        <SizeGuide />
        <Faq />
      </main>
      <Footer />
      <MobileBar />
    </>
  )
}
