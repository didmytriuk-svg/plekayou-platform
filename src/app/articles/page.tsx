import Link from 'next/link'
import { Montserrat } from 'next/font/google'
import { createClient } from '@/lib/supabase/server'
import { BookOpen, ArrowRight } from 'lucide-react'
import { InteractiveBackground } from '@/components/InteractiveBackground'

export const revalidate = 0

const montserrat = Montserrat({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-montserrat',
})

export default async function ArticlesPage() {
  const supabase = await createClient()
  const { data: articles, error } = await supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false })

  const articleList = articles || []

  return (
    <div className={`${montserrat.variable} font-[family-name:var(--font-montserrat)] text-[#353535] bg-[#FFFFFF] relative overflow-hidden min-h-screen`}>
      <InteractiveBackground />

      <section className="relative pt-24 pb-16 px-6 max-w-7xl mx-auto z-10 space-y-4">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#53A6D8]">Блог</span>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Історії та думки</h1>
        <p className="text-base md:text-lg text-[#353535]/75 font-medium max-w-2xl leading-relaxed">
          Читайте наші статті про освіту майбутнього, поради для ефективного навчання та надихаючі історії учасників.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-28 relative z-10">
        {articleList.length === 0 ? (
          <div className="p-12 rounded-[2.5rem] bg-white border border-[#BDE5FF]/60 text-center space-y-3">
            <p className="text-base font-semibold text-[#353535]/70">Статті готуються до публікації.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {articleList.map((article) => (
              <div key={article.id} className="p-8 rounded-[2.5rem] bg-white border border-[#BDE5FF]/60 flex flex-col justify-between gap-8 shadow-[0_8px_25px_rgba(83,166,216,0.06)] hover:border-[#53A6D8] transition-all">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#53A6D8] bg-[#BDE5FF]/30 px-3.5 py-1.5 rounded-full">
                      <BookOpen className="w-3.5 h-3.5" />
                      {article.author}
                    </span>
                    <span className="text-xs font-semibold text-[#353535]/50">
                      {new Date(article.created_at).toLocaleDateString('uk-UA')}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold">{article.title}</h3>
                  <p className="text-xs font-medium text-[#353535]/75 leading-relaxed">{article.excerpt}</p>
                </div>
                <div className="text-xs font-bold text-[#53A6D8] flex items-center gap-1">
                  Читати далі <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
