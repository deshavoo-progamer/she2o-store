import { perks } from '../data.js'

export default function Perks({ cairoFree }) {
  const delivery = cairoFree
    ? { title: 'التوصيل ببلاش في القاهرة', text: 'شوف مصاريف أي محافظة تانية عند الطلب.' }
    : { title: 'توصيل لحد عندك', text: 'اختار محافظتك وشوف المصاريف قبل ما تأكد الطلب.' }
  return (
    <section className="perks">
      <ul className="shell perk-list">
        {[delivery, ...perks].map(perk => (
          <li key={perk.title} data-reveal>
            <span className="perk-check" aria-hidden="true">✓</span>
            <div>
              <h2>{perk.title}</h2>
              <p>{perk.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
