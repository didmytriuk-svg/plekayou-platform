import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="space-y-20 pb-24">
      {/* 1. HERO SECTION */}
      <section className="pt-16 pb-12 bg-gradient-to-b from-sky-50/60 to-transparent">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <span className="inline-block px-3.5 py-1.5 rounded-full bg-sky-100/70 border border-sky-200 text-sky-800 text-xs font-semibold tracking-wide uppercase">
            Про ініціативу PLEKAYOU
          </span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 leading-[1.15]">
            Ми плекаємо покоління, яке змінює Україну через <span className="text-sky-600 underline decoration-sky-300 decoration-wavy">знання</span>
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed font-normal max-w-2xl mx-auto">
            Ми розпочали свою діяльність наприкінці квітня 2023 року, але те, що вже встигли зробити, надихає нас не зупинятися і працювати із ще більшим ентузіазмом.
          </p>
        </div>
      </section>

      {/* 2. ACHIEVEMENTS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Що ми зробили?</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-3xl border border-sky-100 shadow-sm flex flex-col justify-between space-y-6">
            <p className="text-slate-700 text-base leading-relaxed">
              Ми розпочали свою діяльність наприкінці квітня 2023 року, але те, що вже встигли зробити, надихає нас не зупинятися і працювати із ще більшим ентузіазмом.
            </p>
            <div className="pt-4 border-t border-sky-50 text-xs font-semibold text-sky-600 uppercase tracking-wider">
              Наша місія
            </div>
          </div>

          <div className="bg-sky-50/80 p-8 rounded-3xl border border-sky-100 shadow-sm flex flex-col justify-between space-y-4">
            <span className="text-4xl sm:text-5xl font-black text-sky-600 tracking-tight">600+</span>
            <p className="text-slate-700 text-sm font-medium leading-relaxed">
              учнівсько-викладацьких тандемів було створено з нашою допомогою
            </p>
          </div>

          <div className="bg-sky-50/80 p-8 rounded-3xl border border-sky-100 shadow-sm flex flex-col justify-between space-y-4">
            <span className="text-4xl sm:text-5xl font-black text-sky-600 tracking-tight">19</span>
            <p className="text-slate-700 text-sm font-medium leading-relaxed">
              онлайн-зустрічей розмовного клубу організовано для нашої спільноти
            </p>
          </div>

          <div className="bg-sky-50/80 p-8 rounded-3xl border border-sky-100 shadow-sm flex flex-col justify-between space-y-4">
            <span className="text-4xl sm:text-5xl font-black text-sky-600 tracking-tight">3000+</span>
            <p className="text-slate-700 text-sm font-medium leading-relaxed">
              волонтерських годин навчання та менторської підтримки
            </p>
          </div>

          <div className="bg-sky-50/80 p-8 rounded-3xl border border-sky-100 shadow-sm flex flex-col justify-between space-y-4">
            <span className="text-4xl sm:text-5xl font-black text-sky-600 tracking-tight">9</span>
            <p className="text-slate-700 text-sm font-medium leading-relaxed">
              різноманітних подій організували для наших репетиторів і не тільки
            </p>
          </div>

          <div className="bg-sky-50/80 p-8 rounded-3xl border border-sky-100 shadow-sm flex flex-col justify-between space-y-4">
            <span className="text-4xl sm:text-5xl font-black text-sky-600 tracking-tight">4</span>
            <p className="text-slate-700 text-sm font-medium leading-relaxed">
              книжки прочитали й обговорили на онлайн-засіданнях розмовного клубу
            </p>
          </div>
        </div>
      </section>

      {/* 3. CALL TO ACTION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center bg-white p-10 sm:p-14 rounded-3xl border border-sky-100 shadow-xl shadow-sky-50 space-y-6">
        <h3 className="text-2xl sm:text-3xl font-black text-slate-900">Готові приєднатися до нашої спільноти?</h3>
        <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto">
          Обирайте свій шлях — ставайте учнем, щоб опановувати нові горизонти, або волонтером, щоб ділитися знаннями.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            href="/join/student"
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 text-sm font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-xl border border-sky-200 transition-colors"
          >
            Стати учнем
          </Link>
          <Link
            href="/join/volunteer"
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-sm transition-all"
          >
            Стати волонтером
          </Link>
        </div>
      </section>
    </div>
  );
}