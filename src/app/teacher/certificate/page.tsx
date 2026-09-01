'use client'

import { useState, useEffect } from 'react'
import { Montserrat } from 'next/font/google'
import { createClient } from '@/lib/supabase/client'
import { Printer, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

const montserrat = Montserrat({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-montserrat',
})

export default function TeacherCertificatePage() {
  const supabase = createClient()
  const router = useRouter()
  const [teacher, setTeacher] = useState<any>(null)
  const [totalHours, setTotalHours] = useState(0)
  const [lang, setLang] = useState<'ua' | 'en'>('ua')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadCertificateData() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        let teacherEmail = user?.email || localStorage.getItem('plekayou_teacher_email') || ''

        if (!teacherEmail) {
          router.push('/teacher/login')
          return
        }

        const { data: teacherData } = await supabase
          .from('volunteer_applications')
          .select('*')
          .eq('email', teacherEmail)
          .single()

        if (!teacherData) {
          router.push('/teacher/login')
          return
        }
        setTeacher(teacherData)

        const { data: lessonsData } = await supabase
          .from('teacher_lessons')
          .select('*')
          .eq('teacher_email', teacherEmail)
          .eq('status', 'completed')

        const hours = lessonsData ? lessonsData.reduce((acc, curr) => acc + (curr.hours_earned || 2), 0) : 0
        setTotalHours(hours)
      } catch (err) {
        console.error('Error loading certificate:', err)
      } finally {
        setLoading(false)
      }
    }
    loadCertificateData()
  }, [supabase, router])

  const handlePrint = () => {
    window.print()
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center font-bold text-sky-600 bg-white">Завантаження сертифіката...</div>
  }

  return (
    <div className={`${montserrat.variable} font-[family-name:var(--font-montserrat)] text-[#353535] bg-[#EAF4FB] relative overflow-x-hidden min-h-screen py-8 px-4 flex flex-col items-center justify-center print:bg-white print:p-0 print:m-0`}>
      
      {/* СТИЛІ ДЛЯ ІДЕАЛЬНОГО АЛЬБОМНОГО ДРУКУ НА 1 АРКУШ */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4 landscape;
            margin: 0;
          }
          body {
            background: white !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .print\:hidden {
            display: none !important;
          }
          .certificate-wrapper {
            width: 100vw !important;
            height: 100vh !important;
            max-width: none !important;
            max-height: none !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            margin: 0 !important;
          }
        }
      `}</style>

      {/* КНОПКИ КЕРУВАННЯ ТА ВИБІР МОВИ (ховаються при друці) */}
      <div className="w-full max-w-5xl flex items-center justify-between gap-4 mb-6 print:hidden">
        <Link href="/teacher/dashboard" className="px-5 py-2.5 rounded-xl bg-white border border-[#BDE5FF] text-[#53A6D8] text-xs font-bold hover:bg-[#53A6D8] hover:text-white transition-all flex items-center gap-2 shadow-sm">
          <ArrowLeft className="w-4 h-4" /> Назад до кабінету
        </Link>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white border border-[#BDE5FF] rounded-xl p-1 text-xs font-bold shadow-sm">
            <button 
              onClick={() => setLang('ua')} 
              className={`px-4 py-2 rounded-lg transition-all ${lang === 'ua' ? 'bg-[#53A6D8] text-white' : 'text-[#353535]/70'}`}
            >
              UA
            </button>
            <button 
              onClick={() => setLang('en')} 
              className={`px-4 py-2 rounded-lg transition-all ${lang === 'en' ? 'bg-[#53A6D8] text-white' : 'text-[#353535]/70'}`}
            >
              EN
            </button>
          </div>

          <button onClick={handlePrint} className="px-6 py-3 rounded-xl bg-[#53A6D8] text-white text-xs font-bold hover:bg-[#3f8dbe] transition-all flex items-center gap-2 shadow-md">
            <Printer className="w-4 h-4" /> Роздрукувати / PDF
          </button>
        </div>
      </div>

      {/* КОНТЕЙНЕР СЕРТИФІКАТА З ТВОЇМ PNG ШАБЛОНОМ */}
      <div className="certificate-wrapper w-full max-w-5xl aspect-[1.414/1] relative overflow-hidden shadow-[0_25px_60px_rgba(83,166,216,0.25)] rounded-[2rem] bg-white">
        
        {/* Твій завантажений шаблон як фон */}
        <Image 
          src={lang === 'ua' ? '/certificate-template-ua.png' : '/certificate-template-en.png'} 
          alt={`Certificate ${lang.toUpperCase()}`} 
          fill
          className="object-cover"
          priority
        />

        {/* СУВОРЕ ПОЗИЦІОНУВАННЯ НА ЛІНІЯХ (ЗА ДОПОМОГОЮ GRID/FLEX З ТОЧНИМИ ВІДСТУПАМИ) */}
        <div className="absolute inset-0 z-10 flex flex-col justify-between px-16 py-12 md:px-24 md:py-16 text-center select-none pointer-events-none">
          
          {/* Порожній простір зверху */}
          <div className="h-[38%]"></div>

          {/* 1. ПІБ викладача — розміщується рівно по центру над головною лінією шаблону */}
          <div className="h-[15%] flex items-center justify-center">
            <h2 className="text-xl md:text-3xl font-extrabold text-[#353535] tracking-tight uppercase">
              {teacher?.full_name}
            </h2>
          </div>

          {/* Проміжний простір до рядка годин */}
          <div className="h-[23%]"></div>

          {/* 2. Кількість годин — стає праворуч у пробіл після «КІЛЬКІСТЬ ВОЛОНТЕРСЬКИХ ГОДИН: _____» */}
          <div className="h-[12%] flex items-center justify-start pl-[52%] md:pl-[56%]">
            <span className="text-base md:text-xl font-extrabold text-[#53A6D8] tracking-widest">
              {totalHours}
            </span>
          </div>

        </div>

      </div>

    </div>
  )
}