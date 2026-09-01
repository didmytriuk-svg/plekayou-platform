'use client'

import { useState } from 'react'
import { Montserrat } from 'next/font/google'
import { createClient } from '@/lib/supabase/client'
import { InteractiveBackground } from '@/components/InteractiveBackground'
import { CheckCircle2, Sparkles, BookOpen, HeartHandshake, ArrowRight } from 'lucide-react'

const montserrat = Montserrat({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-montserrat',
})

export default function VolunteerJoinPage() {
  const supabase = createClient()
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    age: '',
    subjects: 'Математика',
    achievements: '',
    student_level: 'Середній',
    student_class: '10-11 класи',
    max_students: '2',
    existing_student_info: '',
    whatsapp_consent: true,
    socials_subscribed: true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error: insertError } = await supabase
      .from('volunteer_applications')
      .insert([{
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        age: parseInt(formData.age) || 14,
        subjects: formData.subjects,
        achievements: formData.achievements,
        student_level: formData.student_level,
        student_class: formData.student_class,
        max_students: formData.max_students,
        existing_student_info: formData.existing_student_info,
        whatsapp_consent: formData.whatsapp_consent,
        socials_subscribed: formData.socials_subscribed,
      }])

    if (insertError) {
      console.error('Supabase error:', insertError)
      setError('Сталася помилка при відправці заявки. Перевірте правильність введених даних.')
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
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#53A6D8]">Волонтерство</span>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Стати репетитором-волонтером</h1>
        <p className="text-base md:text-lg text-[#353535]/75 font-medium max-w-2xl mx-auto leading-relaxed">
          Проводьте індивідуальні заняття, діліться знаннями та допомагайте учням досягати нових вершин у теплій спільноті.
        </p>
      </section>

      <section className="max-w-3xl mx-auto px-6 pb-28 relative z-10 space-y-10">
        
        {/* ІНФОРМАЦІЙНИЙ БЛОК */}
        <div className="p-10 md:p-14 rounded-[3rem] bg-white border border-[#BDE5FF] shadow-[0_15px_40px_rgba(83,166,216,0.08)] space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#BDE5FF]/20 to-transparent rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#BDE5FF]/30 text-[#53A6D8] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Про роль репетитора</span>
            </div>
            <p className="text-sm md:text-base font-medium text-[#353535]/80 leading-relaxed">
              Репетитор — це викладач, який проводить додаткові індивідуальні заняття, допомагаючи засвоїти необхідні знання та розкрити потенціал учня.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-[#BDE5FF]/50">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[#53A6D8] font-bold text-xs uppercase tracking-wider">
                <BookOpen className="w-4 h-4" />
                <span>Вимоги до кандидата</span>
              </div>
              <ul className="space-y-2.5 text-xs font-medium text-[#353535]/75 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#53A6D8] mt-1.5 shrink-0" />
                  <span>Вік від 14 повних років.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#53A6D8] mt-1.5 shrink-0" />
                  <span>Високий рівень знань з обраного предмета.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#53A6D8] mt-1.5 shrink-0" />
                  <span>Для викладачів мови: рівень не нижче B1.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#53A6D8] mt-1.5 shrink-0" />
                  <span>Відповідальність та наявність WhatsApp для зв'язку.</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[#53A6D8] font-bold text-xs uppercase tracking-wider">
                <HeartHandshake className="w-4 h-4" />
                <span>Що ви отримаєте</span>
              </div>
              <ul className="space-y-2.5 text-xs font-medium text-[#353535]/75 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#53A6D8] mt-1.5 shrink-0" />
                  <span>Неймовірний практичний викладацький досвід.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#53A6D8] mt-1.5 shrink-0" />
                  <span>Теплу та надихаючу спільноту однодумців.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#53A6D8] mt-1.5 shrink-0" />
                  <span>Сертифікат із зазначеними волонтерськими годинами.</span>
                </li>
              </ul>
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
                  Дякуємо вам за ваш інтерес до Plekayou. Ми впевнені, що разом з вами наша платформа стане ще більш успішною та комфортною для наших учнів.
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

              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-[#353535]/75">Твоє прізвище та ім'я *</label>
                <input 
                  type="text" 
                  required
                  value={formData.full_name}
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                  placeholder="Введіть ваші дані"
                  className="w-full px-6 py-4 rounded-2xl bg-[#F8FBFF] border border-[#BDE5FF] text-xs font-medium focus:outline-none focus:border-[#53A6D8] transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#353535]/75">Твоя електронна адреса *</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="name@example.com"
                    className="w-full px-6 py-4 rounded-2xl bg-[#F8FBFF] border border-[#BDE5FF] text-xs font-medium focus:outline-none focus:border-[#53A6D8] transition-all"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#353535]/75">Твій номер телефону *</label>
                  <input 
                    type="tel" 
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="+38(0XX)XXX-XXXX"
                    className="w-full px-6 py-4 rounded-2xl bg-[#F8FBFF] border border-[#BDE5FF] text-xs font-medium focus:outline-none focus:border-[#53A6D8] transition-all"
                  />
                  <p className="text-[10px] text-[#353535]/50">Обов'язково мати WhatsApp, підв'язаний до цього номеру.</p>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-[#353535]/75">Скільки тобі повних років? *</label>
                <input 
                  type="number" 
                  required
                  min={14}
                  value={formData.age}
                  onChange={(e) => setFormData({...formData, age: e.target.value})}
                  placeholder="Мінімум 14 років"
                  className="w-full px-6 py-4 rounded-2xl bg-[#F8FBFF] border border-[#BDE5FF] text-xs font-medium focus:outline-none focus:border-[#53A6D8] transition-all"
                />
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-[#353535]/75">Які предмети ти хочеш викладати? *</label>
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
                  <option value="Географія">Географія</option>
                  <option value="Інформатика">Інформатика</option>
                  <option value="Інший предмет">Інший предмет</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-[#353535]/75">Вкажи свої академічні досягнення</label>
                <textarea 
                  rows={3}
                  value={formData.achievements}
                  onChange={(e) => setFormData({...formData, achievements: e.target.value})}
                  placeholder="Оцінки за рік в школі / бали НМТ чи ЗНО / призові місця на олімпіадах"
                  className="w-full px-6 py-4 rounded-2xl bg-[#F8FBFF] border border-[#BDE5FF] text-xs font-medium focus:outline-none focus:border-[#53A6D8] transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#353535]/75">Оберіть рівень учня *</label>
                  <select 
                    value={formData.student_level}
                    onChange={(e) => setFormData({...formData, student_level: e.target.value})}
                    className="w-full px-6 py-4 rounded-2xl bg-[#F8FBFF] border border-[#BDE5FF] text-xs font-medium focus:outline-none focus:border-[#53A6D8] transition-all"
                  >
                    <option value="Початковий">Початковий</option>
                    <option value="Середній">Середній</option>
                    <option value="Високий">Високий</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#353535]/75">Оберіть клас учня *</label>
                  <select 
                    value={formData.student_class}
                    onChange={(e) => setFormData({...formData, student_class: e.target.value})}
                    className="w-full px-6 py-4 rounded-2xl bg-[#F8FBFF] border border-[#BDE5FF] text-xs font-medium focus:outline-none focus:border-[#53A6D8] transition-all"
                  >
                    <option value="5-7 класи">5-7 класи</option>
                    <option value="8-9 класи">8-9 класи</option>
                    <option value="10-11 класи">10-11 класи</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-[#353535]/75">Скільки учнів ти можеш навчати? *</label>
                <select 
                  value={formData.max_students}
                  onChange={(e) => setFormData({...formData, max_students: e.target.value})}
                  className="w-full px-6 py-4 rounded-2xl bg-[#F8FBFF] border border-[#BDE5FF] text-xs font-medium focus:outline-none focus:border-[#53A6D8] transition-all"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                    <option key={num} value={num}>{num} {num === 1 ? 'учень' : 'учнів'}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-[#353535]/75">Якщо у вас є учень, з яким ви плануєте подальшу співпрацю</label>
                <input 
                  type="text" 
                  value={formData.existing_student_info}
                  onChange={(e) => setFormData({...formData, existing_student_info: e.target.value})}
                  placeholder="Вкажіть його прізвище, ім’я, предмет і клас"
                  className="w-full px-6 py-4 rounded-2xl bg-[#F8FBFF] border border-[#BDE5FF] text-xs font-medium focus:outline-none focus:border-[#53A6D8] transition-all"
                />
              </div>

              <div className="p-6 md:p-8 rounded-3xl bg-[#BDE5FF]/15 border border-[#BDE5FF]/50 space-y-4">
                <div className="flex items-start gap-3">
                  <input 
                    type="checkbox" 
                    id="whatsapp" 
                    required
                    checked={formData.whatsapp_consent}
                    onChange={(e) => setFormData({...formData, whatsapp_consent: e.target.checked})}
                    className="mt-1 w-4 h-4 rounded text-[#53A6D8] focus:ring-[#53A6D8]"
                  />
                  <label htmlFor="whatsapp" className="text-xs font-medium text-[#353535]/80 leading-relaxed">
                    Чи надаєте дозвіл, аби наші менеджери додали Вас до спільноти викладачів у WhatsApp? *
                  </label>
                </div>

                <div className="flex items-start gap-3">
                  <input 
                    type="checkbox" 
                    id="socials" 
                    required
                    checked={formData.socials_subscribed}
                    onChange={(e) => setFormData({...formData, socials_subscribed: e.target.checked})}
                    className="mt-1 w-4 h-4 rounded text-[#53A6D8] focus:ring-[#53A6D8]"
                  />
                  <label htmlFor="socials" className="text-xs font-medium text-[#353535]/80 leading-relaxed">
                    Ти вже підписаний на соцмережі Plekayou (Instagram, WhatsApp)? *
                  </label>
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