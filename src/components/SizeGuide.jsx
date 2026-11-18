import { sizeChart } from '../data.js'

export default function SizeGuide() {
  return (
    <section id="sizes" className="scroll-mt-28 py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 grid md:grid-cols-2 gap-10 md:gap-16">
        <div>
          <h2 className="font-display font-bold text-3xl">تعرف مقاسك إزاي؟</h2>
          <ol className="mt-6 space-y-4 text-ink/70 leading-relaxed">
            <li className="flex gap-3">
              <span className="font-display text-flame-dark">1</span>
              حط ورقة على الأرض جنب الحيطة، واقف عليها وكعبك لازق في الحيطة.
            </li>
            <li className="flex gap-3">
              <span className="font-display text-flame-dark">2</span>
              علّم بالقلم عند آخر صباع في رجلك.
            </li>
            <li className="flex gap-3">
              <span className="font-display text-flame-dark">3</span>
              قيس المسافة بالسنتي وقارنها بالجدول. لو بين مقاسين خد الأكبر.
            </li>
          </ol>
        </div>

        <div className="rounded-2xl border border-ink/10 overflow-hidden bg-white/40">
          <table className="w-full text-center">
            <thead className="bg-ink text-paper text-sm">
              <tr>
                <th className="py-3 font-medium">المقاس (EU)</th>
                <th className="py-3 font-medium">طول الرجل (سم)</th>
              </tr>
            </thead>
            <tbody className="font-display">
              {sizeChart.map((r) => (
                <tr key={r.eu} className="border-t border-ink/10">
                  <td className="py-3">{r.eu}</td>
                  <td className="py-3 text-ink/70">{r.cm}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
