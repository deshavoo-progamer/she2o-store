import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import Perks from './components/Perks.jsx'
import Product from './components/Product.jsx'
import Story from './components/Story.jsx'
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
        <Product />
        <Story />
        <SizeGuide />
        <Faq />
      </main>
      <Footer />
      <MobileBar />
    </>
  )
}
