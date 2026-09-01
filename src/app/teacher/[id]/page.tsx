'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Montserrat } from 'next/font/google'
import { InteractiveBackground } from '@/components/InteractiveBackground'
import { GraduationCap, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const montserrat = Montserrat({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-montserrat',
})

export default function LegacyTeacherPage() {
  const router = useRouter()

  useEffect(() => {
    // Автоматичний редирект на сторінку входу в кабінет викладача через 2 секунди
    const timer = setTimeout(() => {
      router.push('/teacher/login')
    }, 2000)
    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className={`${montserrat.variable} font-[family-name:var(--font-montserrat)] text-[#353535] bg-[#FFFFFF] relative overflow-hidden min-h-screen flex items-center justify-center px-6`}>
      <InteractiveBackground />

      <div className="max-w-md w-full p-10 rounded-[3rem] bg-white border border-[#BDE5FF] shadow-[0_20px_50px_rgba(83,166,216,0.1)] text-center relative z-10 space-y-6">
        <div className="w-16 h-16 bg-[#BDE5FF]/30 text-[#53A6D8] rounded-2xl flex items-center justify-center mx-auto shadow-sm">
          <GraduationCap className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Особистий кабінет викладача</h1>
          <p className="text-xs text-[#353535]/70 leading-relaxed">
            Публічні сторінки профілів оновлено на захищені особисті кабінети. Зараз ми перенаправимо вас на сторінку входу.
          </p>
        </div>

        <Link 
          href="/teacher/login"
          className="w-full py-4 rounded-2xl bg-[#53A6D8] text-white text-xs font-bold hover:bg-[#3f8dbe] transition-all shadow-md flex items-center justify-center gap-2"
        >
          Увійти в кабінет <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}