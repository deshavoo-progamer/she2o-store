import { social } from '../data.js'
import { whatsappLink } from '../whatsapp.js'

export default function Footer() {
  return (
    <footer className="bg-ink text-paper pb-24 md:pb-0">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 flex flex-col md:flex-row gap-8 md:items-center justify-between">
        <div className="flex items-center gap-4">
          <img src="/logo.jpg" alt="شقو" className="h-14 w-14 rounded-full object-cover" />
          <div>
            <p className="font-display font-bold text-lg">شقو</p>
            <p className="text-sm text-paper/50">خطوتك اللي جاية شقو</p>
          </div>
        </div>

        <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-paper/70">
          <li><a href={whatsappLink()} target="_blank" rel="noreferrer" className="hover:text-sand">واتساب</a></li>
          <li><a href={social.instagram} target="_blank" rel="noreferrer" className="hover:text-sand">Instagram</a></li>
          <li><a href={social.facebook} target="_blank" rel="noreferrer" className="hover:text-sand">Facebook</a></li>
          <li><a href={social.tiktok} target="_blank" rel="noreferrer" className="hover:text-sand">TikTok</a></li>
        </ul>
      </div>
      <div className="border-t border-white/5">
        <p className="mx-auto max-w-6xl px-4 sm:px-6 py-5 text-xs text-paper/40">
          © {new Date().getFullYear()} شقو. كل الحقوق محفوظة.
        </p>
      </div>
    </footer>
  )
}
