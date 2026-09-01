'use client'

import { useState } from 'react'
import Image from 'next/image'

interface InteractiveStatsCardProps {
  initialPairs: number
  initialHours: number
}

export function InteractiveStatsCard({ initialPairs, initialHours }: InteractiveStatsCardProps) {
  const [likes, setLikes] = useState(142)
  const [hasLiked, setHasLiked] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const handleLike = () => {
    if (!hasLiked) {
      setLikes(prev => prev + 1)
      setHasLiked(true)
    }
  }

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="bg-white/90 backdrop-blur-xl p-8 md:p-10 rounded-[3rem] border border-[#53A6D8]/30 space-y-6 shadow-[0_20px_50px_rgba(83,166,216,0.18)] relative overflow-hidden transition-all duration-500 hover:shadow-[0_30px_70px_rgba(83,166,216,0.28)] hover:-translate-y-1"
    >
      
      {/* Декоративне сяйво під курсором */}
      <div className="absolute -right-16 -top-16 w-56 h-56 bg-gradient-to-br from-[#53A6D8]/20 to-[#BDE5FF]/30 rounded-full blur-3xl pointer-events-none transition-all duration-700" />

      {/* Верхня частина: Логотип у чистому вигляді без зайвих кнопок */}
      <div className="flex items-center justify-between pb-2 border-b border-[#BDE5FF]">
        <div className="relative w-40 h-14">
          <Image 
            src="/logo.png" 
            alt="Plekayou Logo" 
            fill 
            className="object-contain object-left filter brightness-0 invert drop-shadow-[0_8px_15px_rgba(83,166,216,0.3)]"
            priority
          />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#53A6D8] bg-[#BDE5FF]/40 px-3 py-1 rounded-full">
          Live Community
        </span>
      </div>

      {/* Статистичні показники у чистому та стильному editorial форматі */}
      <div className="space-y-5 font-[family-name:var(--font-montserrat)] py-1">
        <div className="flex justify-between items-baseline group/item">
          <span className="text-xs uppercase tracking-wider text-[#353535]/60 font-bold group-hover/item:text-[#53A6D8] transition-colors">
            Успішних пар
          </span>
          <span className="text-3xl md:text-4xl font-extrabold text-[#53A6D8] tracking-tight">
            {initialPairs}+
          </span>
        </div>

        <div className="border-t border-[#BDE5FF]/60 pt-4 flex justify-between items-baseline group/item">
          <span className="text-xs uppercase tracking-wider text-[#353535]/60 font-bold group-hover/item:text-[#353535] transition-colors">
            Волонтерських годин
          </span>
          <span className="text-3xl md:text-4xl font-extrabold text-[#353535] tracking-tight">
            {initialHours}+
          </span>
        </div>

        <div className="border-t border-[#BDE5FF]/60 pt-4 flex justify-between items-baseline group/item">
          <span className="text-xs uppercase tracking-wider text-[#353535]/60 font-bold group-hover/item:text-[#353535] transition-colors">
            Активна діяльність
          </span>
          <span className="text-2xl md:text-3xl font-extrabold text-[#353535] tracking-tight">
            з 2023 року
          </span>
        </div>
      </div>

      {/* Нижня панель взаємодії */}
      <div className="pt-3 flex items-center justify-between border-t border-[#BDE5FF]">
        <span className="text-xs font-semibold text-[#353535]/70">
          Підтримати спільноту:
        </span>
        <button 
          onClick={handleLike}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-sm ${
            hasLiked 
              ? 'bg-[#53A6D8] text-white scale-105 shadow-md' 
              : 'bg-white border border-[#53A6D8]/50 text-[#53A6D8] hover:bg-[#53A6D8]/10'
          }`}
        >
          <span>❤️</span> <span>{likes}</span>
        </button>
      </div>

    </div>
  )
}