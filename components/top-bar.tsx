'use client'

import { useEffect, useState } from 'react'
import { Search, Menu } from 'lucide-react'

function useClock() {
  const [now, setNow] = useState<Date | null>(null)
  useEffect(() => {
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return now
}

function Stat({ label, value, dot }: { label: string; value: string; dot?: boolean }) {
  return (
    <div className="flex items-center gap-1.5">
      {dot && (
        <span
          className="h-1.5 w-1.5 rounded-full bg-primary status-dot"
          style={{ boxShadow: '0 0 6px var(--red-bright)' }}
        />
      )}
      <span className="text-muted-foreground">{label}</span>
      <span className="text-primary">{value}</span>
    </div>
  )
}

export function TopBar({
  nodeCount,
  onOpenSearch,
  onOpenMobileNav,
}: {
  nodeCount: number
  onOpenSearch: () => void
  onOpenMobileNav: () => void
}) {
  const now = useClock()
  const time = now
    ? now.toLocaleTimeString('en-GB', { hour12: false })
    : '--:--:--'

  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/80 px-4 py-3 backdrop-blur-md">
      {/* mobile menu */}
      <button
        onClick={onOpenMobileNav}
        className="flex items-center justify-center border border-border p-1.5 text-muted-foreground lg:hidden"
        aria-label="Open navigation"
      >
        <Menu size={18} />
      </button>

      <div className="hidden items-center gap-4 font-mono text-[11px] md:flex">
        <Stat label="SYSTEM:" value="ONLINE" dot />
        <span className="h-4 w-px bg-border" />
        <Stat label="NETWORK:" value="SECURE" />
        <span className="h-4 w-px bg-border" />
        <Stat label="NODES:" value={nodeCount.toString().padStart(3, '0')} />
        <span className="hidden h-4 w-px bg-border lg:block" />
        <span className="hidden lg:block">
          <Stat label="UPTIME:" value="99.98%" />
        </span>
        <span className="hidden h-4 w-px bg-border xl:block" />
        <span className="hidden xl:block">
          <Stat label="ENC:" value="AES-256" />
        </span>
      </div>

      {/* mobile compact status */}
      <div className="flex items-center gap-1.5 font-mono text-[11px] md:hidden">
        <span
          className="h-1.5 w-1.5 rounded-full bg-primary status-dot"
          style={{ boxShadow: '0 0 6px var(--red-bright)' }}
        />
        <span className="text-primary">ONLINE</span>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <button
          onClick={onOpenSearch}
          data-cursor="ring"
          className="group flex items-center gap-2 border border-border bg-secondary/40 px-3 py-1.5 font-mono text-[11px] text-muted-foreground transition-colors hover:border-primary/60 hover:text-foreground"
        >
          <Search size={13} className="group-hover:text-primary" />
          <span className="hidden sm:inline">SEARCH NODE NETWORK</span>
          <span className="hidden items-center gap-0.5 border border-border px-1 text-[10px] text-primary sm:flex">
            CTRL K
          </span>
        </button>
        <span className="hidden font-mono text-[11px] text-muted-foreground sm:block">{time}</span>
      </div>
    </header>
  )
}
