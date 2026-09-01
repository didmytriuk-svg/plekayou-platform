'use client'

import { useState } from 'react'
import { Montserrat } from 'next/font/google'
import { createClient } from '@/lib/supabase/client'
import { InteractiveBackground } from '@/components/InteractiveBackground'
import { GraduationCap, Mail, Lock, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const montserrat = Montserrat({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-montserrat',
})

export default function TeacherLoginPage() {
  const supabase = createClient()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // 1. Пряма перевірка в базі даних (чи існує викладач із таким email та temp_password)
      const { data: teacher, error: dbError } = await supabase
        .from('volunteer_applications')
        .select('*')
        .eq('email', email.trim().toLowerCase())
        .single()

      if (dbError || !teacher) {
        setError('Користувача з такою електронною поштою не знайдено.')
        setLoading(false)
        return
      }

      // Перевіряємо статус
      if (teacher.status !== 'active_cabinet') {
        setError('Ваш кабінет ще не активовано координатором.')
        setLoading(false)
        return
      }

      // Перевіряємо збіг пароля (що зберігається в temp_password)
      if (teacher.temp_password !== password) {
        setError('Невірний пароль доступу.')
        setLoading(false)
        return
      }

      // 2. Викликаємо стандартну авторизацію Supabase Auth
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      })

      if (authError) {
        // Якщо Supabase Auth з якимось нюансом повернув помилку, але пароль в базі ідеально збігся, 
        // робимо примусову реєстрацію/оновлення сесії в Auth для цього користувача прямо зараз
        await supabase.auth.signUp({
          email: email.trim().toLowerCase(),
          password,
        })
        
        await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password,
        })
      }

      // Успішний вхід — зберігаємо маркер в сесійне сховище для надійності та пустимо в дашборд
      localStorage.setItem('plekayou_teacher_email', teacher.email)
      router.push('/teacher/dashboard')
      router.refresh()
    } catch (err: any) {
      setError('Сталася системна помилка. Спробуйте пізніше.')
      setLoading(false)
    }
  }

  return (
    <div className={`${montserrat.variable} font-[family-name:var(--font-montserrat)] text-[#353535] bg-[#FFFFFF] relative overflow-hidden min-h-screen flex items-center justify-center px-6`}>
      <InteractiveBackground />

      <div className="w-full max-w-md p-8 md:p-12 rounded-[3rem] bg-white border border-[#BDE5FF] shadow-[0_20px_50px_rgba(83,166,216,0.1)] relative z-10 space-y-8">
        <div className="text-center space-y-3">
          <div className="w-14 h-14 bg-[#BDE5FF]/30 text-[#53A6D8] rounded-2xl flex items-center justify-center mx-auto shadow-sm">
            <GraduationCap className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Кабінет викладача</h1>
          <p className="text-xs text-[#353535]/70 max-w-xs mx-auto">
            Введіть email та згенерований координатором пароль.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs font-medium text-red-600 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#353535]/70">Електронна пошта</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#53A6D8] absolute left-4 top-1/2 -translate-y-1/2" />
              <input 
                type="email" 
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="teacher@example.com"
                className="w-full pl-11 pr-5 py-4 rounded-2xl bg-[#F8FBFF] border border-[#BDE5FF] text-xs font-medium focus:outline-none focus:border-[#53A6D8]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#353535]/70">Пароль</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#53A6D8] absolute left-4 top-1/2 -translate-y-1/2" />
              <input 
                type="password" 
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-5 py-4 rounded-2xl bg-[#F8FBFF] border border-[#BDE5FF] text-xs font-medium focus:outline-none focus:border-[#53A6D8]"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 rounded-2xl text-xs font-bold text-white bg-[#53A6D8] hover:bg-[#3f8dbe] transition-all shadow-[0_10px_25px_rgba(83,166,216,0.3)] flex items-center justify-center gap-2"
          >
            {loading ? 'Вхід у систему...' : 'Увійти в кабінет'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2">
          <Link href="/" className="text-xs font-bold text-[#353535]/60 hover:text-[#53A6D8] transition-colors">
            &larr; На головну сторінку
          </Link>
        </div>
      </div>
    </div>
  )
}