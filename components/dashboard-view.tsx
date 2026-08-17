"use client"

import { Globe, ArrowUpRight, Lock } from "lucide-react"
import { CircularHud } from "./circular-hud"

const MAIN_URL = "https://app.beamers.si/u/tardbeamers"

export function DashboardView({ onAccess }: { onAccess: (url: string) => void }) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {/* MAIN WEBSITE */}
      <button
        onClick={() => onAccess(MAIN_URL)}
        className="brackets group relative flex min-h-[300px] flex-col justify-between overflow-hidden border border-primary/50 bg-card/70 p-6 text-left backdrop-blur-sm transition-all duration-300 hover:border-primary hover:shadow-glow-lg"
      >
        {/* HUD backdrop */}
        <div className="pointer-events-none absolute -right-16 -top-16 opacity-20 transition-opacity duration-500 group-hover:opacity-40">
          <CircularHud size={280} className="text-primary" ticks={60} />
        </div>
        {/* scanline sweep on hover */}
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="scan-beam" />
        </div>

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2 font-mono text-[11px] tracking-[0.3em] text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary status-dot" />
            NODE_01 // PRIMARY
          </div>
          <span className="border border-primary/50 bg-primary/10 px-2 py-0.5 font-mono text-[10px] tracking-widest text-primary">
            ONLINE
          </span>
        </div>

        <div className="relative z-10">
          <Globe className="mb-4 text-primary" size={30} strokeWidth={1.5} />
          <h3 className="font-display text-3xl font-black tracking-[0.12em] text-foreground text-glow sm:text-4xl">
            MAIN WEBSITE
          </h3>
          <p className="mt-2 max-w-sm font-sans text-sm leading-relaxed text-muted-foreground">
            Primary BEAMING access point. Establishes a secure channel to the
            core TARDS network node.
          </p>
        </div>

        <div className="relative z-10 flex items-center justify-between border-t border-border/60 pt-4">
          <span className="truncate font-mono text-[11px] tracking-wide text-muted-foreground/80">
            app.beamers.si/u/tardbeamers
          </span>
          <span className="flex items-center gap-1 font-mono text-[12px] font-bold tracking-widest text-primary transition-transform group-hover:translate-x-0.5">
            ACCESS <ArrowUpRight size={15} />
          </span>
        </div>
      </button>

      {/* BACKUP WEBSITE */}
      <div className="brackets relative flex min-h-[300px] flex-col justify-between overflow-hidden border border-border/60 bg-card/40 p-6 backdrop-blur-sm">
        <div className="pointer-events-none absolute -right-16 -top-16 opacity-[0.08]">
          <CircularHud size={280} className="text-muted-foreground" ticks={60} />
        </div>

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2 font-mono text-[11px] tracking-[0.3em] text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60" />
            NODE_02 // BACKUP
          </div>
          <span className="border border-border bg-secondary/40 px-2 py-0.5 font-mono text-[10px] tracking-widest text-muted-foreground">
            STANDBY
          </span>
        </div>

        <div className="relative z-10">
          <Lock className="mb-4 text-muted-foreground" size={30} strokeWidth={1.5} />
          <h3 className="font-display text-3xl font-black tracking-[0.12em] text-foreground/80 sm:text-4xl">
            BACKUP WEBSITE
          </h3>
          <p className="mt-2 max-w-sm font-sans text-sm leading-relaxed text-muted-foreground">
            Failover mirror of the primary network. Activates automatically if
            the main channel goes dark.
          </p>
        </div>

        <div className="relative z-10 flex items-center justify-between border-t border-border/60 pt-4">
          <span className="font-mono text-[11px] tracking-widest text-muted-foreground/70">
            AWAITING DEPLOYMENT
          </span>
          <span className="font-display text-[12px] font-bold tracking-[0.35em] text-primary/80">
            COMING SOON
          </span>
        </div>
      </div>
    </div>
  )
}
