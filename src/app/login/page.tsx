'use client'

import { Montserrat } from 'next/font/google'
import { InteractiveBackground } from '@/components/InteractiveBackground'
import { GraduationCap, ShieldCheck, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const montserrat = Montserrat({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-montserrat',
})

export default function LoginSelectionPage() {
  return (
    <div className={`${montserrat.variable} font-[family-name:var(--font-montserrat)] text-[#353535] bg-[#FFFFFF] relative overflow-hidden min-h-screen flex items-center justify-center px-6`}>
      <InteractiveBackground />

      <div className="w-full max-w-xl p-8 md:p-12 rounded-[3rem] bg-white border border-[#BDE5FF] shadow-[0_20px_50px_rgba(83,166,216,0.1)] relative z-10 space-y-8 text-center">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#BDE5FF]/30 text-[#53A6D8] text-xs font-bold uppercase tracking-wider">
            <span>Особистий простір PLEKAYOU</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Оберіть тип входження</h1>
          <p className="text-xs md:text-sm text-[#353535]/70 max-w-md mx-auto">
            Увійдіть у свій персональний кабінет відповідно до вашої ролі в ініціативі.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <Link 
            href="/teacher/login"
            className="p-8 rounded-[2.5rem] bg-[#F8FBFF] border border-[#BDE5FF]/80 hover:border-[#53A6D8] hover:shadow-[0_10px_30px_rgba(83,166,216,0.1)] transition-all space-y-4 text-center group flex flex-col justify-between"
          >
            <div className="w-14 h-14 bg-[#BDE5FF]/30 text-[#53A6D8] rounded-2xl flex items-center justify-center mx-auto group-hover:bg-[#53A6D8] group-hover:text-white transition-all shadow-sm">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-base">Викладач</h3>
              <p className="text-[11px] text-[#353535]/60">Розклад, учні, матеріали та волонтерські години</p>
            </div>
            <span className="inline-flex items-center justify-center gap-1 text-xs font-bold text-[#53A6D8] pt-2">
              Увійти <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          <Link 
            href="/admin/login"
            className="p-8 rounded-[2.5rem] bg-[#F8FBFF] border border-[#BDE5FF]/80 hover:border-[#53A6D8] hover:shadow-[0_10px_30px_rgba(83,166,216,0.1)] transition-all space-y-4 text-center group flex flex-col justify-between"
          >
            <div className="w-14 h-14 bg-[#BDE5FF]/30 text-[#53A6D8] rounded-2xl flex items-center justify-center mx-auto group-hover:bg-[#53A6D8] group-hover:text-white transition-all shadow-sm">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-base">Координатор</h3>
              <p className="text-[11px] text-[#353535]/60">Управління заявками, тандемами та контентом</p>
            </div>
            <span className="inline-flex items-center justify-center gap-1 text-xs font-bold text-[#53A6D8] pt-2">
              Увійти <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        </div>

        <div className="pt-2">
          <Link href="/" className="text-xs font-bold text-[#353535]/60 hover:text-[#53A6D8] transition-colors">
            &larr; Повернутися на головну сторінку
          </Link>
        </div>
      </div>
    </div>
  )
}