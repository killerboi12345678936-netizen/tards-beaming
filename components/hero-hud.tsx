'use client'

import { CircularHud } from './circular-hud'
import { TardsMark } from './tards-mark'

function Marker({
  className,
  children,
}: {
  className: string
  children: React.ReactNode
}) {
  return (
    <span
      className={`absolute font-mono text-[9px] tracking-[0.25em] text-primary/60 ${className}`}
    >
      {children}
    </span>
  )
}

export function HeroHud({ nodeCount, catCount }: { nodeCount: number; catCount: number }) {
  return (
    <section className="relative flex flex-col items-center overflow-hidden border-b border-border px-4 py-10 sm:py-14">
      {/* corner tech markings */}
      <div className="pointer-events-none absolute left-4 top-4 font-mono text-[10px] leading-tight text-muted-foreground/60">
        <div>SECTOR // 001</div>
        <div className="text-primary/60">CMD_CENTER</div>
      </div>
      <div className="pointer-events-none absolute right-4 top-4 text-right font-mono text-[10px] leading-tight text-muted-foreground/60">
        <div>LAT 00.0000</div>
        <div className="text-primary/60">LON 00.0000</div>
      </div>

      {/* emblem */}
      <div className="relative h-56 w-56 sm:h-72 sm:w-72">
        <CircularHud className="h-full w-full">
          <TardsMark className="h-20 w-20 animate-glow-breathe text-primary sm:h-24 sm:w-24" />
        </CircularHud>

        {/* orbital micro-markers */}
        <Marker className="left-1/2 top-0 -translate-x-1/2">N</Marker>
        <Marker className="bottom-0 left-1/2 -translate-x-1/2">S</Marker>
        <Marker className="left-0 top-1/2 -translate-y-1/2">W</Marker>
        <Marker className="right-0 top-1/2 -translate-y-1/2">E</Marker>
      </div>

      {/* wordmark */}
      <h1 className="mt-6 font-display text-4xl font-black tracking-[0.3em] text-foreground text-glow-strong sm:text-6xl">
        TARDS
      </h1>
      <div className="mt-3 flex items-center gap-3 font-mono text-[11px] tracking-[0.4em] text-primary sm:text-xs">
        <span className="h-px w-6 bg-primary/60" />
        BEAMING RESOURCE NETWORK
        <span className="h-px w-6 bg-primary/60" />
      </div>

      {/* status strip */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-[10px] text-muted-foreground">
        <span>
          NODES <span className="text-primary">{nodeCount.toString().padStart(3, '0')}</span>
        </span>
        <span className="hidden h-3 w-px bg-border sm:block" />
        <span>
          VECTORS <span className="text-primary">{catCount.toString().padStart(2, '0')}</span>
        </span>
        <span className="hidden h-3 w-px bg-border sm:block" />
        <span>
          STATUS <span className="text-primary status-dot">OPERATIONAL</span>
        </span>
        <span className="hidden h-3 w-px bg-border sm:block" />
        <span>
          CH <span className="text-primary">SECURE</span>
        </span>
      </div>
    </section>
  )
}
