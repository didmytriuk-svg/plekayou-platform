'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { Montserrat } from 'next/font/google'
import { createClient } from '@/lib/supabase/client'
import { InteractiveBackground } from '@/components/InteractiveBackground'
import { ShieldCheck, Mail, Lock, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const montserrat = Montserrat({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-montserrat',
})

export default function AdminLoginPage() {
  const supabase = createClient()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) throw authError

      router.push('/admin')
      router.refresh()
    } catch (err: any) {
      console.error('Login error:', err)
      setError('Невірний email або пароль доступу.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`${montserrat.variable} font-[family-name:var(--font-montserrat)] text-[#353535] bg-[#EAF4FB] min-h-screen flex items-center justify-center p-6 relative overflow-hidden`}>
      <InteractiveBackground />
      
      <div className="w-full max-w-md p-10 rounded-[3rem] bg-white border border-[#BDE5FF]/60 shadow-[0_20px_60px_rgba(83,166,216,0.15)] relative z-10 space-y-8 animate-fadeIn">
        
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-[#BDE5FF]/30 text-[#53A6D8] border border-[#BDE5FF] flex items-center justify-center mx-auto shadow-sm">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">Панель Адміністратора</h1>
          <p className="text-xs text-[#353535]/70">Введіть адміністративні дані для керування платформою PLEKAYOU</p>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-600 font-medium text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#353535]/70">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#53A6D8]" />
              <input 
                type="email" 
                required
                placeholder="admin@plekayou.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-5 py-3.5 rounded-2xl bg-[#F8FBFF] border border-[#BDE5FF]/60 text-sm focus:outline-none focus:border-[#53A6D8] transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#353535]/70">Пароль</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#53A6D8]" />
              <input 
                type="password" 
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-5 py-3.5 rounded-2xl bg-[#F8FBFF] border border-[#BDE5FF]/60 text-sm focus:outline-none focus:border-[#53A6D8] transition-all"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-[#53A6D8] text-white font-bold text-sm hover:bg-[#3f8dbe] transition-all shadow-[0_10px_25px_rgba(83,166,216,0.3)] flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Вхід...' : <>Увійти в систему <ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>

        <div className="text-center pt-2">
          <Link href="/" className="text-xs font-bold text-[#53A6D8] hover:underline">
            &larr; Повернутися на головну
          </Link>
        </div>

      </div>

    </div>
  )
}