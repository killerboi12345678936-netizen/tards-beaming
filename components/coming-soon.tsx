"use client"

import { CircularHud } from "./circular-hud"

export function ComingSoon({
  title,
  code,
}: {
  title: string
  code: string
}) {
  return (
    <div className="relative flex min-h-[52vh] flex-col items-center justify-center overflow-hidden border border-border/60 bg-card/30 px-6 py-16 text-center">
      {/* faint HUD behind */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.14]">
        <CircularHud size={420} className="text-primary" ticks={72} />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <div className="mb-6 flex items-center gap-2 font-mono text-[11px] tracking-[0.35em] text-primary">
          <span className="h-1.5 w-1.5 rounded-full bg-primary status-dot" />
          {code}
        </div>

        <h2 className="font-display text-4xl font-black tracking-[0.15em] text-foreground text-glow sm:text-6xl">
          {title}
        </h2>

        <div className="my-6 flex items-center gap-3">
          <span className="h-px w-10 bg-border" />
          <span className="font-display text-lg font-bold tracking-[0.45em] text-primary sm:text-2xl">
            COMING SOON
          </span>
          <span className="h-px w-10 bg-border" />
        </div>

        <p className="max-w-md font-sans text-sm leading-relaxed text-muted-foreground text-pretty">
          This sector of the BEAMING network is currently under construction.
          Systems are being calibrated. Stand by for deployment.
        </p>

        {/* fake diagnostic bar */}
        <div className="mt-8 w-full max-w-xs">
          <div className="mb-1.5 flex items-center justify-between font-mono text-[10px] tracking-widest text-muted-foreground">
            <span>BUILD PROGRESS</span>
            <span className="text-primary">PENDING</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden border border-border/70 bg-input">
            <div className="h-full w-[38%] bg-primary/70 anim-progress-indeterminate" />
          </div>
        </div>
      </div>
    </div>
  )
}
