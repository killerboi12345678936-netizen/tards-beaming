'use client'

import { CircularHud } from './circular-hud'
import type { TardsNode } from '@/lib/types'

export function ConnectOverlay({ node }: { node: TardsNode | null }) {
  if (!node) return null
  return (
    <div className="fixed inset-0 z-[120] flex flex-col items-center justify-center bg-background/85 backdrop-blur-sm animate-fade-up">
      <div className="relative h-40 w-40">
        <CircularHud className="h-full w-full">
          <span
            className="h-3 w-3 rounded-full bg-primary status-dot"
            style={{ boxShadow: '0 0 12px var(--red-bright)' }}
          />
        </CircularHud>
      </div>
      <div className="mt-6 font-mono text-xs tracking-[0.35em] text-primary">
        ESTABLISHING CONNECTION
      </div>
      <div className="mt-2 font-mono text-[11px] tracking-widest text-muted-foreground">
        → {node.title.toUpperCase()}
      </div>
      <div className="mt-4 h-1 w-48 overflow-hidden bg-secondary">
        <div
          className="h-full bg-primary"
          style={{ animation: 'card-scan 0.5s linear', width: '100%', boxShadow: '0 0 8px var(--red-bright)' }}
        />
      </div>
    </div>
  )
}
