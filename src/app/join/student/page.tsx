'use client'

import { useState } from 'react'
import { Montserrat } from 'next/font/google'
import { createClient } from '@/lib/supabase/client'
import { InteractiveBackground } from '@/components/InteractiveBackground'
import { ArrowRight, CheckCircle2, Sparkles, BookOpen, ShieldAlert } from 'lucide-react'

const montserrat = Montserrat({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-montserrat',
})

export default function StudentJoinPage() {
  const supabase = createClient()
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    email: '',
    student_name: '',
    phone: '',
    age: '10',
    grade: '5 клас',
    language_level: 'Початковий (до B1)',
    subjects: 'Математика',
    other_subject: '',
    subject_level: 'Середній',
    grades_info: '',
    goals: '',
    existing_tutor: '',
    parent_email: '',
    parent_name: '',
    parent_phone: '',
    personal_data_consent: true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const fullDetails = `Вік: ${formData.age}, Клас: ${formData.grade}, Мовний рівень: ${formData.language_level}, Предмети: ${formData.subjects} ${formData.other_subject ? '(' + formData.other_subject + ')' : ''}, Рівень знань: ${formData.subject_level}, Оцінки: ${formData.grades_info}, Мета: ${formData.goals}, Існуючий репетитор: ${formData.existing_tutor}, Батьки: ${formData.parent_name} (${formData.parent_email}, ${formData.parent_phone})`

    const { error: insertError } = await supabase
      .from('student_applications')
      .insert([{
        full_name: formData.student_name,
        email: formData.email,
        phone: formData.phone,
        grade: formData.grade,
        subjects: [formData.subjects],
        goals: fullDetails,
      }])

    if (insertError) {
      setError('Сталася помилка при відправці заявки. Спробуйте ще раз пізніше.')
      setLoading(false)
    } else {
      setSubmitted(true)
      setLoading(false)
    }
  }

  return (
    <div className={`${montserrat.variable} font-[family-name:var(--font-montserrat)] text-[#353535] bg-[#FFFFFF] relative overflow-hidden min-h-screen`}>
      <InteractiveBackground />

      <section className="relative pt-24 pb-12 px-6 max-w-4xl mx-auto z-10 space-y-4 text-center">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#53A6D8]">Навчання</span>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Подати заявку на навчання</h1>
        <p className="text-base md:text-lg text-[#353535]/75 font-medium max-w-2xl mx-auto leading-relaxed">
          Отримуй безкоштовні додаткові індивідуальні заняття з волонтерами-наставниками та розширюй свої знання.
        </p>
      </section>

      <section className="max-w-3xl mx-auto px-6 pb-28 relative z-10 space-y-10">
        
        {/* ІНФОРМАЦІЙНИЙ БЛОК ПЕРЕД ФОРМОЮ */}
        <div className="p-10 md:p-14 rounded-[3rem] bg-white border border-[#BDE5FF] shadow-[0_15px_40px_rgba(83,166,216,0.08)] space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#BDE5FF]/20 to-transparent rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#BDE5FF]/30 text-[#53A6D8] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Правила та умови програми</span>
            </div>
            <p className="text-sm md:text-base font-medium text-[#353535]/80 leading-relaxed">
              Учень — особистість, яка бере участь в навчальному процесі та здобуває певні знання. Будь ласка, ознайомтеся з умовами перед заповненням форми.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-[#BDE5FF]/50">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[#53A6D8] font-bold text-xs uppercase tracking-wider">
                <BookOpen className="w-4 h-4" />
                <span>Основні вимоги</span>
              </div>
              <ul className="space-y-2.5 text-xs font-medium text-[#353535]/75 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#53A6D8] mt-1.5 shrink-0" />
                  <span>Шкільний вік учнів: від 6 до 16 років.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#53A6D8] mt-1.5 shrink-0" />
                  <span>Вивчення мов доступне лише до рівня B1 включно.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#53A6D8] mt-1.5 shrink-0" />
                  <span>Ми не готуємо до ЗНО/НМТ (учнів 11 класу не беремо).</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[#53A6D8] font-bold text-xs uppercase tracking-wider">
                <ShieldAlert className="w-4 h-4" />
                <span>Важливі деталі</span>
              </div>
              <ul className="space-y-2.5 text-xs font-medium text-[#353535]/75 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#53A6D8] mt-1.5 shrink-0" />
                  <span>Можна обрати не більше двох предметів для вивчення.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#53A6D8] mt-1.5 shrink-0" />
                  <span>Платформа не несе відповідальності за якість отриманої освіти.</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-[#BDE5FF]/50 flex flex-col sm:flex-row items-center justify-between gap-6 bg-[#F8FBFF] p-6 rounded-3xl border">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#353535]/50">Менеджер для зв'язку</span>
              <p className="text-sm font-bold text-[#53A6D8]">@plekayou_ua</p>
            </div>
          </div>
        </div>

        {/* ФОРМА ЗАЯВКИ */}
        <div className="p-8 md:p-14 rounded-[3rem] bg-white border border-[#BDE5FF]/60 shadow-[0_15px_40px_rgba(83,166,216,0.08)]">
          {submitted ? (
            <div className="text-center space-y-6 py-12">
              <div className="w-20 h-20 bg-[#BDE5FF]/30 text-[#53A6D8] rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-3 max-w-md mx-auto">
                <h3 className="text-3xl font-bold">Дякуємо за вашу заявку</h3>
                <p className="text-xs md:text-sm font-medium text-[#353535]/70 leading-relaxed">
                  Дякуємо вам за ваш інтерес до Plekayou. Ми опрацюємо анкету та зв'яжемося з вами найближчим часом.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {error && (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs font-medium text-red-600">
                  {error}
                </div>
              )}

              {/* Контакти заявника */}
              <div className="space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#53A6D8] border-b border-[#BDE5FF]/50 pb-2">
                  Контактна інформація
                </h3>
                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#353535]/75">Вкажіть контактну електронну адресу *</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="name@example.com"
                    className="w-full px-6 py-4 rounded-2xl bg-[#F8FBFF] border border-[#BDE5FF] text-xs font-medium focus:outline-none focus:border-[#53A6D8] transition-all"
                  />
                </div>
              </div>

              {/* Інформація про учня */}
              <div className="space-y-6 pt-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#53A6D8] border-b border-[#BDE5FF]/50 pb-2">
                  Інформація про учня
                </h3>

                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#353535]/75">Прізвище та ім'я учня *</label>
                  <input 
                    type="text" 
                    required
                    value={formData.student_name}
                    onChange={(e) => setFormData({...formData, student_name: e.target.value})}
                    placeholder="Введіть ПІБ учня"
                    className="w-full px-6 py-4 rounded-2xl bg-[#F8FBFF] border border-[#BDE5FF] text-xs font-medium focus:outline-none focus:border-[#53A6D8] transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#353535]/75">Номер телефону учня</label>
                    <input 
                      type="tel" 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="+38(0XX)XXX-XXXX"
                      className="w-full px-6 py-4 rounded-2xl bg-[#F8FBFF] border border-[#BDE5FF] text-xs font-medium focus:outline-none focus:border-[#53A6D8] transition-all"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#353535]/75">Скільки років учню? *</label>
                    <select 
                      value={formData.age}
                      onChange={(e) => setFormData({...formData, age: e.target.value})}
                      className="w-full px-6 py-4 rounded-2xl bg-[#F8FBFF] border border-[#BDE5FF] text-xs font-medium focus:outline-none focus:border-[#53A6D8] transition-all"
                    >
                      {Array.from({ length: 17 }, (_, i) => i + 6).map(ageNum => (
                        <option key={ageNum} value={ageNum}>{ageNum} років</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#353535]/75">Оберіть клас *</label>
                    <select 
                      value={formData.grade}
                      onChange={(e) => setFormData({...formData, grade: e.target.value})}
                      className="w-full px-6 py-4 rounded-2xl bg-[#F8FBFF] border border-[#BDE5FF] text-xs font-medium focus:outline-none focus:border-[#53A6D8] transition-all"
                    >
                      {Array.from({ length: 10 }, (_, i) => i + 1).map(g => (
                        <option key={g} value={`${g} клас`}>{g} клас</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#353535]/75">Рівень мови (якщо вивчається мова)</label>
                    <select 
                      value={formData.language_level}
                      onChange={(e) => setFormData({...formData, language_level: e.target.value})}
                      className="w-full px-6 py-4 rounded-2xl bg-[#F8FBFF] border border-[#BDE5FF] text-xs font-medium focus:outline-none focus:border-[#53A6D8] transition-all"
                    >
                      <option value="Не вивчаю мову">Не вивчаю мову</option>
                      <option value="Початковий (A1-A2)">Початковий (A1-A2)</option>
                      <option value="Середній (B1)">Середній (B1)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#353535]/75">Які предмети ви хочете вивчати? (оберіть основний) *</label>
                  <select 
                    value={formData.subjects}
                    onChange={(e) => setFormData({...formData, subjects: e.target.value})}
                    className="w-full px-6 py-4 rounded-2xl bg-[#F8FBFF] border border-[#BDE5FF] text-xs font-medium focus:outline-none focus:border-[#53A6D8] transition-all"
                  >
                    <option value="Математика">Математика</option>
                    <option value="Українська мова">Українська мова</option>
                    <option value="Англійська мова">Англійська мова</option>
                    <option value="Історія України">Історія України</option>
                    <option value="Фізика">Фізика</option>
                    <option value="Хімія">Хімія</option>
                    <option value="Біологія">Біологія</option>
                    <option value="Інший предмет">Інший предмет</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#353535]/75">Інший предмет (якщо обрано вище)</label>
                  <input 
                    type="text" 
                    value={formData.other_subject}
                    onChange={(e) => setFormData({...formData, other_subject: e.target.value})}
                    placeholder="Введіть назву предмета"
                    className="w-full px-6 py-4 rounded-2xl bg-[#F8FBFF] border border-[#BDE5FF] text-xs font-medium focus:outline-none focus:border-[#53A6D8] transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#353535]/75">Який у вас рівень з даних предметів?</label>
                    <select 
                      value={formData.subject_level}
                      onChange={(e) => setFormData({...formData, subject_level: e.target.value})}
                      className="w-full px-6 py-4 rounded-2xl bg-[#F8FBFF] border border-[#BDE5FF] text-xs font-medium focus:outline-none focus:border-[#53A6D8] transition-all"
                    >
                      <option value="Початковий">Початковий</option>
                      <option value="Середній">Середній</option>
                      <option value="Високий">Високий</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#353535]/75">Семестрові/річні оцінки за минулий рік</label>
                    <input 
                      type="text" 
                      value={formData.grades_info}
                      onChange={(e) => setFormData({...formData, grades_info: e.target.value})}
                      placeholder="приклад: математика (9, 10)"
                      className="w-full px-6 py-4 rounded-2xl bg-[#F8FBFF] border border-[#BDE5FF] text-xs font-medium focus:outline-none focus:border-[#53A6D8] transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#353535]/75">Обгрунтуйте. Навіщо вам потрібен репетитор? *</label>
                  <textarea 
                    rows={3}
                    required
                    value={formData.goals}
                    onChange={(e) => setFormData({...formData, goals: e.target.value})}
                    placeholder="Розкажіть про свої цілі та очікування"
                    className="w-full px-6 py-4 rounded-2xl bg-[#F8FBFF] border border-[#BDE5FF] text-xs font-medium focus:outline-none focus:border-[#53A6D8] transition-all resize-none"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#353535]/75">Якщо ви плануєте співпрацювати з конкретним репетитором</label>
                  <input 
                    type="text" 
                    value={formData.existing_tutor}
                    onChange={(e) => setFormData({...formData, existing_tutor: e.target.value})}
                    placeholder="Вкажіть його прізвище, ім'я та предмет"
                    className="w-full px-6 py-4 rounded-2xl bg-[#F8FBFF] border border-[#BDE5FF] text-xs font-medium focus:outline-none focus:border-[#53A6D8] transition-all"
                  />
                </div>
              </div>

              {/* Інформація про батьків */}
              <div className="space-y-6 pt-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#53A6D8] border-b border-[#BDE5FF]/50 pb-2">
                  Інформація про батьків (обов'язково, якщо учню немає 18 років)
                </h3>
                <p className="text-xs font-medium text-[#353535]/60">Якщо учню вже є 18 років, залиште поля з крапками.</p>

                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#353535]/75">Електронна адреса батьків / опікуна</label>
                  <input 
                    type="text" 
                    value={formData.parent_email}
                    onChange={(e) => setFormData({...formData, parent_email: e.target.value})}
                    placeholder="parent@example.com або ..."
                    className="w-full px-6 py-4 rounded-2xl bg-[#F8FBFF] border border-[#BDE5FF] text-xs font-medium focus:outline-none focus:border-[#53A6D8] transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#353535]/75">Прізвище та ім'я батьків / опікуна</label>
                    <input 
                      type="text" 
                      value={formData.parent_name}
                      onChange={(e) => setFormData({...formData, parent_name: e.target.value})}
                      placeholder="ПІБ або ..."
                      className="w-full px-6 py-4 rounded-2xl bg-[#F8FBFF] border border-[#BDE5FF] text-xs font-medium focus:outline-none focus:border-[#53A6D8] transition-all"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#353535]/75">Номер телефону батьків / опікуна</label>
                    <input 
                      type="text" 
                      value={formData.parent_phone}
                      onChange={(e) => setFormData({...formData, parent_phone: e.target.value})}
                      placeholder="+38... або ..."
                      className="w-full px-6 py-4 rounded-2xl bg-[#F8FBFF] border border-[#BDE5FF] text-xs font-medium focus:outline-none focus:border-[#53A6D8] transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Згоди та соцмережі */}
              <div className="space-y-6 pt-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#53A6D8] border-b border-[#BDE5FF]/50 pb-2">
                  Згоди та соцмережі
                </h3>

                <div className="p-6 md:p-8 rounded-3xl bg-[#BDE5FF]/15 border border-[#BDE5FF]/50 space-y-4">
                  <div className="flex items-start gap-3">
                    <input 
                      type="checkbox" 
                      id="personal_data" 
                      required
                      checked={formData.personal_data_consent}
                      onChange={(e) => setFormData({...formData, personal_data_consent: e.target.checked})}
                      className="mt-1 w-4 h-4 rounded text-[#53A6D8] focus:ring-[#53A6D8]"
                    />
                    <label htmlFor="personal_data" className="text-xs font-medium text-[#353535]/80 leading-relaxed">
                      Відповідно до вимог Закону України «Про захист персональних даних» № 2297-VI від 01.06.2010 р., даю згоду на обробку даних. *
                    </label>
                  </div>
                </div>

                <div className="text-xs font-medium text-[#353535]/70 space-y-2">
                  <p className="font-bold uppercase tracking-wider text-[#53A6D8]">Ти вже підписаний на соцмережі Plekayou?</p>
                  <ul className="space-y-1 pl-4 list-disc">
                    <li>Instagram: <a href="http://bit.ly/plekayouinstagram" target="_blank" rel="noreferrer" className="text-[#53A6D8] underline">bit.ly/plekayouinstagram</a></li>
                    <li>Telegram: <a href="https://t.me/plekayou" target="_blank" rel="noreferrer" className="text-[#53A6D8] underline">t.me/plekayou</a></li>
                  </ul>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-5 rounded-2xl text-xs font-bold text-white bg-[#53A6D8] hover:bg-[#3f8dbe] transition-all shadow-[0_10px_25px_rgba(83,166,216,0.3)] flex items-center justify-center gap-2"
              >
                {loading ? 'Відправка...' : 'Надіслати заявку'} <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  )
}