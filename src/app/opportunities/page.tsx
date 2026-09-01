import Link from 'next/link'
import { Montserrat } from 'next/font/google'
import { createClient } from '@/lib/supabase/server'
import { Compass, ArrowRight } from 'lucide-react'
import { InteractiveBackground } from '@/components/InteractiveBackground'

export const revalidate = 0

const montserrat = Montserrat({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-montserrat',
})

export default async function OpportunitiesPage() {
  const supabase = await createClient()
  const { data: opportunities, error } = await supabase
    .from('opportunities')
    .select('*')
    .order('created_at', { ascending: false })

  const oppList = opportunities || []

  return (
    <div className={`${montserrat.variable} font-[family-name:var(--font-montserrat)] text-[#353535] bg-[#FFFFFF] relative overflow-hidden min-h-screen`}>
      <InteractiveBackground />

      <section className="relative pt-24 pb-16 px-6 max-w-7xl mx-auto z-10 space-y-4">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#53A6D8]">Розвиток</span>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Можливості для тебе</h1>
        <p className="text-base md:text-lg text-[#353535]/75 font-medium max-w-2xl leading-relaxed">
          Гранти, програми обміну, хакатони та освітні ініціативи, які допоможуть розкрити твій потенціал.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-28 relative z-10">
        {oppList.length === 0 ? (
          <div className="p-12 rounded-[2.5rem] bg-white border border-[#BDE5FF]/60 text-center space-y-3">
            <p className="text-base font-semibold text-[#353535]/70">Наразі можливості оновлюються.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {oppList.map((opp) => (
              <div key={opp.id} className="p-8 rounded-[2.5rem] bg-white border border-[#BDE5FF]/60 flex flex-col justify-between gap-8 shadow-[0_8px_25px_rgba(83,166,216,0.06)] hover:border-[#53A6D8] transition-all">
                <div className="space-y-4">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#53A6D8] bg-[#BDE5FF]/30 px-3.5 py-1.5 rounded-full">
                    <Compass className="w-3.5 h-3.5" />
                    {opp.category}
                  </span>
                  <h3 className="text-xl font-bold">{opp.title}</h3>
                  <p className="text-xs font-medium text-[#353535]/75 leading-relaxed">{opp.description}</p>
                </div>
                {opp.link && (
                  <Link
                    href={opp.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-full py-3.5 rounded-2xl text-xs font-bold text-white bg-[#53A6D8] hover:bg-[#3f8dbe] transition-colors shadow-[0_4px_15px_rgba(83,166,216,0.25)]"
                  >
                    Дізнатись більше <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}