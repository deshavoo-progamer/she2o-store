import { sizeChart } from '../data.js'

export default function SizeGuide() {
  return (
    <section id="sizes" className="size-guide" data-reveal>
      <h2>تعرف مقاسك إزاي؟</h2>
      <ol className="measurement-steps">
        <li>حط ورقة جنب الحيطة، وقِف عليها وكعبك لازق في الحيطة.</li>
        <li>علّم بالقلم عند طرف أطول صباع في رجلك.</li>
        <li>قيس الطول بالسنتي وقارنه بالجدول. لو بين مقاسين خد الأكبر.</li>
      </ol>
      <table className="size-table">
        <thead>
          <tr>
            <th scope="col">المقاس الأوروبي</th>
            <th scope="col">طول رجلك بالسنتي</th>
          </tr>
        </thead>
        <tbody>
          {sizeChart.map(row => (
            <tr key={row.eu}>
              <th scope="row">{row.eu}</th>
              <td>{row.cm}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
