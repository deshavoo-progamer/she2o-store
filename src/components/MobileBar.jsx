import { product } from '../data.js'

export default function MobileBar() {
  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-paper/95 backdrop-blur border-t border-ink/10 px-4 py-3 flex items-center justify-between gap-4">
      <div className="text-sm leading-tight">
        <p className="font-display font-semibold">{product.name}</p>
        <p className="text-ink/60">{product.price.toLocaleString('en')} ج.م</p>
      </div>
      <a
        href="#model"
        className="inline-flex items-center h-11 px-6 rounded-full bg-rust text-paper text-sm font-semibold"
      >
        اختار مقاسك
      </a>
    </div>
  )
}
