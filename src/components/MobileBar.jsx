import { minPrice } from '../data.js'

export default function MobileBar() {
  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-paper/95 backdrop-blur border-t border-ink/10 px-4 py-3 flex items-center justify-between gap-4">
      <div className="text-sm leading-tight">
        <p className="font-display font-semibold">توصيل مجاني في القاهرة</p>
        <p className="text-ink/60">تبدأ من {minPrice} ج.م</p>
      </div>
      <a
        href="#models"
        className="inline-flex items-center h-11 px-6 rounded-full bg-flame text-ink text-sm font-semibold"
      >
        شوف الموديلات
      </a>
    </div>
  )
}
