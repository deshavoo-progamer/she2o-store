import { perks } from '../data.js'

export default function Perks() {
  return (
    <section className="border-b border-ink/10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x sm:divide-x-reverse divide-ink/10">
        {perks.map((p, i) => (
          <div key={p.title} className="py-6 sm:px-6 first:sm:pr-0 flex gap-4 items-baseline">
            <span className="font-display text-sm text-rust">0{i + 1}</span>
            <div>
              <h3 className="font-display font-semibold">{p.title}</h3>
              <p className="text-sm text-ink/60 mt-1">{p.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
