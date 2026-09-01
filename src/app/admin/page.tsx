'use client'

import { useState, useEffect } from 'react'
import { Montserrat } from 'next/font/google'
import { createClient } from '@/lib/supabase/client'
import { InteractiveBackground } from '@/components/InteractiveBackground'
import { Users, UserCheck, ShieldCheck, Layers, Phone, Mail, Eye, X, Link2, Filter, ArrowRight, PlusCircle, Calendar, Compass, FileText, Key, Copy, Check, Trash2, UserX } from 'lucide-react'
import Link from 'next/link'

const montserrat = Montserrat({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-montserrat',
})

export default function AdminDashboardPage() {
  const supabase = createClient()
  const [students, setStudents] = useState<any[]>([])
  const [volunteers, setVolunteers] = useState<any[]>([])
  const [events, setEvents] = useState<any[]>([])
  const [opportunities, setOpportunities] = useState<any[]>([])
  const [articles, setArticles] = useState<any[]>([])
  const [pairsCount, setPairsCount] = useState(0)

  const [selectedTeacher, setSelectedTeacher] = useState<any | null>(null)
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null)
  
  const [generatedPassword, setGeneratedPassword] = useState('')
  const [approvalMessage, setApprovalMessage] = useState('')
  const [actionError, setActionError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const [loading, setLoading] = useState(true)
  const [filterSubject, setFilterSubject] = useState('Усі')
  const [volunteerStatusFilter, setVolunteerStatusFilter] = useState<'all' | 'pending' | 'active_cabinet' | 'rejected'>('all')

  const [activeModal, setActiveModal] = useState<'event' | 'opportunity' | 'article' | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [formSuccess, setFormSuccess] = useState<string | null>(null)

  const [eventTitle, setEventTitle] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [eventTime, setEventTime] = useState('18:00')
  const [eventFormat, setEventFormat] = useState('Онлайн')
  const [eventLocation, setEventLocation] = useState('')
  const [eventRegLink, setEventRegLink] = useState('')
  const [eventDesc, setEventDesc] = useState('')

  const [oppTitle, setOppTitle] = useState('')
  const [oppDesc, setOppDesc] = useState('')
  const [oppLink, setOppLink] = useState('')

  const [artTitle, setArtTitle] = useState('')
  const [artDesc, setArtDesc] = useState('')

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: studentApps } = await supabase.from('student_applications').select('*').order('created_at', { ascending: false })
        if (studentApps) setStudents(studentApps)

        const { data: volunteerApps } = await supabase.from('volunteer_applications').select('*').order('created_at', { ascending: false })
        if (volunteerApps) setVolunteers(volunteerApps)

        const { data: eventsData } = await supabase.from('events').select('*').order('event_date', { ascending: true })
        if (eventsData) setEvents(eventsData)

        const { data: oppData } = await supabase.from('opportunities').select('*').order('created_at', { ascending: false })
        if (oppData) setOpportunities(oppData)

        const { data: artData } = await supabase.from('articles').select('*').order('created_at', { ascending: false })
        if (artData) setArticles(artData)

        const { count } = await supabase.from('teaching_pairs').select('*', { count: 'exact', head: true })
        if (count !== null) setPairsCount(count)
      } catch (err) {
        console.error('Error fetching admin data:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [supabase])

  const generateSecurePassword = () => {
    const chars = 'abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789#!@'
    let pass = ''
    for (let i = 0; i < 10; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return pass
  }

  const handleOpenTeacherModal = (vol: any) => {
    setSelectedTeacher(vol)
    setActionError(null)
    setCopied(false)

    const securePass = vol.temp_password || generateSecurePassword()
    setGeneratedPassword(securePass)

    setApprovalMessage(
      `Вітаємо у команді викладачів PLEKAYOU, ${vol.full_name}!\n\nТвою анкету з напрямку «${vol.subjects}» успішно схвалено. Для тебе створено особистий кабінет на платформі:\n\n🔗 Посилання: https://plekayou.org/teacher/login\n📧 Email: ${vol.email}\n🔑 Тимчасовий пароль: ${securePass}\n\nБудь ласка, увійди в систему, перевір профіль та очікуй на призначення перших учнів. Дякуємо, що плекаєш якісну освіту в Україні!`
    )
  }

  // Оновлена функція через серверний API
  const handleAcceptTeacher = async (teacher: any) => {
    setActionError(null)

    try {
      const response = await fetch('/api/admin/activate-teacher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: teacher.email,
          password: generatedPassword,
          teacherId: teacher.id
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Помилка активації')
      }

      setVolunteers(volunteers.map(v => v.id === teacher.id ? { ...v, status: 'active_cabinet', temp_password: generatedPassword } : v))
      setSelectedTeacher((prev: any) => prev ? { ...prev, status: 'active_cabinet', temp_password: generatedPassword } : null)
      alert('Викладача успішно прийнято! Обліковий запис створено в системі.')
    } catch (err: any) {
      setActionError(err.message)
    }
  }

  const handleRejectTeacher = async (teacherId: string) => {
    if (!confirm('Ви дійсно хочете відхилити цю заявку?')) return
    const { error } = await supabase
      .from('volunteer_applications')
      .update({ status: 'rejected' })
      .eq('id', teacherId)

    if (error) {
      alert('Помилка при відхиленні заявки.')
    } else {
      setVolunteers(volunteers.map(v => v.id === teacherId ? { ...v, status: 'rejected' } : v))
      setSelectedTeacher(null)
      alert('Заявку відхилено.')
    }
  }

  const handleDeleteTeacher = async (teacherId: string) => {
    if (!confirm('Ви дійсно хочете остаточно видалити цю заявку?')) return
    const { error } = await supabase
      .from('volunteer_applications')
      .delete()
      .eq('id', teacherId)

    if (error) {
      alert('Помилка при видаленні.')
    } else {
      setVolunteers(volunteers.filter(v => v.id !== teacherId))
      setSelectedTeacher(null)
      alert('Заявку видалено з бази.')
    }
  }

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    const { error } = await supabase.from('events').insert([{ 
      title: eventTitle, event_date: eventDate, event_time: eventTime,
      format: eventFormat, location_or_link: eventLocation,
      registration_link: eventRegLink, description: eventDesc 
    }])
    if (error) setFormError('Помилка при створенні події.')
    else {
      setFormSuccess('Подію успішно додано!')
      setActiveModal(null)
      window.location.reload()
    }
  }

  const handleAddOpportunity = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    const { error } = await supabase.from('opportunities').insert([{ title: oppTitle, description: oppDesc, link: oppLink }])
    if (error) setFormError('Помилка при створенні можливості.')
    else {
      setFormSuccess('Можливість успішно додано!')
      setActiveModal(null)
      window.location.reload()
    }
  }

  const handleAddArticle = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    const { error } = await supabase.from('articles').insert([{ title: artTitle, content: artDesc }])
    if (error) setFormError('Помилка при створенні статті.')
    else {
      setFormSuccess('Статтю успішно додано!')
      setActiveModal(null)
      window.location.reload()
    }
  }

  const filteredVolunteers = volunteers.filter(v => {
    const matchesSubject = filterSubject === 'Усі' || (v.subjects || '').toLowerCase().includes(filterSubject.toLowerCase())
    const matchesStatus = volunteerStatusFilter === 'all' || v.status === volunteerStatusFilter || (!v.status && volunteerStatusFilter === 'pending')
    return matchesSubject && matchesStatus
  })

  const getSubjectCategory = (subject: string) => {
    const s = (subject || '').toLowerCase()
    if (s.includes('матем') || s.includes('фізик') || s.includes('хімі') || s.includes('біолог') || s.includes('географ')) {
      return 'Точні та природничі науки'
    } else if (s.includes('мов') || s.includes('літератур')) {
      return 'Мови та література'
    } else if (s.includes('історі') || s.includes('право') || s.includes('суспільств')) {
      return 'Суспільні науки'
    }
    return 'IT та інші предмети'
  }

  const categories = {
    'Точні та природничі науки': filteredVolunteers.filter(v => getSubjectCategory(v.subjects) === 'Точні та природничі науки'),
    'Мови та література': filteredVolunteers.filter(v => getSubjectCategory(v.subjects) === 'Мови та література'),
    'Суспільні науки': filteredVolunteers.filter(v => getSubjectCategory(v.subjects) === 'Суспільні науки'),
    'IT та інші предмети': filteredVolunteers.filter(v => getSubjectCategory(v.subjects) === 'IT та інші предмети'),
  }

  return (
    <div className={`${montserrat.variable} font-[family-name:var(--font-montserrat)] text-[#353535] bg-[#FFFFFF] relative overflow-hidden min-h-screen`}>
      <InteractiveBackground />

      <section className="relative pt-24 pb-12 px-6 max-w-7xl mx-auto z-10 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#BDE5FF]/30 text-[#53A6D8] text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Система управління PLEKAYOU</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Панель координатора</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <Link 
              href="/admin/pairs"
              className="px-6 py-4 rounded-2xl bg-[#53A6D8] text-white text-xs font-bold hover:bg-[#3f8dbe] transition-all shadow-[0_10px_25px_rgba(83,166,216,0.3)] flex items-center justify-center gap-2"
            >
              <Link2 className="w-4 h-4" /> Управління тандемами &rarr;
            </Link>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 pt-2">
          <button onClick={() => setActiveModal('event')} className="px-5 py-3 rounded-xl bg-white border border-[#BDE5FF] text-[#53A6D8] text-xs font-bold hover:bg-[#53A6D8] hover:text-white transition-all shadow-sm flex items-center gap-2">
            <PlusCircle className="w-4 h-4" /> Додати подію
          </button>
          <button onClick={() => setActiveModal('opportunity')} className="px-5 py-3 rounded-xl bg-white border border-[#BDE5FF] text-[#53A6D8] text-xs font-bold hover:bg-[#53A6D8] hover:text-white transition-all shadow-sm flex items-center gap-2">
            <PlusCircle className="w-4 h-4" /> Додати можливість
          </button>
          <button onClick={() => setActiveModal('article')} className="px-5 py-3 rounded-xl bg-white border border-[#BDE5FF] text-[#53A6D8] text-xs font-bold hover:bg-[#53A6D8] hover:text-white transition-all shadow-sm flex items-center gap-2">
            <PlusCircle className="w-4 h-4" /> Додати статтю
          </button>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-28 relative z-10 space-y-16">
        
        {/* СТАТИСТИКА */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-8 rounded-[2.5rem] bg-white border border-[#BDE5FF]/60 shadow-[0_8px_25px_rgba(83,166,216,0.06)] space-y-2">
            <span className="text-xs uppercase font-bold text-[#353535]/50">Всього викладачів</span>
            <div className="text-3xl font-bold text-[#53A6D8]">{volunteers.length}</div>
          </div>
          <div className="p-8 rounded-[2.5rem] bg-white border border-[#BDE5FF]/60 shadow-[0_8px_25px_rgba(83,166,216,0.06)] space-y-2">
            <span className="text-xs uppercase font-bold text-[#353535]/50">Заявки учнів</span>
            <div className="text-3xl font-bold text-[#53A6D8]">{students.length}</div>
          </div>
          <div className="p-8 rounded-[2.5rem] bg-white border border-[#BDE5FF]/60 shadow-[0_8px_25px_rgba(83,166,216,0.06)] space-y-2">
            <span className="text-xs uppercase font-bold text-[#353535]/50">Активні тандеми</span>
            <div className="text-3xl font-bold text-emerald-600">{pairsCount}</div>
          </div>
          <div className="p-8 rounded-[2.5rem] bg-white border border-[#BDE5FF]/60 shadow-[0_8px_25px_rgba(83,166,216,0.06)] space-y-2">
            <span className="text-xs uppercase font-bold text-[#353535]/50">Контент</span>
            <div className="text-3xl font-bold text-[#353535]">{events.length + opportunities.length + articles.length}</div>
          </div>
        </div>

        {/* ЗАЯВКИ ВІД УЧНІВ */}
        <div className="p-8 md:p-12 rounded-[3rem] bg-white border border-[#BDE5FF]/60 shadow-[0_15px_40px_rgba(83,166,216,0.08)] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-2xl font-bold flex items-center gap-2">
              <UserCheck className="w-6 h-6 text-[#53A6D8]" />
              Заявки від учнів ({students.length})
            </h3>
            <Link 
              href="/admin/pairs"
              className="px-5 py-2.5 rounded-xl bg-[#BDE5FF]/30 text-[#53A6D8] text-xs font-bold hover:bg-[#53A6D8] hover:text-white transition-all flex items-center gap-1.5"
            >
              Перейти до створення пар <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#BDE5FF]/50 text-[#353535]/50 uppercase tracking-wider">
                  <th className="py-4 px-4 font-bold">Дата</th>
                  <th className="py-4 px-4 font-bold">ПІБ учня</th>
                  <th className="py-4 px-4 font-bold">Контакти</th>
                  <th className="py-4 px-4 font-bold">Клас</th>
                  <th className="py-4 px-4 font-bold">Предмети</th>
                  <th className="py-4 px-4 font-bold text-right">Дія</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#BDE5FF]/30 font-medium">
                {loading ? (
                  <tr><td colSpan={6} className="py-8 text-center text-[#353535]/50">Завантаження заявок...</td></tr>
                ) : students.length === 0 ? (
                  <tr><td colSpan={6} className="py-8 text-center text-[#353535]/50">Немає нових заявок від учнів.</td></tr>
                ) : (
                  students.map((app) => (
                    <tr key={app.id} className="hover:bg-[#F8FBFF] transition-colors">
                      <td className="py-4 px-4 text-[#353535]/60">{new Date(app.created_at).toLocaleDateString('uk-UA')}</td>
                      <td className="py-4 px-4 font-bold text-[#353535]">{app.full_name}</td>
                      <td className="py-4 px-4 text-[#353535]/80">{app.email} <br /> {app.phone}</td>
                      <td className="py-4 px-4">{app.grade}</td>
                      <td className="py-4 px-4 font-semibold text-[#53A6D8]">
                        {Array.isArray(app.subjects) ? app.subjects.join(', ') : app.subjects}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button 
                          onClick={() => setSelectedStudent(app)}
                          className="px-3 py-1.5 rounded-xl bg-white border border-[#BDE5FF] text-[#53A6D8] hover:bg-[#53A6D8] hover:text-white transition-all text-xs font-bold inline-flex items-center gap-1 shadow-sm"
                        >
                          <Eye className="w-3.5 h-3.5" /> Відкрити
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* БАЗА ВИКЛАДАЧІВ З ФІЛЬТРАЦІЄЮ ТА СТАТУСАМИ */}
        <div className="space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#BDE5FF]/50 pb-6">
            <h3 className="text-2xl font-bold flex items-center gap-2">
              <Users className="w-6 h-6 text-[#53A6D8]" />
              Модерація викладачів та доступи
            </h3>
            
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center bg-[#F8FBFF] border border-[#BDE5FF] rounded-xl p-1 text-xs font-bold">
                <button 
                  onClick={() => setVolunteerStatusFilter('all')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${volunteerStatusFilter === 'all' ? 'bg-[#53A6D8] text-white' : 'text-[#353535]/70'}`}
                >
                  Усі
                </button>
                <button 
                  onClick={() => setVolunteerStatusFilter('pending')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${volunteerStatusFilter === 'pending' ? 'bg-[#53A6D8] text-white' : 'text-[#353535]/70'}`}
                >
                  Нові
                </button>
                <button 
                  onClick={() => setVolunteerStatusFilter('active_cabinet')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${volunteerStatusFilter === 'active_cabinet' ? 'bg-emerald-600 text-white' : 'text-[#353535]/70'}`}
                >
                  Прийняті
                </button>
                <button 
                  onClick={() => setVolunteerStatusFilter('rejected')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${volunteerStatusFilter === 'rejected' ? 'bg-red-500 text-white' : 'text-[#353535]/70'}`}
                >
                  Відхилені
                </button>
              </div>

              <select 
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
                className="px-4 py-2.5 rounded-xl bg-[#F8FBFF] border border-[#BDE5FF] text-xs font-bold text-[#353535] focus:outline-none"
              >
                <option value="Усі">Усі предмети</option>
                <option value="Математика">Математика</option>
                <option value="Українська мова">Українська мова</option>
                <option value="Англійська мова">Англійська мова</option>
                <option value="Історія України">Історія України</option>
                <option value="Фізика">Фізика</option>
                <option value="Хімія">Хімія</option>
                <option value="Біологія">Біологія</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {Object.entries(categories).map(([categoryName, teachers]) => (
              <div key={categoryName} className="p-8 md:p-10 rounded-[3rem] bg-white border border-[#BDE5FF]/60 shadow-[0_15px_40px_rgba(83,166,216,0.08)] space-y-6">
                <div className="flex items-center justify-between border-b border-[#BDE5FF]/40 pb-4">
                  <h4 className="font-bold text-base text-[#53A6D8] flex items-center gap-2">
                    <Layers className="w-4 h-4" /> {categoryName}
                  </h4>
                  <span className="px-3 py-1 rounded-full bg-[#BDE5FF]/30 text-xs font-bold text-[#53A6D8]">
                    {teachers.length} викладачів
                  </span>
                </div>

                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                  {loading ? (
                    <p className="text-xs text-[#353535]/50 text-center py-6">Завантаження...</p>
                  ) : teachers.length === 0 ? (
                    <p className="text-xs text-[#353535]/50 text-center py-6">Немає викладачів у цьому фільтрі.</p>
                  ) : (
                    teachers.map((vol) => (
                      <div key={vol.id} className="p-5 rounded-2xl bg-[#F8FBFF] border border-[#BDE5FF]/50 space-y-3 hover:border-[#53A6D8] transition-all">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h5 className="font-bold text-sm text-[#353535]">{vol.full_name}</h5>
                              {vol.status === 'active_cabinet' && (
                                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">Прийнято</span>
                              )}
                              {vol.status === 'rejected' && (
                                <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold">Відхилено</span>
                              )}
                              {(!vol.status || vol.status === 'pending') && (
                                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold">Нова заявка</span>
                              )}
                            </div>
                            <span className="text-[11px] font-semibold text-[#53A6D8]">{vol.subjects}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => handleOpenTeacherModal(vol)}
                              className="px-3 py-1.5 rounded-xl bg-white border border-[#BDE5FF] text-[#53A6D8] hover:bg-[#53A6D8] hover:text-white transition-all text-xs font-bold flex items-center gap-1 shadow-sm"
                            >
                              <Eye className="w-3.5 h-3.5" /> Модерація
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-[#353535]/80 pt-1">
                          <div className="flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-[#53A6D8]" />
                            <span className="truncate">{vol.email}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-[#53A6D8]" />
                            <span>{vol.phone}</span>
                          </div>
                        </div>

                        {vol.temp_password && (
                          <div className="pt-2 border-t border-[#BDE5FF]/40 flex items-center justify-between text-[11px]">
                            <span className="text-[#353535]/70 font-medium">Пароль: <code className="bg-white px-2 py-0.5 rounded border border-[#BDE5FF] font-bold text-[#53A6D8]">{vol.temp_password}</code></span>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* МОДАЛЬНЕ ВІКНО ДОСЬЄ УЧНЯ */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-[2.5rem] border border-[#BDE5FF] p-8 md:p-10 max-w-xl w-full shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto">
            <button onClick={() => setSelectedStudent(null)} className="absolute top-6 right-6 w-10 h-10 rounded-full bg-[#F8FBFF] border border-[#BDE5FF] text-[#353535] flex items-center justify-center hover:bg-[#53A6D8] hover:text-white transition-all">
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2 border-b border-[#BDE5FF]/50 pb-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#53A6D8]">Повна анкета учня</span>
              <h3 className="text-2xl font-bold">{selectedStudent.full_name}</h3>
              <p className="text-xs font-semibold text-[#53A6D8]">Клас: {selectedStudent.grade}</p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-[#F8FBFF] border border-[#BDE5FF]/40 space-y-2">
                <h4 className="font-bold uppercase tracking-wider text-[#53A6D8] text-[10px]">Контактна інформація</h4>
                <div className="space-y-1 text-[#353535]/80">
                  <p><b>Email:</b> {selectedStudent.email}</p>
                  <p><b>Телефон:</b> {selectedStudent.phone}</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#F8FBFF] border border-[#BDE5FF]/40 space-y-2">
                <h4 className="font-bold uppercase tracking-wider text-[#53A6D8] text-[10px]">Обрані предмети</h4>
                <p className="font-bold text-[#353535]">
                  {Array.isArray(selectedStudent.subjects) ? selectedStudent.subjects.join(', ') : selectedStudent.subjects}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#F8FBFF] border border-[#BDE5FF]/40 space-y-2">
                <h4 className="font-bold uppercase tracking-wider text-[#53A6D8] text-[10px]">Мета навчання та деталі</h4>
                <p className="text-[#353535]/80 leading-relaxed">{selectedStudent.goals || 'Не вказано'}</p>
              </div>
            </div>

            <button onClick={() => setSelectedStudent(null)} className="w-full py-4 rounded-2xl text-xs font-bold text-white bg-[#53A6D8] hover:bg-[#3f8dbe] transition-all shadow-md">
              Закрити анкету
            </button>
          </div>
        </div>
      )}

      {/* МОДАЛЬНЕ ВІКНО МОДЕРАЦІЇ ВИКЛАДАЧА */}
      {selectedTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-[2.5rem] border border-[#BDE5FF] p-8 md:p-10 max-w-xl w-full shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto">
            <button onClick={() => setSelectedTeacher(null)} className="absolute top-6 right-6 w-10 h-10 rounded-full bg-[#F8FBFF] border border-[#BDE5FF] text-[#353535] flex items-center justify-center hover:bg-[#53A6D8] hover:text-white transition-all">
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2 border-b border-[#BDE5FF]/50 pb-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#53A6D8]">Модерація анкети викладача</span>
              <h3 className="text-2xl font-bold">{selectedTeacher.full_name}</h3>
              <p className="text-xs font-semibold text-[#53A6D8]">Предмети: {selectedTeacher.subjects}</p>
            </div>

            {actionError && <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600">{actionError}</div>}

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[#F8FBFF] border border-[#BDE5FF]/40 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#353535]/50">Вік</span>
                  <p className="font-bold text-sm text-[#353535]">{selectedTeacher.age} років</p>
                </div>
                <div className="p-4 rounded-2xl bg-[#F8FBFF] border border-[#BDE5FF]/40 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#353535]/50">Ліміт учнів</span>
                  <p className="font-bold text-sm text-[#353535]">{selectedTeacher.max_students}</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#F8FBFF] border border-[#BDE5FF]/40 space-y-2">
                <h4 className="font-bold uppercase tracking-wider text-[#53A6D8] text-[10px]">Контакти</h4>
                <p><b>Email:</b> {selectedTeacher.email}</p>
                <p><b>Телефон (WhatsApp):</b> {selectedTeacher.phone}</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#F8FBFF] border border-[#BDE5FF]/40 space-y-2">
                <h4 className="font-bold uppercase tracking-wider text-[#53A6D8] text-[10px]">Досягнення та мотивація</h4>
                <p className="text-[#353535]/80 leading-relaxed">{selectedTeacher.achievements || 'Не вказано'}</p>
              </div>

              <div className="p-6 rounded-3xl bg-[#BDE5FF]/10 border border-[#BDE5FF] space-y-5">
                <h4 className="font-bold uppercase tracking-wider text-[#53A6D8] text-xs">Рішення та активація кабінету</h4>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-[#353535]">Готовий текст для розсилки (прийнятому викладачу):</span>
                    <textarea rows={6} value={approvalMessage} onChange={e => setApprovalMessage(e.target.value)} className="w-full p-4 rounded-xl bg-white border border-[#BDE5FF] text-xs font-medium focus:outline-none resize-none font-mono" />
                    
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleCopyText(approvalMessage)} className="px-4 py-3 rounded-xl bg-white border border-[#BDE5FF] text-xs font-bold text-[#53A6D8] flex items-center gap-1.5 shadow-sm shrink-0">
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />} Скопіювати текст
                      </button>
                      <button onClick={() => handleAcceptTeacher(selectedTeacher)} className="w-full py-3 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-all shadow-md flex items-center justify-center gap-2">
                        <Key className="w-4 h-4" /> Прийняти та активувати кабінет
                      </button>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#BDE5FF]/50 flex items-center justify-between gap-3">
                    <button onClick={() => handleRejectTeacher(selectedTeacher.id)} className="px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold hover:bg-amber-100 transition-all flex items-center gap-1.5">
                      <UserX className="w-4 h-4" /> Відхилити заявку (Reject)
                    </button>
                    <button onClick={() => handleDeleteTeacher(selectedTeacher.id)} className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-bold hover:bg-red-100 transition-all flex items-center gap-1.5">
                      <Trash2 className="w-4 h-4" /> Видалити остаточно
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <button onClick={() => setSelectedTeacher(null)} className="w-full py-4 rounded-2xl text-xs font-bold text-white bg-[#353535] hover:bg-black transition-all shadow-md">
              Закрити
            </button>
          </div>
        </div>
      )}

      {/* МОДАЛЬНІ ВІКНА КОНТЕНТУ */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-[2.5rem] border border-[#BDE5FF] p-8 md:p-10 max-w-lg w-full shadow-2xl relative space-y-6">
            <button onClick={() => setActiveModal(null)} className="absolute top-6 right-6 w-10 h-10 rounded-full bg-[#F8FBFF] border border-[#BDE5FF] text-[#353535] flex items-center justify-center hover:bg-[#53A6D8] hover:text-white transition-all">
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-2xl font-bold">
              {activeModal === 'event' && 'Додати нову подію'}
              {activeModal === 'opportunity' && 'Додати нову можливість'}
              {activeModal === 'article' && 'Додати нову статтю'}
            </h3>

            {formError && <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600">{formError}</div>}

            {activeModal === 'event' && (
              <form onSubmit={handleAddEvent} className="space-y-4">
                <input type="text" placeholder="Назва події" required value={eventTitle} onChange={e => setEventTitle(e.target.value)} className="w-full px-5 py-3.5 rounded-2xl bg-[#F8FBFF] border border-[#BDE5FF] text-xs font-medium" />
                <div className="grid grid-cols-2 gap-3">
                  <input type="date" required value={eventDate} onChange={e => setEventDate(e.target.value)} className="w-full px-5 py-3.5 rounded-2xl bg-[#F8FBFF] border border-[#BDE5FF] text-xs font-medium" />
                  <input type="time" required value={eventTime} onChange={e => setEventTime(e.target.value)} className="w-full px-5 py-3.5 rounded-2xl bg-[#F8FBFF] border border-[#BDE5FF] text-xs font-medium" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <select value={eventFormat} onChange={e => setEventFormat(e.target.value)} className="w-full px-5 py-3.5 rounded-2xl bg-[#F8FBFF] border border-[#BDE5FF] text-xs font-medium">
                    <option value="Онлайн">Онлайн</option><option value="Офлайн">Офлайн</option><option value="Гібрид">Гібрид</option>
                  </select>
                  <input type="text" placeholder="Локація / Zoom" value={eventLocation} onChange={e => setEventLocation(e.target.value)} className="w-full px-5 py-3.5 rounded-2xl bg-[#F8FBFF] border border-[#BDE5FF] text-xs font-medium" />
                </div>
                <input type="url" required placeholder="Посилання на Google Форму" value={eventRegLink} onChange={e => setEventRegLink(e.target.value)} className="w-full px-5 py-3.5 rounded-2xl bg-[#F8FBFF] border border-[#BDE5FF] text-xs font-medium" />
                <textarea placeholder="Опис події" rows={3} required value={eventDesc} onChange={e => setEventDesc(e.target.value)} className="w-full px-5 py-3.5 rounded-2xl bg-[#F8FBFF] border border-[#BDE5FF] text-xs font-medium resize-none" />
                <button type="submit" className="w-full py-4 rounded-2xl bg-[#53A6D8] text-white text-xs font-bold shadow-md">Зберегти подію</button>
              </form>
            )}

            {activeModal === 'opportunity' && (
              <form onSubmit={handleAddOpportunity} className="space-y-4">
                <input type="text" placeholder="Назва можливості" required value={oppTitle} onChange={e => setOppTitle(e.target.value)} className="w-full px-5 py-3.5 rounded-2xl bg-[#F8FBFF] border border-[#BDE5FF] text-xs font-medium" />
                <input type="url" placeholder="Посилання" value={oppLink} onChange={e => setOppLink(e.target.value)} className="w-full px-5 py-3.5 rounded-2xl bg-[#F8FBFF] border border-[#BDE5FF] text-xs font-medium" />
                <textarea placeholder="Опис" rows={3} required value={oppDesc} onChange={e => setOppDesc(e.target.value)} className="w-full px-5 py-3.5 rounded-2xl bg-[#F8FBFF] border border-[#BDE5FF] text-xs font-medium resize-none" />
                <button type="submit" className="w-full py-4 rounded-2xl bg-[#53A6D8] text-white text-xs font-bold shadow-md">Зберегти можливість</button>
              </form>
            )}

            {activeModal === 'article' && (
              <form onSubmit={handleAddArticle} className="space-y-4">
                <input type="text" placeholder="Заголовок статті" required value={artTitle} onChange={e => setArtTitle(e.target.value)} className="w-full px-5 py-3.5 rounded-2xl bg-[#F8FBFF] border border-[#BDE5FF] text-xs font-medium" />
                <textarea placeholder="Текст статті..." rows={5} required value={artDesc} onChange={e => setArtDesc(e.target.value)} className="w-full px-5 py-3.5 rounded-2xl bg-[#F8FBFF] border border-[#BDE5FF] text-xs font-medium resize-none" />
                <button type="submit" className="w-full py-4 rounded-2xl bg-[#53A6D8] text-white text-xs font-bold shadow-md">Зберегти статтю</button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}