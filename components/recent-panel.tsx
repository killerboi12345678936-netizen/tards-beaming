"use client"

import { useStore } from "@/lib/store"
import { NodeIcon } from "@/lib/icon"
import type { ResourceNode } from "@/lib/types"

export function RecentPanel({ onAccess }: { onAccess: (node: ResourceNode) => void }) {
  const { nodes, recent } = useStore()
  const items = recent.map((r) => nodes.find((n) => n.id === r.id)).filter(Boolean) as ResourceNode[]

  if (!items.length) {
    return (
      <div className="brackets border border-border/60 bg-card/40 p-6 text-center">
        <p className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground">NO RECENT ACTIVITY LOGGED</p>
      </div>
    )
  }

  return (
    <div className="border border-border/60 bg-card/40">
      <div className="flex items-center justify-between border-b border-border/50 px-4 py-2">
        <span className="font-mono text-[10px] tracking-[0.25em] text-primary">RECENTLY ACCESSED</span>
        <span className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground">{items.length} ENTRIES</span>
      </div>
      <ul>
        {items.map((node, i) => (
          <li key={node.id}>
            <button
              onClick={() => onAccess(node)}
              className="group flex w-full items-center gap-3 border-b border-border/30 px-4 py-2.5 text-left transition-colors last:border-0 hover:bg-primary/5"
            >
              <span className="font-mono text-[10px] tracking-wider text-muted-foreground">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="flex h-7 w-7 items-center justify-center border border-border text-muted-foreground transition-colors group-hover:border-primary/50 group-hover:text-primary">
                <NodeIcon name={node.icon} className="h-3.5 w-3.5" />
              </span>
              <span className="flex-1 truncate font-sans text-sm text-foreground">{node.title}</span>
              <span className="font-mono text-[10px] tracking-wider text-primary opacity-0 transition-opacity group-hover:opacity-100">
                ↗
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
