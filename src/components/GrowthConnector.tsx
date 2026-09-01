'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Сигнатурний елемент дизайну: маленький «пагінець», що проростає між
 * секціями, коли користувач гортає сторінку. Це буквальна метафора
 * «плекання» — а не декоративна анімація заради анімації.
 */
export function GrowthConnector({ variant = 'default' }: { variant?: 'default' | 'compact' }) {
  const ref = useRef<HTMLDivElement>(null)
  const [grown, setGrown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setGrown(true)
          obs.disconnect()
        }
      },
      { threshold: 0.5 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const height = variant === 'compact' ? 40 : 64

  return (
    <div ref={ref} className="flex justify-center py-1 select-none" aria-hidden="true">
      <svg width="40" height={height} viewBox={`0 0 40 ${height}`} className="overflow-visible">
        <path
          d={`M20 0 C20 ${height * 0.25}, 8 ${height * 0.3}, 10 ${height * 0.53} C12 ${height * 0.75}, 20 ${height * 0.7}, 20 ${height}`}
          fill="none"
          stroke="#7CB88F"
          strokeWidth="2"
          strokeLinecap="round"
          pathLength={1}
          style={{
            strokeDasharray: 1,
            strokeDashoffset: grown ? 0 : 1,
            transition: 'stroke-dashoffset 1s cubic-bezier(.4,0,.2,1)',
          }}
        />
        {/* маленький листочок, що «розкривається» ближче до кінця */}
        <path
          d={`M20 ${height * 0.55} C26 ${height * 0.5}, 30 ${height * 0.56}, 26 ${height * 0.64} C22 ${height * 0.68}, 19 ${height * 0.62}, 20 ${height * 0.55}Z`}
          fill="#7CB88F"
          style={{
            opacity: grown ? 1 : 0,
            transform: grown ? 'scale(1)' : 'scale(0.3)',
            transformOrigin: `20px ${height * 0.58}px`,
            transition: 'opacity .5s ease .55s, transform .5s cubic-bezier(.34,1.56,.64,1) .55s',
          }}
        />
        <circle cx="20" cy="0" r="3" fill="#53A6D8" />
        <circle
          cx="20"
          cy={height}
          r="3"
          fill="#7CB88F"
          style={{ opacity: grown ? 1 : 0, transition: 'opacity .4s ease .9s' }}
        />
      </svg>
    </div>
  )
}