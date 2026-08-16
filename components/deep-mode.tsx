"use client"

import { useEffect, useState } from "react"
import { CircularHud } from "@/components/circular-hud"

export function DeepMode({ active, onDone }: { active: boolean; onDone: () => void }) {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    if (!active) {
      setPhase(0)
      return
    }
    const t1 = setTimeout(() => setPhase(1), 900)
    const t2 = setTimeout(() => setPhase(2), 2600)
    const t3 = setTimeout(onDone, 3400)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [active, onDone])

  if (!active) return null

  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black">
      <div className="scanlines pointer-events-none absolute inset-0 opacity-60" />
      <div className="relative flex flex-col items-center gap-6">
        <div className="animate-glow-breathe">
          <CircularHud size={280} intense />
        </div>
        <div className="text-center font-mono">
          {phase >= 0 && (
            <p className="animate-fade-up text-sm tracking-[0.4em] text-primary">DEEP SYSTEM MODE</p>
          )}
          {phase >= 1 && (
            <p className="animate-fade-up mt-3 text-[11px] tracking-[0.3em] text-muted-foreground">
              BYPASSING SURFACE PROTOCOLS
            </p>
          )}
          {phase >= 2 && (
            <p className="animate-fade-up mt-3 text-lg tracking-[0.3em] text-glow-strong text-foreground">
              ROOT ACCESS GRANTED
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
