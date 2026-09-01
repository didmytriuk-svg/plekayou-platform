import Link from 'next/link'
import Image from 'next/image'

export function Footer() {
  return (
    <footer className="bg-sky-950 text-white border-t border-sky-900 py-16">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="space-y-4">
          <Image 
            src="/logo.png" 
            alt="PLEKAYOU Logo" 
            width={140} 
            height={40} 
            className="h-9 w-auto object-contain brightness-0 invert" 
          />
          <p className="text-sky-200/80 text-sm leading-relaxed">
            Громадська ініціатива peer-to-peer освіти та підтримки для молоді в Україні.
          </p>
        </div>
        <div className="space-y-3">
          <p className="text-sm font-bold uppercase tracking-wider text-sky-400">Навігація</p>
          <ul className="space-y-2 text-sm text-sky-200/80">
            <li><Link href="/" className="hover:text-white transition-colors">Головна</Link></li>
            <li><Link href="/opportunities" className="hover:text-white transition-colors">Можливості</Link></li>
            <li><Link href="/events" className="hover:text-white transition-colors">Події</Link></li>
          </ul>
        </div>
        <div className="space-y-3">
          <p className="text-sm font-bold uppercase tracking-wider text-sky-400">Долучитись</p>
          <ul className="space-y-2 text-sm text-sky-200/80">
            <li><Link href="/join/student" className="hover:text-white transition-colors">Стати учнем</Link></li>
            <li><Link href="/join/volunteer" className="hover:text-white transition-colors">Стати волонтером</Link></li>
            <li><Link href="/join/partner" className="hover:text-white transition-colors">Стати партнером</Link></li>
          </ul>
        </div>
        <div className="space-y-3">
          <p className="text-sm font-bold uppercase tracking-wider text-sky-400">Контакти</p>
          <p className="text-sm text-sky-200/80">Зв'яжіться з нами через соціальні мережі або офіційну пошту ініціативи.</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 pt-12 mt-12 border-t border-sky-900/60 text-center text-xs text-sky-400">
        © {new Date().getFullYear()} PLEKAYOU. Усі права захищено.
      </div>
    </footer>
  )
}