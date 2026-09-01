'use client'

import { useState, useEffect } from 'react'
import { Montserrat } from 'next/font/google'
import { createClient } from '@/lib/supabase/client'
import { InteractiveBackground } from '@/components/InteractiveBackground'
import { ShieldCheck, Link2, UserPlus, ArrowLeft, Trash2, ExternalLink, Sparkles, Filter, Search } from 'lucide-react'
import Link from 'next/link'

const montserrat = Montserrat({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-montserrat',
})

export default function AdminPairsPage() {
  const supabase = createClient()
  const [students, setStudents] = useState<any[]>([])
  const [volunteers, setVolunteers] = useState<any[]>([])
  const [pairs, setPairs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Фільтри та пошук для тандемів
  const [searchQuery, setSearchQuery] = useState('')
  const [filterSubject, setFilterSubject] = useState('Усі')
  const [filterStream, setFilterStream] = useState('Усі')

  // Форма створення пари
  const [selectedVolunteerId, setSelectedVolunteerId] = useState('')
  const [selectedStudentId, setSelectedStudentId] = useState('')
  const [pairSubject, setPairSubject] = useState('Математика')
  const [pairStream, setPairStream] = useState('Літній потік 2026')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      const [{ data: studentApps }, { data: volunteerApps }, { data: pairsData }] = await Promise.all([
        supabase.from('student_applications').select('*').order('created_at', { ascending: false }),
        supabase.from('volunteer_applications').select('*').order('created_at', { ascending: false }),
        supabase.from('teaching_pairs').select('*, volunteer_applications(*), student_applications(*)').order('created_at', { ascending: false }),
      ])
      if (studentApps) setStudents(studentApps)
      if (volunteerApps) setVolunteers(volunteerApps)
      if (pairsData) setPairs(pairsData)
      setLoading(false)
    }
    loadData()
  }, [supabase])

  const handleCreatePair = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!selectedVolunteerId || !selectedStudentId) {
      setError('Будь ласка, оберіть і викладача, і учня.')
      return
    }

    const { error: insertError } = await supabase.from('teaching_pairs').insert([{
      volunteer_id: selectedVolunteerId,
      student_id: selectedStudentId,
      subject: pairSubject,
      stream: pairStream,
    }])

    if (insertError) {
      setError('Помилка при створенні пари. Можливо, такий тандем вже існує в базі.')
    } else {
      setSuccess('Навчальний тандем успішно створено!')
      setSelectedVolunteerId('')
      setSelectedStudentId('')
      const { data: pairsData } = await supabase.from('teaching_pairs').select('*, volunteer_applications(*), student_applications(*)').order('created_at', { ascending: false })
      if (pairsData) setPairs(pairsData)
    }
  }

  const handleDeletePair = async (pairId: string) => {
    if (!confirm('Ви впевнені, що хочете розірвати цей тандем?')) return

    const { error } = await supabase.from('teaching_pairs').delete().eq('id', pairId)
    if (!error) {
      setPairs(pairs.filter(p => p.id !== pairId))
    }
  }

  // Отримання списку унікальних потоків для фільтра
  const availableStreams = Array.from(new Set(pairs.map(p => p.stream).filter(Boolean)))

  // Фільтрація пар за пошуком та фільтрами
  const filteredPairs = pairs.filter(p => {
    const teacherName = (p.volunteer_applications?.full_name || '').toLowerCase()
    const studentName = (p.student_applications?.full_name || '').toLowerCase()
    const query = searchQuery.toLowerCase()

    const matchesSearch = teacherName.includes(query) || studentName.includes(query)
    const matchesSubject = filterSubject === 'Усі' || (p.subject || '').toLowerCase().includes(filterSubject.toLowerCase())
    const matchesStream = filterStream === 'Усі' || p.stream === filterStream

    return matchesSearch && matchesSubject && matchesStream
  })

  return (
    <div className={`${montserrat.variable} font-[family-name:var(--font-montserrat)] text-[#353535] bg-[#FFFFFF] relative overflow-hidden min-h-screen`}>
      <InteractiveBackground />

      <section className="relative pt-24 pb-12 px-6 max-w-7xl mx-auto z-10 space-y-4">
        <div className="flex items-center justify-between">
          <Link href="/admin" className="inline-flex items-center gap-2 text-xs font-bold text-[#53A6D8] hover:underline">
            <ArrowLeft className="w-4 h-4" /> Назад до головної панелі
          </Link>
          <span className="px-4 py-1.5 rounded-full bg-[#BDE5FF]/30 text-[#53A6D8] text-[10px] font-bold uppercase tracking-wider">
            Матчинг тандемів
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Управління навчальними парами</h1>
        <p className="text-base text-[#353535]/75 font-medium max-w-2xl leading-relaxed">
          Створюйте зв'язки між викладачами та учнями і зручно фільтруйте створені тандеми за допомогою панелі управління нижче.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-28 relative z-10 space-y-12">
        
        {/* ФОРМА СТВОРЕННЯ ПАРИ */}
        <div className="p-8 md:p-12 rounded-[3rem] bg-white border border-[#BDE5FF] shadow-[0_15px_40px_rgba(83,166,216,0.08)] space-y-8">
          <div className="flex items-center gap-3 border-b border-[#BDE5FF]/50 pb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#53A6D8] text-white flex items-center justify-center shrink-0 shadow-md">
              <UserPlus className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">Створення нового тандему</h3>
              <p className="text-xs text-[#353535]/70">Після створення пара з'явиться в особистому кабінеті викладача.</p>
            </div>
          </div>

          {error && <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-600 font-medium">{error}</div>}
          {success && <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-600 font-bold">{success}</div>}

          <form onSubmit={handleCreatePair} className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#353535]/75">Викладач-волонтер *</label>
              <select 
                value={selectedVolunteerId}
                onChange={(e) => setSelectedVolunteerId(e.target.value)}
                required
                className="w-full px-5 py-4 rounded-2xl bg-[#F8FBFF] border border-[#BDE5FF] text-xs font-medium focus:outline-none focus:border-[#53A6D8]"
              >
                <option value="">Оберіть викладача</option>
                {volunteers.map(v => (
                  <option key={v.id} value={v.id}>{v.full_name} ({v.subjects})</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#353535]/75">Учень *</label>
              <select 
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                required
                className="w-full px-5 py-4 rounded-2xl bg-[#F8FBFF] border border-[#BDE5FF] text-xs font-medium focus:outline-none focus:border-[#53A6D8]"
              >
                <option value="">Оберіть учня</option>
                {students.map(s => (
                  <option key={s.id} value={s.id}>{s.full_name} ({s.grade})</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#353535]/75">Предмет та потік *</label>
              <div className="grid grid-cols-2 gap-2">
                <input 
                  type="text" 
                  value={pairSubject}
                  onChange={(e) => setPairSubject(e.target.value)}
                  placeholder="Предмет"
                  required
                  className="w-full px-4 py-4 rounded-2xl bg-[#F8FBFF] border border-[#BDE5FF] text-xs font-medium focus:outline-none focus:border-[#53A6D8]"
                />
                <input 
                  type="text" 
                  value={pairStream}
                  onChange={(e) => setPairStream(e.target.value)}
                  placeholder="Потік"
                  required
                  className="w-full px-4 py-4 rounded-2xl bg-[#F8FBFF] border border-[#BDE5FF] text-xs font-medium focus:outline-none focus:border-[#53A6D8]"
                />
              </div>
            </div>

            <div className="flex items-end">
              <button 
                type="submit"
                className="w-full py-4 rounded-2xl text-xs font-bold text-white bg-[#53A6D8] hover:bg-[#3f8dbe] transition-all shadow-[0_10px_25px_rgba(83,166,216,0.3)] flex items-center justify-center gap-2"
              >
                <Link2 className="w-4 h-4" /> З'єднати пару
              </button>
            </div>
          </form>
        </div>

        {/* СПИСОК ПАР З ФІЛЬТРАМИ ТА ПОШУКОМ */}
        <div className="p-8 md:p-12 rounded-[3rem] bg-white border border-[#BDE5FF]/60 shadow-[0_15px_40px_rgba(83,166,216,0.08)] space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#BDE5FF]/50 pb-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Link2 className="w-5 h-5 text-[#53A6D8]" />
              Створені тандеми ({filteredPairs.length} із {pairs.length})
            </h3>

            {/* ПАНЕЛЬ ФІЛЬТРІВ ТА ПОШУКУ */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Пошук */}
              <div className="relative">
                <Search className="w-4 h-4 text-[#53A6D8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Пошук за прізвищем..."
                  className="pl-10 pr-4 py-2.5 rounded-xl bg-[#F8FBFF] border border-[#BDE5FF] text-xs font-bold text-[#353535] focus:outline-none w-56"
                />
              </div>

              {/* Фільтр за предметом */}
              <div className="flex items-center gap-1.5">
                <Filter className="w-4 h-4 text-[#53A6D8]" />
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

              {/* Фільтр за потоком */}
              <div>
                <select 
                  value={filterStream}
                  onChange={(e) => setFilterStream(e.target.value)}
                  className="px-4 py-2.5 rounded-xl bg-[#F8FBFF] border border-[#BDE5FF] text-xs font-bold text-[#353535] focus:outline-none"
                >
                  <option value="Усі">Усі потоки</option>
                  {availableStreams.map(stream => (
                    <option key={stream as string} value={stream as string}>{stream as string}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <p className="text-xs text-[#353535]/50 text-center py-8">Завантаження тандемів...</p>
          ) : filteredPairs.length === 0 ? (
            <div className="text-center py-12 space-y-3 bg-[#F8FBFF] rounded-3xl border border-[#BDE5FF]/40">
              <Sparkles className="w-10 h-10 text-[#53A6D8]/50 mx-auto" />
              <h4 className="font-bold text-sm">Таких пар не знайдено</h4>
              <p className="text-xs text-[#353535]/60 max-w-sm mx-auto">Змініть параметри пошуку або фільтрації.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPairs.map(p => (
                <div key={p.id} className="p-6 rounded-3xl bg-[#F8FBFF] border border-[#BDE5FF]/50 space-y-4 hover:border-[#53A6D8] transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#53A6D8] px-3 py-1 rounded-full bg-white border border-[#BDE5FF]">
                      {p.subject}
                    </span>
                    <button 
                      onClick={() => handleDeletePair(p.id)}
                      className="text-[#353535]/40 hover:text-red-500 transition-colors"
                      title="Розірвати пару"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="p-3 rounded-2xl bg-white border border-[#BDE5FF]/40 space-y-0.5">
                      <span className="text-[9px] uppercase font-bold text-[#353535]/50">Викладач</span>
                      <p className="font-bold">{p.volunteer_applications?.full_name || 'Не вказано'}</p>
                    </div>
                    <div className="p-3 rounded-2xl bg-white border border-[#BDE5FF]/40 space-y-0.5">
                      <span className="text-[9px] uppercase font-bold text-[#353535]/50">Учень</span>
                      <p className="font-bold">{p.student_applications?.full_name || 'Не вказано'} ({p.student_applications?.grade})</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#BDE5FF]/40 flex items-center justify-between text-[11px]">
                    <span className="text-[#353535]/60 font-medium">Потік: {p.stream}</span>
                    <a 
                      href={`/teacher/${p.volunteer_id}`} 
                      target="_blank"
                      rel="noreferrer"
                      className="font-bold text-[#53A6D8] hover:underline flex items-center gap-1"
                    >
                      Кабінет <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </section>
    </div>
  )
}