'use client'

import { useState, useEffect } from 'react'
import { Montserrat } from 'next/font/google'
import { createClient } from '@/lib/supabase/client'
import { InteractiveBackground } from '@/components/InteractiveBackground'
import { GraduationCap, User, BookOpen, Mail, Phone, LogOut, CheckCircle2, Calendar, Users, Link2, FileText, PlusCircle, X, Award, MessageSquare } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const montserrat = Montserrat({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-montserrat',
})

export default function TeacherDashboardPage() {
  const supabase = createClient()
  const router = useRouter()
  const [teacher, setTeacher] = useState<any>(null)
  const [students, setStudents] = useState<any[]>([])
  const [lessons, setLessons] = useState<any[]>([])
  const [feedbacks, setFeedbacks] = useState<any[]>([])
  const [materials, setMaterials] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'schedule' | 'students' | 'feedback' | 'materials' | 'profile'>('schedule')

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [studentName, setStudentName] = useState('')
  const [lessonDate, setLessonDate] = useState('')
  const [lessonTime, setLessonTime] = useState('17:00')
  const [meetingLink, setMeetingLink] = useState('')
  const [notes, setNotes] = useState('')

  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false)
  const [selectedStudentForFeedback, setSelectedStudentForFeedback] = useState('')
  const [lessonTopic, setLessonTopic] = useState('')
  const [understandingLevel, setUnderstandingLevel] = useState('Відмінно')
  const [homeworkStatus, setHomeworkStatus] = useState('Виконано повністю')
  const [feedbackText, setFeedbackText] = useState('')

  useEffect(() => {
    async function loadTeacherData() {
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
          .order('lesson_date', { ascending: true })

        if (lessonsData) setLessons(lessonsData)

        const { data: feedbackData } = await supabase
          .from('lesson_feedback')
          .select('*')
          .eq('teacher_email', teacherEmail)
          .order('created_at', { ascending: false })

        if (feedbackData) setFeedbacks(feedbackData)

        const { data: studentApps } = await supabase
          .from('student_applications')
          .select('*')

        if (studentApps && studentApps.length > 0) {
          setStudents(studentApps)
        } else {
          setStudents([
            { full_name: 'Олександра Коваленко', grade: '10 клас', email: 'oleksandra@gmail.com', goals: 'Підготовка до олімпіади з фізики' },
            { full_name: 'Максим Мельник', grade: '11 клас', email: 'maksym@gmail.com', goals: 'Підготовка до НМТ з математики' }
          ])
        }

        setMaterials([
          { id: 1, title: 'Методичні рекомендації Peer-to-Peer', type: 'PDF документ', link: '#' },
          { id: 2, title: 'Збірка завдань та тестів (2026)', type: 'Google Drive', link: '#' }
        ])
      } catch (err) {
        console.error('Error loading dashboard:', err)
      } finally {
        setLoading(false)
      }
    }
    loadTeacherData()
  }, [supabase, router])

  const handleAddLesson = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!teacher) return

    const { error } = await supabase.from('teacher_lessons').insert([{
      teacher_email: teacher.email,
      student_name: studentName,
      subject: teacher.subjects,
      lesson_date: lessonDate,
      lesson_time: lessonTime,
      meeting_link: meetingLink,
      notes: notes,
      status: 'planned',
      hours_earned: 2
    }])

    if (error) {
      alert('Помилка при створенні заняття.')
    } else {
      alert('Заняття успішно додано до розкладу!')
      setIsAddModalOpen(false)
      window.location.reload()
    }
  }

  const handleAddFeedback = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!teacher) return

    const { error } = await supabase.from('lesson_feedback').insert([{
      teacher_email: teacher.email,
      student_name: selectedStudentForFeedback,
      subject: teacher.subjects,
      topic: lessonTopic,
      understanding_level: understandingLevel,
      homework_status: homeworkStatus,
      feedback_text: feedbackText
    }])

    if (error) {
      alert('Помилка при збереженні фідбеку.')
    } else {
      alert('Фідбек успішно збережено!')
      setIsFeedbackModalOpen(false)
      setLessonTopic('')
      setFeedbackText('')
      window.location.reload()
    }
  }

  const handleCompleteLesson = async (lessonId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'completed' ? 'planned' : 'completed'
    const { error } = await supabase
      .from('teacher_lessons')
      .update({ status: newStatus })
      .eq('id', lessonId)

    if (!error) {
      setLessons(lessons.map(l => l.id === lessonId ? { ...l, status: newStatus } : l))
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    localStorage.removeItem('plekayou_teacher_email')
    router.push('/teacher/login')
    router.refresh()
  }

  const totalVolunteerHours = lessons
    .filter(l => l.status === 'completed')
    .reduce((acc, curr) => acc + (curr.hours_earned || 2), 0)

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center font-bold text-sky-600">Завантаження кабінету...</div>
  }

  return (
    <div className={`${montserrat.variable} font-[family-name:var(--font-montserrat)] text-[#353535] bg-[#FFFFFF] relative overflow-hidden min-h-screen`}>
      <InteractiveBackground />

      <section className="relative pt-24 pb-20 px-6 max-w-6xl mx-auto z-10 space-y-10">
        
        {/* ШАПКА КАБІНЕТУ */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 md:p-12 rounded-[3rem] bg-white border border-[#BDE5FF] shadow-[0_20px_50px_rgba(83,166,216,0.1)]">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-[#BDE5FF]/30 text-[#53A6D8] rounded-2xl flex items-center justify-center shadow-sm shrink-0">
              <GraduationCap className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                  <CheckCircle2 className="w-3 h-3" /> Активовано
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-sky-100 text-sky-700 text-[10px] font-bold">
                  <Award className="w-3 h-3" /> {totalVolunteerHours} волонтерських годин
                </span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight">{teacher?.full_name}</h1>
              <p className="text-xs font-semibold text-[#53A6D8]">Напрямок: {teacher?.subjects}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link 
              href="/teacher/certificate"
              className="px-5 py-3.5 rounded-2xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-all shadow-md flex items-center gap-2"
            >
              <Award className="w-4 h-4" /> Мій сертифікат
            </Link>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="px-5 py-3.5 rounded-2xl bg-[#53A6D8] text-white text-xs font-bold hover:bg-[#3f8dbe] transition-all shadow-md flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" /> Додати заняття
            </button>
            <button 
              onClick={handleLogout}
              className="px-4 py-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-xs font-bold hover:bg-red-100 transition-all flex items-center gap-1.5 shadow-sm"
            >
              <LogOut className="w-4 h-4" /> Вихід
            </button>
          </div>
        </div>

        {/* НАВІГАЦІЯ */}
        <div className="flex flex-wrap items-center gap-3 border-b border-[#BDE5FF]/50 pb-4">
          <button onClick={() => setActiveTab('schedule')} className={`px-5 py-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'schedule' ? 'bg-[#53A6D8] text-white shadow-md' : 'bg-white border border-[#BDE5FF] text-[#53A6D8]'}`}>
            <Calendar className="w-4 h-4" /> Розклад
          </button>
          <button onClick={() => setActiveTab('students')} className={`px-5 py-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'students' ? 'bg-[#53A6D8] text-white shadow-md' : 'bg-white border border-[#BDE5FF] text-[#53A6D8]'}`}>
            <Users className="w-4 h-4" /> Мої учні ({students.length})
          </button>
          <button onClick={() => setActiveTab('feedback')} className={`px-5 py-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'feedback' ? 'bg-[#53A6D8] text-white shadow-md' : 'bg-white border border-[#BDE5FF] text-[#53A6D8]'}`}>
            <MessageSquare className="w-4 h-4" /> Фідбеки ({feedbacks.length})
          </button>
          <button onClick={() => setActiveTab('materials')} className={`px-5 py-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'materials' ? 'bg-[#53A6D8] text-white shadow-md' : 'bg-white border border-[#BDE5FF] text-[#53A6D8]'}`}>
            <FileText className="w-4 h-4" /> Матеріали
          </button>
          <button onClick={() => setActiveTab('profile')} className={`px-5 py-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'profile' ? 'bg-[#53A6D8] text-white shadow-md' : 'bg-white border border-[#BDE5FF] text-[#53A6D8]'}`}>
            <User className="w-4 h-4" /> Профіль
          </button>
        </div>

        {/* РОЗКЛАД */}
        {activeTab === 'schedule' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold">Розклад занять</h3>
            {lessons.length === 0 ? (
              <div className="p-12 text-center rounded-[2.5rem] bg-white border border-[#BDE5FF]/60 text-xs text-[#353535]/60">
                У вас ще немає запланованих занять.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {lessons.map(item => (
                  <div key={item.id} className="p-8 rounded-[2.5rem] bg-white border border-[#BDE5FF]/60 shadow-[0_10px_30px_rgba(83,166,216,0.06)] space-y-4">
                    <div className="flex items-center justify-between">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${item.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-[#BDE5FF]/30 text-[#53A6D8]'}`}>
                        {item.status === 'completed' ? 'Проведено (+2 год)' : 'Заплановано'}
                      </span>
                      <span className="text-xs font-bold text-[#353535]/60">{item.lesson_date} о {item.lesson_time}</span>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-base font-bold">{item.subject}</h4>
                      <p className="text-xs text-[#353535]/80 font-medium">Учень: <b>{item.student_name}</b></p>
                    </div>

                    {item.notes && (
                      <div className="p-4 rounded-2xl bg-[#F8FBFF] border border-[#BDE5FF]/40 text-xs text-[#353535]/80 space-y-1">
                        <span className="font-bold text-[#53A6D8] text-[10px] uppercase">Нотатки:</span>
                        <p>{item.notes}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2">
                      {item.meeting_link && (
                        <a href={item.meeting_link} target="_blank" rel="noreferrer" className="px-4 py-2 rounded-xl bg-[#53A6D8] text-white text-xs font-bold hover:bg-[#3f8dbe] transition-all flex items-center gap-1.5 shadow-sm">
                          <Link2 className="w-3.5 h-3.5" /> Посилання
                        </a>
                      )}
                      
                      <button 
                        onClick={() => handleCompleteLesson(item.id, item.status)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${item.status === 'completed' ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-emerald-50 border-emerald-200 text-emerald-700'}`}
                      >
                        {item.status === 'completed' ? 'Скасувати статус' : '✓ Відзначити проведене'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* УЧНІ ТА ДОСЬЄ */}
        {activeTab === 'students' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Users className="w-5 h-5 text-[#53A6D8]" /> Досьє учнів та зворотний зв'язок
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {students.map((st, idx) => (
                <div key={idx} className="p-8 rounded-[2.5rem] bg-white border border-[#BDE5FF]/60 shadow-[0_15px_40px_rgba(83,166,216,0.08)] space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-lg text-[#353535]">{st.full_name || st.student_name}</h4>
                      <span className="text-xs font-semibold text-[#53A6D8]">{st.grade || 'Клас не вказано'}</span>
                    </div>
                    <button 
                      onClick={() => {
                        setSelectedStudentForFeedback(st.full_name || st.student_name)
                        setIsFeedbackModalOpen(true)
                      }}
                      className="px-4 py-2 rounded-xl bg-[#53A6D8] text-white text-xs font-bold hover:bg-[#3f8dbe] transition-all shadow-sm flex items-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5" /> Залишити фідбек
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#F8FBFF] border border-[#BDE5FF]/40 space-y-2 text-xs text-[#353535]/80">
                    <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-[#53A6D8]" /> <b>Email:</b> {st.email || 'Не вказано'}</p>
                    <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-[#53A6D8]" /> <b>Телефон:</b> {st.phone || 'Не вказано'}</p>
                    <p><b>Мета / Побажання:</b> {st.goals || st.notes || 'Цілі не вказані'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ФІДБЕКИ */}
        {activeTab === 'feedback' && (
          <div className="p-8 md:p-10 rounded-[3rem] bg-white border border-[#BDE5FF]/60 shadow-[0_15px_40px_rgba(83,166,216,0.08)] space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#53A6D8]" /> Історія фідбеків по заняттях
            </h3>

            {feedbacks.length === 0 ? (
              <p className="text-xs text-[#353535]/60">Ви ще не залишали фідбеків. Натисніть «Мої учні» - «Залишити фідбек».</p>
            ) : (
              <div className="space-y-4">
                {feedbacks.map(fb => (
                  <div key={fb.id} className="p-6 rounded-2xl bg-[#F8FBFF] border border-[#BDE5FF]/50 space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-[#53A6D8]">{fb.student_name}</span>
                      <span className="text-[#353535]/50">{new Date(fb.created_at).toLocaleDateString('uk-UA')}</span>
                    </div>
                    <h4 className="font-bold text-sm">Тема: {fb.topic}</h4>
                    <div className="flex flex-wrap gap-2 text-[11px] font-semibold">
                      <span className="px-2.5 py-1 rounded-full bg-sky-100 text-sky-700">Засвоєння: {fb.understanding_level}</span>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700">ДЗ: {fb.homework_status}</span>
                    </div>
                    <p className="text-xs text-[#353535]/80 bg-white p-4 rounded-xl border border-[#BDE5FF]/30">{fb.feedback_text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* МАТЕРІАЛИ */}
        {activeTab === 'materials' && (
          <div className="p-8 md:p-10 rounded-[3rem] bg-white border border-[#BDE5FF]/60 shadow-[0_15px_40px_rgba(83,166,216,0.08)] space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#53A6D8]" /> Методичні матеріали
            </h3>
            <div className="space-y-4">
              {materials.map(mat => (
                <div key={mat.id} className="p-5 rounded-2xl bg-[#F8FBFF] border border-[#BDE5FF]/50 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#53A6D8]">{mat.type}</span>
                    <h4 className="font-bold text-sm">{mat.title}</h4>
                  </div>
                  <a href={mat.link} className="px-4 py-2 rounded-xl bg-white border border-[#BDE5FF] text-[#53A6D8] text-xs font-bold hover:bg-[#53A6D8] hover:text-white transition-all shadow-sm">
                    Відкрити &rarr;
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ПРОФІЛЬ */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-8 rounded-[2.5rem] bg-white border border-[#BDE5FF]/60 shadow-[0_10px_30px_rgba(83,166,216,0.06)] space-y-4">
              <h3 className="text-base font-bold text-[#53A6D8] flex items-center gap-2"><User className="w-4 h-4" /> Особисті дані</h3>
              <div className="space-y-2 text-xs text-[#353535]/80">
                <p><b>Email:</b> {teacher?.email}</p>
                <p><b>Телефон:</b> {teacher?.phone}</p>
                <p><b>Вік:</b> {teacher?.age} років</p>
              </div>
            </div>
            <div className="p-8 rounded-[2.5rem] bg-white border border-[#BDE5FF]/60 shadow-[0_10px_30px_rgba(83,166,216,0.06)] space-y-4">
              <h3 className="text-base font-bold text-[#53A6D8] flex items-center gap-2"><BookOpen className="w-4 h-4" /> Мотивація</h3>
              <p className="text-xs text-[#353535]/80 leading-relaxed">{teacher?.achievements || 'Не вказано.'}</p>
            </div>
          </div>
        )}
      </section>

      {/* МОДАЛЬНЕ ВІКНО: ДОДАТИ ЗАНЯТТЯ */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-[2.5rem] border border-[#BDE5FF] p-8 md:p-10 max-w-lg w-full shadow-2xl relative space-y-6">
            <button onClick={() => setIsAddModalOpen(false)} className="absolute top-6 right-6 w-10 h-10 rounded-full bg-[#F8FBFF] border border-[#BDE5FF] text-[#353535] flex items-center justify-center hover:bg-[#53A6D8] hover:text-white transition-all">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-2xl font-bold">Створити заняття у розкладі</h3>
            <form onSubmit={handleAddLesson} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-[#353535]/70 uppercase text-[10px]">ПІБ учня</label>
                <input type="text" required value={studentName} onChange={e => setStudentName(e.target.value)} placeholder="Наприклад: Олександра Коваленко" className="w-full px-5 py-3.5 rounded-2xl bg-[#F8FBFF] border border-[#BDE5FF] focus:outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#353535]/70 uppercase text-[10px]">Дата</label>
                  <input type="date" required value={lessonDate} onChange={e => setLessonDate(e.target.value)} className="w-full px-5 py-3.5 rounded-2xl bg-[#F8FBFF] border border-[#BDE5FF] focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-[#353535]/70 uppercase text-[10px]">Час</label>
                  <input type="time" required value={lessonTime} onChange={e => setLessonTime(e.target.value)} className="w-full px-5 py-3.5 rounded-2xl bg-[#F8FBFF] border border-[#BDE5FF] focus:outline-none" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="font-bold text-[#353535]/70 uppercase text-[10px]">Посилання на Zoom / Meet</label>
                <input type="url" placeholder="https://zoom.us/..." value={meetingLink} onChange={e => setMeetingLink(e.target.value)} className="w-full px-5 py-3.5 rounded-2xl bg-[#F8FBFF] border border-[#BDE5FF] focus:outline-none" />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-[#353535]/70 uppercase text-[10px]">Нотатки</label>
                <textarea rows={3} placeholder="Тема заняття..." value={notes} onChange={e => setNotes(e.target.value)} className="w-full px-5 py-3.5 rounded-2xl bg-[#F8FBFF] border border-[#BDE5FF] focus:outline-none resize-none" />
              </div>
              <button type="submit" className="w-full py-4 rounded-2xl bg-[#53A6D8] text-white font-bold hover:bg-[#3f8dbe] transition-all shadow-md">
                Зберегти заняття
              </button>
            </form>
          </div>
        </div>
      )}

      {/* МОДАЛЬНЕ ВІКНО: ЗАЛИШИТИ ФІДБЕК */}
      {isFeedbackModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-[2.5rem] border border-[#BDE5FF] p-8 md:p-10 max-w-lg w-full shadow-2xl relative space-y-6">
            <button onClick={() => setIsFeedbackModalOpen(false)} className="absolute top-6 right-6 w-10 h-10 rounded-full bg-[#F8FBFF] border border-[#BDE5FF] text-[#353535] flex items-center justify-center hover:bg-[#53A6D8] hover:text-white transition-all">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-2xl font-bold">Фідбек про заняття</h3>
            <p className="text-xs font-semibold text-[#53A6D8]">Учень: {selectedStudentForFeedback}</p>

            <form onSubmit={handleAddFeedback} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-[#353535]/70 uppercase text-[10px]">Тема / Пройдений матеріал</label>
                <input type="text" required placeholder="Наприклад: Квітневі хвилі в оптиці" value={lessonTopic} onChange={e => setLessonTopic(e.target.value)} className="w-full px-5 py-3.5 rounded-2xl bg-[#F8FBFF] border border-[#BDE5FF] focus:outline-none" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#353535]/70 uppercase text-[10px]">Засвоєння матеріалу</label>
                  <select value={understandingLevel} onChange={e => setUnderstandingLevel(e.target.value)} className="w-full px-5 py-3.5 rounded-2xl bg-[#F8FBFF] border border-[#BDE5FF] focus:outline-none">
                    <option value="Відмінно">Відмінно</option>
                    <option value="Добре">Добре</option>
                    <option value="Потребує уваги">Потребує уваги</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-[#353535]/70 uppercase text-[10px]">Статус домашнього завдання</label>
                  <select value={homeworkStatus} onChange={e => setHomeworkStatus(e.target.value)} className="w-full px-5 py-3.5 rounded-2xl bg-[#F8FBFF] border border-[#BDE5FF] focus:outline-none">
                    <option value="Виконано повністю">Виконано повністю</option>
                    <option value="Частково">Частково</option>
                    <option value="Не виконано">Не виконано</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#353535]/70 uppercase text-[10px]">Детальний відгук / коментар</label>
                <textarea rows={4} required placeholder="Опишіть успіхи учня, на що звернути увагу наступного разу..." value={feedbackText} onChange={e => setFeedbackText(e.target.value)} className="w-full px-5 py-3.5 rounded-2xl bg-[#F8FBFF] border border-[#BDE5FF] focus:outline-none resize-none" />
              </div>

              <button type="submit" className="w-full py-4 rounded-2xl bg-[#53A6D8] text-white font-bold hover:bg-[#3f8dbe] transition-all shadow-md">
                Зберегти та надіслати фідбек
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}