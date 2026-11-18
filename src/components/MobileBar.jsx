import { useEffect, useState } from 'react'
import { whatsappLink } from '../whatsapp.js'

export default function MobileBar() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const hero = document.getElementById('top')
    if (!hero || !('IntersectionObserver' in window)) return

    const observer = new IntersectionObserver(([entry]) => {
      setVisible(entry.boundingClientRect.bottom <= 0)
    })
    observer.observe(hero)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="mobile-bar" hidden={!visible}>
      <a className="button button-orange" href="#models">شوف الموديلات</a>
      <a className="button button-outline" href={whatsappLink()} target="_blank" rel="noreferrer">اطلب على واتساب</a>
    </div>
  )
}
