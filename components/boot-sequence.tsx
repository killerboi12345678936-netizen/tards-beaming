'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { CircularHud } from './circular-hud'
import { TardsMark } from './tards-mark'

const DIAGNOSTICS = [
  'LOADING BEAMING CORE',
  'INITIALIZING NODE MATRIX',
  'MOUNTING RESOURCE NETWORK',
  'ESTABLISHING SECURE CHANNEL',
  'CALIBRATING HUD',
  'VERIFYING SYSTEM INTEGRITY',
]

const READOUT: [string, string][] = [
  ['NETWORK', 'ONLINE'],
  ['FIREWALL', 'ACTIVE'],
  ['NODES', '024'],
  ['ENCRYPTION', 'ACTIVE'],
  ['SYSTEM', 'READY'],
]

function hex(len: number) {
  let s = ''
  for (let i = 0; i < len; i++) s += Math.floor(Math.random() * 16).toString(16).toUpperCase()
  return s
}

export function BootSequence({ onComplete }: { onComplete: () => void }) {
  const reduced = useRef(false)
  const already = useRef(false)
  const [phase, setPhase] = useState(0) // 0 reticle, 1 diagnostics, 2 logo, 3 exit
  const [doneLines, setDoneLines] = useState(0)
  const [drift, setDrift] = useState('')
  const finished = useRef(false)

  const finish = useCallback(() => {
    if (finished.current) return
    finished.current = true
    setPhase(3)
    try {
      window.sessionStorage.setItem('tards.booted', '1')
    } catch {
      /* ignore */
    }
    setTimeout(onComplete, 420)
  }, [onComplete])

  const scale = useMemo(() => {
    if (typeof window === 'undefined') return 1
    reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    already.current = window.sessionStorage.getItem('tards.booted') === '1'
    if (reduced.current) return 0.15
    if (already.current) return 0.45
    return 1
  }, [])

  // drift ticker for background hex
  useEffect(() => {
    const id = setInterval(() => setDrift(`${hex(8)} ${hex(4)} ${hex(6)} ${hex(2)}`), 90)
    return () => clearInterval(id)
  }, [])

  // orchestrate phases
  useEffect(() => {
    const t = (ms: number) => Math.max(1, ms * scale)
    const timers: ReturnType<typeof setTimeout>[] = []
    timers.push(setTimeout(() => setPhase(1), t(450)))

    DIAGNOSTICS.forEach((_, i) => {
      timers.push(setTimeout(() => setDoneLines(i + 1), t(500 + i * 150)))
    })

    timers.push(setTimeout(() => setPhase(2), t(500 + DIAGNOSTICS.length * 150 + 250)))
    timers.push(setTimeout(finish, t(500 + DIAGNOSTICS.length * 150 + 1150)))

    return () => timers.forEach(clearTimeout)
  }, [scale, finish])

  return (
    <div
      className={`fixed inset-0 z-[200] flex items-center justify-center overflow-hidden bg-background transition-opacity duration-400 ${
        phase === 3 ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
      role="status"
      aria-label="System boot sequence"
    >
      {/* scanlines */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, oklch(0.6 0.2 25 / 0.12) 0px, oklch(0.6 0.2 25 / 0.12) 1px, transparent 1px, transparent 3px)',
        }}
        aria-hidden
      />

      {/* skip */}
      <button
        onClick={finish}
        className="absolute right-5 top-5 z-10 font-mono text-[11px] tracking-[0.25em] text-muted-foreground transition-colors hover:text-primary"
      >
        SKIP →
      </button>

      {/* PHASE 0/1 — reticle + diagnostics */}
      {phase < 2 && (
        <div className="relative flex w-full max-w-lg flex-col items-center px-6">
          {/* expanding reticle */}
          <div
            className="relative mb-8 h-28 w-28"
            style={{ animation: 'reticle-expand 0.5s cubic-bezier(0.22,1,0.36,1) both' }}
          >
            <div className="absolute inset-0 rounded-full border border-primary/40" />
            <div className="absolute inset-3 rounded-full border border-primary/60" />
            <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary status-dot" />
            <div className="absolute left-1/2 top-0 h-4 w-px -translate-x-1/2 bg-primary/70" />
            <div className="absolute bottom-0 left-1/2 h-4 w-px -translate-x-1/2 bg-primary/70" />
            <div className="absolute left-0 top-1/2 h-px w-4 -translate-y-1/2 bg-primary/70" />
            <div className="absolute right-0 top-1/2 h-px w-4 -translate-y-1/2 bg-primary/70" />
          </div>

          <div className="mb-1 font-display text-lg font-bold tracking-[0.4em] text-foreground text-glow">
            TARDS <span className="text-primary">//</span> BEAMING
          </div>
          <div className="mb-6 font-mono text-[11px] tracking-[0.35em] text-muted-foreground">
            INITIALIZING CORE
          </div>

          {/* diagnostics */}
          <div className="w-full space-y-1.5 font-mono text-[11px]">
            {DIAGNOSTICS.map((line, i) => {
              const active = i < doneLines
              return (
                <div
                  key={line}
                  className={`flex items-center gap-2 transition-opacity duration-200 ${
                    active ? 'opacity-100' : 'opacity-25'
                  }`}
                >
                  <span className="w-52 truncate text-muted-foreground">{line}</span>
                  <span className="relative h-1.5 flex-1 overflow-hidden bg-secondary">
                    <span
                      className="absolute inset-y-0 left-0 bg-primary"
                      style={{
                        width: active ? '100%' : '0%',
                        transition: `width ${Math.max(80, 220 * scale)}ms ease-out`,
                        boxShadow: '0 0 8px var(--red-bright)',
                      }}
                    />
                  </span>
                  <span className={active ? 'text-primary' : 'text-muted-foreground'}>
                    {active ? '100%' : '...'}
                  </span>
                </div>
              )
            })}
          </div>

          {/* readout */}
          <div
            className={`mt-6 grid w-full grid-cols-2 gap-x-8 gap-y-1 font-mono text-[10px] transition-opacity duration-300 sm:grid-cols-3 ${
              doneLines >= DIAGNOSTICS.length ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {READOUT.map(([k, v]) => (
              <div key={k} className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground">{k}</span>
                <span className="text-primary">{v}</span>
              </div>
            ))}
          </div>

          <div className="mt-5 h-3 font-mono text-[10px] tracking-[0.3em] text-primary/40">
            {drift}
          </div>
        </div>
      )}

      {/* PHASE 2 — logo reveal */}
      {phase >= 2 && (
        <div className="relative flex flex-col items-center animate-fade-up">
          <div className="relative h-72 w-72 sm:h-80 sm:w-80">
            <CircularHud className="h-full w-full">
              <div className="relative flex flex-col items-center">
                <TardsMark className="h-24 w-24 animate-glow-breathe text-primary" />
              </div>
            </CircularHud>
            {/* horizontal scan beam */}
            <div
              className="absolute left-0 right-0 top-1/2 h-8 -translate-y-1/2"
              style={{
                background:
                  'linear-gradient(to bottom, transparent, oklch(0.75 0.24 27 / 0.5), transparent)',
                animation: 'beam-sweep 0.9s ease-in-out',
              }}
              aria-hidden
            />
          </div>
          <div className="mt-6 font-display text-3xl font-black tracking-[0.35em] text-foreground text-glow-strong">
            TARDS
          </div>
          <div className="mt-2 font-mono text-[11px] tracking-[0.5em] text-primary status-dot">
            ACCESS GRANTED
          </div>
        </div>
      )}
    </div>
  )
}
