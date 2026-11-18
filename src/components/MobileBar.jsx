import { useEffect, useState } from 'react'

export default function MobileBar({ cartCount }) {
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
      <a className="button button-lime" href="#models">شوف الموديلات</a>
      <a className="button button-outline" href="/cart">شوف السلة ({cartCount})</a>
    </div>
  )
}
