'use client'

import { cn } from '@/lib/utils'

interface CircularHudProps {
  className?: string
  /** number of tick marks on the outer ring */
  ticks?: number
  /** show the crosshair reticle in the middle */
  reticle?: boolean
  /** fixed pixel size; when omitted the element fills its container */
  size?: number
  /** stronger glow variant */
  intense?: boolean
  children?: React.ReactNode
}

/**
 * Layered rotating HUD rings — the recurring visual language of TARDS.
 * Pure SVG + CSS transforms so it stays GPU-friendly and 60fps.
 */
export function CircularHud({
  className,
  ticks = 60,
  reticle = true,
  size,
  intense = false,
  children,
}: CircularHudProps) {
  const tickArray = Array.from({ length: ticks })
  return (
    <div
      className={cn('relative aspect-square', intense && 'animate-glow-breathe', className)}
      style={size ? { width: size, height: size } : undefined}
    >
      {/* outer ticked ring — slow clockwise */}
      <svg
        viewBox="0 0 200 200"
        className="absolute inset-0 h-full w-full animate-spin-slower text-primary/50"
        aria-hidden
      >
        <circle cx="100" cy="100" r="96" fill="none" stroke="currentColor" strokeWidth="0.4" />
        {tickArray.map((_, i) => {
          const a = (i / ticks) * Math.PI * 2
          const long = i % 5 === 0
          const r1 = long ? 88 : 91
          const r2 = 96
          return (
            <line
              key={i}
              x1={100 + Math.cos(a) * r1}
              y1={100 + Math.sin(a) * r1}
              x2={100 + Math.cos(a) * r2}
              y2={100 + Math.sin(a) * r2}
              stroke="currentColor"
              strokeWidth={long ? 0.8 : 0.35}
              opacity={long ? 0.9 : 0.45}
            />
          )
        })}
      </svg>

      {/* mid dashed ring — counter-clockwise */}
      <svg
        viewBox="0 0 200 200"
        className="absolute inset-0 h-full w-full animate-spin-reverse text-red-bright/60"
        aria-hidden
      >
        <circle
          cx="100"
          cy="100"
          r="76"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.6"
          strokeDasharray="2 6"
        />
        {/* segmented arcs */}
        <path
          d="M100 18 A82 82 0 0 1 168 66"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          opacity="0.8"
        />
        <path
          d="M100 182 A82 82 0 0 1 32 134"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          opacity="0.8"
        />
      </svg>

      {/* inner ring — slow clockwise, brighter */}
      <svg
        viewBox="0 0 200 200"
        className="absolute inset-0 h-full w-full animate-spin-slow text-primary/70"
        aria-hidden
      >
        <circle cx="100" cy="100" r="58" fill="none" stroke="currentColor" strokeWidth="0.5" />
        {[0, 90, 180, 270].map((deg) => {
          const a = (deg * Math.PI) / 180
          return (
            <g key={deg}>
              <circle
                cx={100 + Math.cos(a) * 58}
                cy={100 + Math.sin(a) * 58}
                r="2.2"
                fill="currentColor"
              />
            </g>
          )
        })}
      </svg>

      {/* static reticle */}
      {reticle && (
        <svg
          viewBox="0 0 200 200"
          className="absolute inset-0 h-full w-full text-primary/30"
          aria-hidden
        >
          <line x1="100" y1="4" x2="100" y2="30" stroke="currentColor" strokeWidth="0.5" />
          <line x1="100" y1="170" x2="100" y2="196" stroke="currentColor" strokeWidth="0.5" />
          <line x1="4" y1="100" x2="30" y2="100" stroke="currentColor" strokeWidth="0.5" />
          <line x1="170" y1="100" x2="196" y2="100" stroke="currentColor" strokeWidth="0.5" />
        </svg>
      )}

      {/* centered content */}
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  )
}
