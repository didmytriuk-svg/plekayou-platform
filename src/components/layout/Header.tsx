'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Instagram, Send, Disc as TikTok, User } from 'lucide-react'

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-sky-200">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image 
            src="/logo.png" 
            alt="PLEKAYOU Logo" 
            width={140} 
            height={40} 
            className="h-9 w-auto object-contain"
            priority 
          />
        </Link>
        
        <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-700">
          <Link href="/" className="hover:text-sky-600 transition-colors">Головна</Link>
          <Link href="/events" className="hover:text-sky-600 transition-colors">Події</Link>
          <Link href="/opportunities" className="hover:text-sky-600 transition-colors">Можливості</Link>
          <Link href="/articles" className="hover:text-sky-600 transition-colors">Блог</Link>
          <Link href="/join/volunteer" className="hover:text-sky-600 transition-colors">Стати волонтером</Link>
          <Link href="/join/student" className="hover:text-sky-600 transition-colors">Стати учнем</Link>
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-sky-600 mr-2">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="p-2.5 hover:bg-sky-50 rounded-full transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="https://t.me" target="_blank" rel="noreferrer" className="p-2.5 hover:bg-sky-50 rounded-full transition-colors">
              <Send className="w-5 h-5" />
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="p-2.5 hover:bg-sky-50 rounded-full transition-colors">
              <TikTok className="w-5 h-5" />
            </a>
          </div>
          
          <Link 
            href="/login" 
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-sky-700 bg-sky-50 border border-sky-200 hover:bg-sky-100 transition-all shadow-sm"
          >
            <User className="w-4 h-4" />
            <span>Кабінет</span>
          </Link>
        </div>
      </div>
    </header>
  )
}