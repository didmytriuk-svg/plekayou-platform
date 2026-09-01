export function InteractiveBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {/* Статичні, але глибокі та м'які розмиті плями для створення об'єму */}
      <div 
        className="absolute w-[650px] h-[650px] rounded-full bg-gradient-to-br from-[#BDE5FF]/50 to-[#53A6D8]/15 blur-[120px]"
        style={{ top: '5%', left: '10%' }}
      />
      <div 
        className="absolute w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-[#53A6D8]/15 to-[#BDE5FF]/40 blur-[130px]"
        style={{ top: '35%', right: '5%' }}
      />
      <div 
        className="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-r from-[#BDE5FF]/30 to-[#53A6D8]/10 blur-[140px]"
        style={{ bottom: '10%', left: '20%' }}
      />
    </div>
  )
}