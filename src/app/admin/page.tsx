'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { Montserrat } from 'next/font/google'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { InteractiveBackground } from '@/components/InteractiveBackground'
import { ShieldCheck, Users, Calendar, Sparkles, BookOpen, LogOut, FileText, Clock } from 'lucide-react'

const montserrat = Montserrat({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-montserrat',
})

export default function AdminDashboardPage() {
  const supabase = createClient()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    volunteers: 0,
    students: 0,
    events: 0,
    opportunities: 0,
    articles: 0
  })
  const [volunteersList, setVolunteersList] = useState<any[]>([])

  useEffect(() => {
    async function checkAuthAndFetchData() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/admin/login')
        return
      }

      try {
        const { count: volCount } = await supabase.from('volunteer_applications').select('*', { count: 'exact', head: true })
        const { count: stCount } = await supabase.from('student_applications').select('*', { count: 'exact', head: true })
        const { count: evCount } = await supabase.from('events').select('*', { count: 'exact', head: true })
        const { count: oppCount } = await supabase.from('opportunities').select('*', { count: 'exact', head: true })
        const { count: artCount } = await supabase.from('articles').select('*', { count: 'exact', head: true })

        setStats({
          volunteers: volCount || 0,
          students: stCount || 0,
          events: evCount || 0,
          opportunities: oppCount || 0,
          articles: artCount || 0
        })

        const { data: vols } = await supabase
          .from('volunteer_applications')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5)

        if (vols) setVolunteersList(vols)
      } catch (err) {
        console.error('Error fetching admin data:', err)
      } finally {
        setLoading(false)
      }
    }

    checkAuthAndFetchData()
  }, [supabase, router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFFFF] text-[#53A6D8] font-bold text-sm">
        Завантаження панелі керування...
      </div>
    )
  }

  return (
    <div className={`${montserrat.variable} font-[family-name:var(--font-montserrat)] text-[#353535] bg-[#FFFFFF] relative overflow-hidden min-h-screen flex flex-col`}>
      <InteractiveBackground />
      <Header />

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 flex-grow w-full space-y-10">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-8 rounded-[2.5rem] bg-[#EAF4FB]/60 border border-[#BDE5FF]/60 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#53A6D8] text-white flex items-center justify-center shadow-md">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Панель Адміністратора</h1>
              <p className="text-xs text-[#353535]/70">Повноцінне керування контентом та заявками платформи PLEKAYOU</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link 
              href="/admin/pairs" 
              className="px-5 py-3 rounded-2xl bg-white border border-[#BDE5FF] text-[#53A6D8] font-bold text-xs hover:bg-[#BDE5FF]/20 transition-all shadow-sm"
            >
              Керування парами
            </Link>
            <button 
              onClick={handleLogout}
              className="px-5 py-3 rounded-2xl bg-red-50 border border-red-200 text-red-600 font-bold text-xs hover:bg-red-100 transition-all shadow-sm flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" /> Вийти
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="p-6 rounded-[2rem] bg-white border border-[#BDE5FF]/60 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#BDE5FF]/30 text-[#53A6D8] flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div className="text-3xl font-extrabold">{stats.volunteers}</div>
            <p className="text-xs font-bold text-[#353535]/60 uppercase tracking-wider">Волонтери</p>
          </div>

          <div className="p-6 rounded-[2rem] bg-white border border-[#BDE5FF]/60 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#BDE5FF]/30 text-[#53A6D8] flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="text-3xl font-extrabold">{stats.students}</div>
            <p className="text-xs font-bold text-[#353535]/60 uppercase tracking-wider">Учні</p>
          </div>

          <div className="p-6 rounded-[2rem] bg-white border border-[#BDE5FF]/60 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#BDE5FF]/30 text-[#53A6D8] flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="text-3xl font-extrabold">{stats.events}</div>
            <p className="text-xs font-bold text-[#353535]/60 uppercase tracking-wider">Події</p>
          </div>

          <div className="p-6 rounded-[2rem] bg-white border border-[#BDE5FF]/60 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#BDE5FF]/30 text-[#53A6D8] flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="text-3xl font-extrabold">{stats.opportunities}</div>
            <p className="text-xs font-bold text-[#353535]/60 uppercase tracking-wider">Можливості</p>
          </div>

          <div className="p-6 rounded-[2rem] bg-white border border-[#BDE5FF]/60 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#BDE5FF]/30 text-[#53A6D8] flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div className="text-3xl font-extrabold">{stats.articles}</div>
            <p className="text-xs font-bold text-[#353535]/60 uppercase tracking-wider">Статті</p>
          </div>
        </div>

        <div className="p-8 rounded-[3rem] bg-white border border-[#BDE5FF]/60 shadow-sm space-y-6">
          <h2 className="text-xl font-extrabold tracking-tight">Останні заявки волонтерів</h2>
          
          {volunteersList.length === 0 ? (
            <p className="text-xs text-[#353535]/60 py-6 text-center">Немає нових заявок.</p>
          ) : (
            <div className="space-y-4">
              {volunteersList.map((vol) => (
                <div key={vol.id} className="p-5 rounded-2xl bg-[#F8FBFF] border border-[#BDE5FF]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="font-bold text-sm text-[#353535]">{vol.full_name}</div>
                    <div className="text-xs text-[#353535]/70">{vol.email} • {vol.phone} • Предмети: {vol.subjects}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full bg-[#BDE5FF]/20 text-[#53A6D8] text-xs font-bold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {vol.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>

      <Footer />
    </div>
  )
}