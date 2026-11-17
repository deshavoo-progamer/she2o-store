import { faqs } from '../data.js'

export default function Faq() {
  return (
    <section id="faq" className="scroll-mt-28 pb-20 md:pb-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h2 className="font-display font-bold text-3xl">أسئلة بتتسأل كتير</h2>
        <div className="mt-8 border-t border-ink/10">
          {faqs.map((f) => (
            <details key={f.q} className="group border-b border-ink/10">
              <summary className="flex items-center justify-between gap-4 py-5 cursor-pointer font-semibold">
                {f.q}
                <span className="shrink-0 text-xl text-rust transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="pb-5 -mt-1 text-ink/65 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
