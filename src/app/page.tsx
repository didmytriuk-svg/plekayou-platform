import Link from 'next/link'
import Image from 'next/image'
import { Montserrat } from 'next/font/google'
import { createClient } from '@/lib/supabase/server'
import { ArrowRight, Calendar, Heart, Users, BookOpen, ShieldCheck, Compass } from 'lucide-react'
import { InteractiveBackground } from '@/components/InteractiveBackground'

export const revalidate = 0

const montserrat = Montserrat({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-montserrat',
})

export default async function HomePage() {
  const supabase = await createClient()

  const [
    { count: volunteersCount },
    { count: pairsCount },
    eventsRes,
    partnersRes,
  ] = await Promise.all([
    supabase.from('volunteers').select('*', { count: 'exact', head: true }),
    supabase.from('pairs').select('*', { count: 'exact', head: true }),
    supabase.from('events').select('*').order('event_date', { ascending: true }).limit(3),
    supabase.from('partners').select('*'),
  ])

  const events = eventsRes.data || []
  const partners = partnersRes.data || []
  const pairs = pairsCount && pairsCount > 0 ? pairsCount : 300
  const hours = volunteersCount && volunteersCount > 0 ? volunteersCount * 50 : 900

  return (
    <div className={`${montserrat.variable} font-[family-name:var(--font-montserrat)] text-[#353535] bg-[#FFFFFF] relative overflow-hidden`}>
      <InteractiveBackground />

      {/* ───────────────────────── HERO ───────────────────────── */}
      <section className="relative pt-28 pb-20 px-6 max-w-7xl mx-auto z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          <div className="lg:col-span-7 space-y-8">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-[#353535] leading-[1.05]">
              Плекай майбутнє <span className="text-[#0284c7] underline decoration-[#BDE5FF] decoration-wavy decoration-4">своєї</span> країни
            </h1>

            <p className="text-lg md:text-xl text-[#353535]/75 font-medium leading-relaxed max-w-2xl">
              Plekayou — українська молодіжна освітня волонтерська ініціатива. Ми прагнемо довести, що знання доступні кожному, а навчання може бути цікавим і різноманітним.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <Link 
                href="/join/student" 
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-xs font-bold text-white bg-[#53A6D8] hover:bg-[#3f8dbe] transition-all shadow-[0_10px_25px_rgba(83,166,216,0.3)]"
              >
                Знайти наставника <ArrowRight className="w-4 h-4" />
              </Link>
              <Link 
                href="/join/volunteer" 
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-xs font-bold text-[#353535] bg-white border border-[#353535]/15 hover:border-[#53A6D8] transition-all shadow-sm"
              >
                Стати волонтером
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 bg-[#BDE5FF]/20 p-10 rounded-[3rem] border border-[#BDE5FF] space-y-8 shadow-[0_15px_35px_rgba(83,166,216,0.1)] relative">
            <div className="relative w-48 h-16">
              <Image 
                src="/logo.png" 
                alt="Plekayou Logo" 
                fill 
                className="object-contain object-left filter brightness-0 invert drop-shadow-[0_8px_15px_rgba(83,166,216,0.25)]"
                priority
              />
            </div>

            <div className="space-y-4 font-[family-name:var(--font-montserrat)]">
              <div className="border-t border-[#BDE5FF] pt-4 flex justify-between items-baseline">
                <span className="text-xs uppercase tracking-wider text-[#353535]/60 font-semibold">Успішних пар</span>
                <span className="text-3xl font-bold text-[#53A6D8]">{pairs}+</span>
              </div>
              <div className="border-t border-[#BDE5FF] pt-4 flex justify-between items-baseline">
                <span className="text-xs uppercase tracking-wider text-[#353535]/60 font-semibold">Волонтерських годин</span>
                <span className="text-3xl font-bold text-[#353535]">{hours}+</span>
              </div>
              <div className="border-t border-[#BDE5FF] pt-4 flex justify-between items-baseline">
                <span className="text-xs uppercase tracking-wider text-[#353535]/60 font-semibold">Діяльність</span>
                <span className="text-3xl font-bold text-[#353535]">з 2023 року</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ───────────────────────── НАПРЯМКИ ───────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-20 space-y-12 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#53A6D8]">Напрямки</span>
            <h2 className="text-3xl md:text-4xl font-bold">Що ми робимо?</h2>
          </div>
          <p className="text-xs font-medium text-[#353535]/60 max-w-sm">
            Створюємо середовище, де кожен крок спрямований на твій впевнений особистий та освітній ріст.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { num: '01', title: 'Репетиторство', desc: 'Розбудовуємо спільноту репетиторів-волонтерів.' },
            { num: '02', title: 'Модерація', desc: 'Модеруємо взаємодію між учнями та репетиторами.' },
            { num: '03', title: 'Ініціативи', desc: 'Залучаємо молодь до викладацької та волонтерської діяльності.' },
            { num: '04', title: 'Події', desc: 'Організовуємо різноманітні освітні заходи.' },
          ].map((item, idx) => (
            <div key={idx} className="p-8 rounded-[2.5rem] bg-white border border-[#BDE5FF]/60 flex flex-col justify-between space-y-8 shadow-[0_8px_25px_rgba(83,166,216,0.06)] hover:border-[#53A6D8] transition-all">
              <span className="text-sm font-bold text-[#53A6D8] bg-[#BDE5FF]/30 w-10 h-10 rounded-2xl flex items-center justify-center">
                {item.num}
              </span>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">{item.title}</h3>
                <p className="text-xs font-medium text-[#353535]/70 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ───────────────────────── ЦІННОСТІ ───────────────────────── */}
      <section className="bg-[#BDE5FF]/10 py-24 border-y border-[#BDE5FF]/30 relative z-10">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#53A6D8]">Наша місія</span>
            <h2 className="text-3xl md:text-4xl font-bold">Сприяти всебічному розвитку української молоді</h2>
            <p className="text-xs font-medium text-[#353535]/70 leading-relaxed">
              Простір якісної освіти, підтримки та розвитку для кожного учасника нашого ком&apos;юніті.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Heart, title: 'Любов та підтримка', text: 'Наші менеджери створюють та підтримують атмосферу, яка б сприяла плідному навчанню.' },
              { icon: ShieldCheck, title: 'Довіра', text: 'Ми створюємо можливості для навчання, але не контролюємо його перебіг, кількість та тривалість занять.' },
              { icon: Users, title: 'Повага', text: 'Ми віримо в те, що кожна унікальна особистість збагачує нашу команду та робить сильнішими.' },
              { icon: BookOpen, title: 'Українська мова', text: 'Для нас важливо не забувати про своє коріння та плекати майбутнє країни.' },
            ].map((val, i) => (
              <div key={i} className="p-8 rounded-[2.5rem] bg-white border border-[#BDE5FF]/60 space-y-4 shadow-[0_8px_25px_rgba(83,166,216,0.06)]">
                <div className="w-10 h-10 rounded-xl bg-[#BDE5FF]/30 text-[#53A6D8] flex items-center justify-center">
                  <val.icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base">{val.title}</h3>
                <p className="text-xs font-medium text-[#353535]/70 leading-relaxed">{val.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────────── ЩО МИ ЗРОБИЛИ? ───────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 space-y-10 py-24 relative z-10">
        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#53A6D8]">Статистика</span>
          <h2 className="text-3xl md:text-4xl font-bold">Що ми зробили?</h2>
          <p className="text-xs font-medium text-[#353535]/60">Наші досягнення у цифрах та фактах з моменту заснування</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-[2.5rem] bg-white border border-[#BDE5FF]/60 shadow-[0_8px_25px_rgba(83,166,216,0.06)] flex flex-col justify-center space-y-3">
            <p className="text-xs sm:text-sm font-medium text-[#353535] leading-relaxed">
              Ми розпочали свою діяльність наприкінці квітня 2023 року, але те, що вже встигли зробити, надихає нас не зупинятися і працювати із ще більшим ентузіазмом.
            </p>
          </div>

          <div className="p-8 rounded-[2.5rem] bg-white border border-[#BDE5FF]/60 shadow-[0_8px_25px_rgba(83,166,216,0.06)] flex flex-col justify-center space-y-2">
            <div className="text-4xl md:text-5xl font-bold text-[#53A6D8] tracking-tight">300+</div>
            <p className="text-xs font-semibold text-[#353535]">учнівсько-викладацьких тандемів було створено з нашою допомогою</p>
          </div>

          <div className="p-8 rounded-[2.5rem] bg-white border border-[#BDE5FF]/60 shadow-[0_8px_25px_rgba(83,166,216,0.06)] flex flex-col justify-center space-y-2">
            <div className="text-4xl md:text-5xl font-bold text-[#53A6D8] tracking-tight">8</div>
            <p className="text-xs font-semibold text-[#353535]">онлайн-зустрічей розмовного клубу</p>
          </div>

          <div className="p-8 rounded-[2.5rem] bg-white border border-[#BDE5FF]/60 shadow-[0_8px_25px_rgba(83,166,216,0.06)] flex flex-col justify-center space-y-2">
            <div className="text-4xl md:text-5xl font-bold text-[#53A6D8] tracking-tight">900+</div>
            <p className="text-xs font-semibold text-[#353535]">волонтерських годин навчання</p>
          </div>

          <div className="p-8 rounded-[2.5rem] bg-white border border-[#BDE5FF]/60 shadow-[0_8px_25px_rgba(83,166,216,0.06)] flex flex-col justify-center space-y-2">
            <div className="text-4xl md:text-5xl font-bold text-[#53A6D8] tracking-tight">8</div>
            <p className="text-xs font-semibold text-[#353535]">різноманітних подій організували для наших репетиторів і не тільки</p>
          </div>

          <div className="p-8 rounded-[2.5rem] bg-white border border-[#BDE5FF]/60 shadow-[0_8px_25px_rgba(83,166,216,0.06)] flex flex-col justify-center space-y-2">
            <div className="text-4xl md:text-5xl font-bold text-[#53A6D8] tracking-tight">3</div>
            <p className="text-xs font-semibold text-[#353535]">книжки прочитали й обговорили на онлайн засіданнях розмовного клубу</p>
          </div>
        </div>
      </section>

      {/* ───────────────────────── ШВИДКА НАВІГАЦІЯ (Винесено вище у стилі сторінки) ───────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <div className="p-8 md:p-12 rounded-[2.5rem] bg-white border border-[#BDE5FF]/60 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-[0_8px_25px_rgba(83,166,216,0.06)]">
          <div className="space-y-2 text-center lg:text-left">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#53A6D8]">Навігація</span>
            <h3 className="text-2xl md:text-3xl font-bold">Досліджуй наші розділи</h3>
            <p className="text-xs font-medium text-[#353535]/70 max-w-md">
              Знайди все необхідне для навчання та розвитку в один клік.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link 
              href="/events" 
              className="px-6 py-3 rounded-2xl text-xs font-bold text-[#353535] bg-[#BDE5FF]/20 border border-[#BDE5FF] hover:bg-[#BDE5FF]/50 transition-all"
            >
              📅 Події
            </Link>
            <Link 
              href="/opportunities" 
              className="px-6 py-3 rounded-2xl text-xs font-bold text-[#353535] bg-[#BDE5FF]/20 border border-[#BDE5FF] hover:bg-[#BDE5FF]/50 transition-all"
            >
              ✨ Можливості
            </Link>
            <Link 
              href="/articles" 
              className="px-6 py-3 rounded-2xl text-xs font-bold text-[#353535] bg-[#BDE5FF]/20 border border-[#BDE5FF] hover:bg-[#BDE5FF]/50 transition-all"
            >
              📚 Блог
            </Link>
          </div>
        </div>
      </section>

      {/* ───────────────────────── ПОДІЇ ───────────────────────── */}
      {events.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 space-y-10 py-16 relative z-10">
          <div className="flex items-end justify-between">
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#53A6D8]">Календар</span>
              <h2 className="text-3xl md:text-4xl font-bold">Найближчі події</h2>
            </div>
            <Link href="/events" className="text-xs font-bold text-[#53A6D8] hover:text-[#3f8dbe] flex items-center gap-1 shrink-0">
              Усі події <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {events.map((event) => (
              <div key={event.id} className="p-8 rounded-[2.5rem] bg-white border border-[#BDE5FF]/60 flex flex-col justify-between gap-8 shadow-[0_8px_25px_rgba(83,166,216,0.06)] hover:border-[#53A6D8] transition-all">
                <div className="space-y-4">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#53A6D8] bg-[#BDE5FF]/30 px-3.5 py-1.5 rounded-full">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(event.event_date).toLocaleDateString('uk-UA')}
                  </span>
                  <h3 className="text-xl font-bold">{event.title}</h3>
                  <p className="text-xs line-clamp-3 font-medium text-[#353535]/75 leading-relaxed">{event.description}</p>
                </div>
                {event.registration_url && (
                  <Link
                    href={event.registration_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-full py-3.5 rounded-2xl text-xs font-bold text-white bg-[#53A6D8] hover:bg-[#3f8dbe] transition-colors shadow-[0_4px_15px_rgba(83,166,216,0.25)]"
                  >
                    Зареєструватись
                  </Link>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ───────────────────────── ПАРТНЕРИ ───────────────────────── */}
      {partners.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-16 border-t border-[#BDE5FF]/40 relative z-10 text-center">
          <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#353535]/40 mb-10">
            З нами співпрацюють
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-12">
            {partners.map((partner) => (
              <div key={partner.id} className="text-base font-bold text-[#353535]/70 tracking-wide">
                {partner.name}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}