import { perks } from '../data.js'

export default function Perks() {
  return (
    <section className="perks">
      <ul className="shell perk-list">
        {perks.map(perk => (
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
