import { faqs } from '../data.js'

export default function Faq() {
  return (
    <section id="faq" className="faq" data-reveal>
      <h2>أسئلة بتتكرر</h2>
      <div className="faq-list">
        {faqs.map(({ q, a }) => (
          <details key={q} className="faq-item">
            <summary>{q}<span className="faq-toggle" aria-hidden="true">+</span></summary>
            <p className="faq-answer">{a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
