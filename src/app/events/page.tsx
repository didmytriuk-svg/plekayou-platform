'use client'

import { useState, useEffect } from 'react'
import { Montserrat } from 'next/font/google'
import { createClient } from '@/lib/supabase/client'
import { InteractiveBackground } from '@/components/InteractiveBackground'
import { Calendar, Clock, MapPin, Sparkles, ArrowRight, ExternalLink } from 'lucide-react'
import Link from 'next/link'

const montserrat = Montserrat({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-montserrat',
})

export default function PublicEventsPage() {
  const supabase = createClient()
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchEvents() {
      const { data } = await supabase.from('events').select('*').order('event_date', { ascending: true })
      if (data) setEvents(data)
      setLoading(false)
    }
    fetchEvents()
  }, [supabase])

  return (
    <div className={`${montserrat.variable} font-[family-name:var(--font-montserrat)] text-[#353535] bg-[#FFFFFF] relative overflow-hidden min-h-screen`}>
      <InteractiveBackground />

      <section className="relative pt-28 pb-12 px-6 max-w-6xl mx-auto z-10 space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#BDE5FF]/30 text-[#53A6D8] text-xs font-bold uppercase tracking-wider">
          <Calendar className="w-4 h-4" />
          <span>Календар подій</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Події нашої спільноти</h1>
        <p className="text-base md:text-lg text-[#353535]/75 font-medium max-w-2xl leading-relaxed">
          Долучайся до відкритих лекцій, воркшопів, розмовних клубів та подій, які розширюють горизонти.
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-28 relative z-10">
        {loading ? (
          <p className="text-xs text-[#353535]/50 text-center py-16">Завантаження подій...</p>
        ) : events.length === 0 ? (
          <div className="p-12 rounded-[3rem] bg-white border border-[#BDE5FF]/60 text-center space-y-4 shadow-sm">
            <Sparkles className="w-10 h-10 text-[#53A6D8] mx-auto" />
            <h3 className="text-xl font-bold">Наразі немає запланованих подій</h3>
            <p className="text-xs text-[#353535]/70 max-w-md mx-auto">Слідкуйте за оновленнями у нашій спільноті, зовсім скоро тут з'являться нові анонси.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {events.map((ev) => (
              <div key={ev.id} className="p-8 md:p-10 rounded-[3rem] bg-white border border-[#BDE5FF]/60 shadow-[0_15px_40px_rgba(83,166,216,0.08)] space-y-6 flex flex-col justify-between hover:border-[#53A6D8] transition-all">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="px-4 py-1.5 rounded-full bg-[#BDE5FF]/30 text-[#53A6D8] text-xs font-bold flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(ev.event_date).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                    {ev.format && (
                      <span className="px-3 py-1 rounded-full bg-white border border-[#BDE5FF] text-[11px] font-bold text-[#353535]/70">
                        {ev.format}
                      </span>
                    )}
                  </div>

                  <h3 className="text-2xl font-bold tracking-tight">{ev.title}</h3>
                  <p className="text-xs md:text-sm text-[#353535]/75 font-medium leading-relaxed">
                    {ev.description}
                  </p>
                </div>

                <div className="pt-6 border-t border-[#BDE5FF]/40 flex items-center justify-between">
                  <div className="space-y-1 text-xs text-[#353535]/70 font-medium">
                    {ev.event_time && (
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#53A6D8]" />
                        <span>{ev.event_time}</span>
                      </div>
                    )}
                    {ev.location_or_link && (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#53A6D8]" />
                        <span className="truncate max-w-[180px]">{ev.location_or_link}</span>
                      </div>
                    )}
                  </div>

                  <Link 
                    href={ev.registration_link && ev.registration_link.startsWith('http') ? ev.registration_link : '/join/student'}
                    target="_blank"
                    rel="noreferrer"
                    className="px-6 py-3.5 rounded-2xl bg-[#53A6D8] text-white text-xs font-bold hover:bg-[#3f8dbe] transition-all shadow-[0_10px_25px_rgba(83,166,216,0.3)] flex items-center gap-2"
                  >
                    Зареєструватися <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}