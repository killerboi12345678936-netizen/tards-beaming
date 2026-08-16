'use client'

import { useEffect, useRef } from 'react'

/**
 * Layered background: radial crimson glow, drifting grid, faint circuitry,
 * binary/hex strings, scanlines, film noise, and a light particle field.
 * Dense up close, near-empty from a distance. All GPU-friendly.
 */
export function HudBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return
    // skip heavy particles on small screens
    if (window.innerWidth < 768) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let w = (canvas.width = window.innerWidth)
    let h = (canvas.height = window.innerHeight)

    const count = Math.min(48, Math.floor((w * h) / 42000))
    const parts = Array.from({ length: count }).map(() => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vy: 0.15 + Math.random() * 0.35,
      r: Math.random() * 1.4 + 0.3,
      a: Math.random() * 0.5 + 0.1,
    }))

    const onResize = () => {
      w = canvas.width = window.innerWidth
      h = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', onResize)

    const loop = () => {
      ctx.clearRect(0, 0, w, h)
      for (const p of parts) {
        p.y += p.vy
        if (p.y > h) {
          p.y = -5
          p.x = Math.random() * w
        }
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `oklch(0.62 0.26 27 / ${p.a})`
        ctx.fill()
      }
      raf = requestAnimationFrame(loop)
    }
    loop()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  const binaryRows = [
    '01001000 01000001 01000011 01001011 00100000 01010100 01000001 01010010 01000100 01010011',
    '0x4E 0x4F 0x44 0x45 0x20 0x4D 0x41 0x54 0x52 0x49 0x58 0x20 0x4F 0x4E 0x4C 0x49 0x4E 0x45',
    'BEAMING://secure-channel :: handshake=OK :: enc=AES-256 :: latency=11ms :: nodes=024',
    '11000010 10111001 01010011 01000101 01000011 01010101 01010010 01000101 00101111 01001111',
  ]

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-background">
      {/* radial crimson glow */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 90% at 50% -10%, oklch(0.28 0.14 25 / 0.35), transparent 55%), radial-gradient(80% 60% at 100% 100%, oklch(0.22 0.1 25 / 0.25), transparent 60%)',
        }}
      />

      {/* drifting technical grid */}
      <div
        className="absolute inset-0 opacity-[0.5] animate-[grid-drift_14s_linear_infinite]"
        style={{
          backgroundImage:
            'linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(circle at 50% 40%, black, transparent 85%)',
          WebkitMaskImage: 'radial-gradient(circle at 50% 40%, black, transparent 85%)',
        }}
      />

      {/* circuitry fragments */}
      <svg
        className="absolute inset-0 h-full w-full text-primary/[0.06]"
        aria-hidden
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 1440 900"
      >
        <g fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M0 120 H320 L360 160 H640" />
          <path d="M1440 240 H1120 L1080 200 H820" />
          <path d="M0 640 H240 L300 700 H520 L560 660 H900" />
          <path d="M1440 760 H1180 L1140 720 H960" />
          <circle cx="360" cy="160" r="4" />
          <circle cx="1080" cy="200" r="4" />
          <circle cx="300" cy="700" r="4" />
          <circle cx="560" cy="660" r="4" />
          <rect x="636" y="150" width="8" height="20" />
        </g>
      </svg>

      {/* faint binary / hex strings */}
      <div className="absolute inset-0 flex flex-col justify-between py-10 font-mono text-[10px] leading-none text-primary/[0.05]">
        {binaryRows.map((row, i) => (
          <div key={i} className="overflow-hidden whitespace-nowrap px-6">
            <span className="inline-block animate-[ticker_40s_linear_infinite]">
              {row} &nbsp; {row} &nbsp;
            </span>
          </div>
        ))}
      </div>

      {/* particle field */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full opacity-70" aria-hidden />

      {/* scanlines */}
      <div
        className="absolute inset-0 opacity-[0.35] mix-blend-overlay"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, oklch(0.6 0.2 25 / 0.08) 0px, oklch(0.6 0.2 25 / 0.08) 1px, transparent 1px, transparent 3px)',
        }}
      />

      {/* moving scan beam */}
      <div
        className="absolute left-0 right-0 h-24 animate-[scanline-move_8s_linear_infinite]"
        style={{
          background:
            'linear-gradient(to bottom, transparent, oklch(0.6 0.24 27 / 0.06), transparent)',
        }}
      />

      {/* vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 120% at 50% 50%, transparent 55%, oklch(0.05 0.01 25 / 0.85))',
        }}
      />
    </div>
  )
}
