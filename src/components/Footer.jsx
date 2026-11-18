import { social, PHONES } from '../data.js'
import { whatsappLink } from '../whatsapp.js'

export default function Footer() {
  return (
    <footer className="bg-ink text-paper pb-24 md:pb-0">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 flex flex-col md:flex-row gap-8 md:items-center justify-between">
        <div className="flex items-center gap-4">
          <img src="/logo.png" alt="شق شوز" className="h-14 w-14 rounded-full object-cover" />
          <div>
            <p className="font-display font-bold text-lg">شق شوز</p>
            <p className="text-sm text-paper/50">خطوتك اللي جاية شق شوز</p>
          </div>
        </div>

        <div className="flex flex-col gap-1 text-sm">
          <span className="text-paper/50">كلمنا</span>
          {PHONES.map((n) => (
            <a key={n} href={`tel:${n}`} dir="ltr" className="font-display text-paper hover:text-teal text-right">
              {n}
            </a>
          ))}
        </div>

        <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-paper/70">
          <li><a href={whatsappLink()} target="_blank" rel="noreferrer" className="hover:text-teal">واتساب</a></li>
          <li><a href={social.instagram} target="_blank" rel="noreferrer" className="hover:text-teal">Instagram</a></li>
          <li><a href={social.facebook} target="_blank" rel="noreferrer" className="hover:text-teal">Facebook</a></li>
          <li><a href={social.tiktok} target="_blank" rel="noreferrer" className="hover:text-teal">TikTok</a></li>
        </ul>
      </div>
      <div className="border-t border-white/5">
        <p className="mx-auto max-w-6xl px-4 sm:px-6 py-5 text-xs text-paper/40">
          © {new Date().getFullYear()} شق شوز. كل الحقوق محفوظة.
        </p>
      </div>
    </footer>
  )
}
