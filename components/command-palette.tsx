"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useStore } from "@/lib/store"
import { CircularHud } from "@/components/circular-hud"
import { NodeIcon } from "@/lib/icon"
import { playSound } from "@/lib/sound"
import type { ResourceNode } from "@/lib/types"

export function CommandPalette({
  open,
  onClose,
  onAccess,
}: {
  open: boolean
  onClose: () => void
  onAccess: (node: ResourceNode) => void
}) {
  const { nodes, categories } = useStore()
  const [query, setQuery] = useState("")
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return nodes.slice(0, 8)
    return nodes.filter((n) => {
      const cat = categories.find((c) => c.id === n.category)?.label ?? n.category
      return (
        n.title.toLowerCase().includes(q) ||
        n.description.toLowerCase().includes(q) ||
        cat.toLowerCase().includes(q) ||
        n.url.toLowerCase().includes(q)
      )
    })
  }, [query, nodes, categories])

  useEffect(() => {
    if (open) {
      setQuery("")
      setActive(0)
      const t = setTimeout(() => inputRef.current?.focus(), 50)
      return () => clearTimeout(t)
    }
  }, [open])

  useEffect(() => {
    setActive(0)
  }, [query])

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault()
        onClose()
      } else if (e.key === "ArrowDown") {
        e.preventDefault()
        setActive((a) => Math.min(a + 1, results.length - 1))
        playSound("click")
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setActive((a) => Math.max(a - 1, 0))
        playSound("click")
      } else if (e.key === "Enter") {
        e.preventDefault()
        const node = results[active]
        if (node) {
          onAccess(node)
          onClose()
        }
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, results, active, onAccess, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[120] flex items-start justify-center px-4 pt-[12vh]"
      role="dialog"
      aria-modal="true"
      aria-label="Command interface"
    >
      <button
        className="absolute inset-0 cursor-default bg-background/80 backdrop-blur-sm"
        aria-label="Close command interface"
        onClick={onClose}
      />
      <div className="anim-modal-in relative w-full max-w-2xl overflow-hidden border border-primary/40 bg-card/95 shadow-glow-lg">
        <div className="pointer-events-none absolute -right-24 -top-24 opacity-20">
          <CircularHud size={220} />
        </div>
        <div className="scanlines pointer-events-none absolute inset-0 opacity-40" />

        <div className="relative flex items-center justify-between border-b border-border/60 px-4 py-2.5">
          <span className="font-mono text-[10px] tracking-[0.25em] text-primary">TARDS COMMAND INTERFACE</span>
          <span className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground">ESC / EXIT</span>
        </div>

        <div className="relative flex items-center gap-3 border-b border-border/60 px-4 py-3">
          <span className="animate-pulse font-mono text-lg text-primary">{">"}</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="SEARCH NODE NETWORK..."
            className="w-full bg-transparent font-mono text-sm uppercase tracking-wider text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
            aria-label="Search node network"
          />
        </div>

        <div className="relative max-h-[46vh] overflow-y-auto p-2">
          {results.length === 0 ? (
            <p className="px-3 py-8 text-center font-mono text-xs tracking-widest text-muted-foreground">
              NO NODES MATCH QUERY
            </p>
          ) : (
            results.map((node, i) => {
              const cat = categories.find((c) => c.id === node.category)
              return (
                <button
                  key={node.id}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => {
                    onAccess(node)
                    onClose()
                  }}
                  className={`anim-result flex w-full items-center gap-3 border px-3 py-2.5 text-left transition-colors ${
                    i === active
                      ? "border-primary/50 bg-primary/10"
                      : "border-transparent hover:border-border/60"
                  }`}
                  style={{ animationDelay: `${Math.min(i * 30, 240)}ms` }}
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center border ${
                      i === active ? "border-primary/60 text-primary" : "border-border text-muted-foreground"
                    }`}
                  >
                    <NodeIcon name={node.icon} className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-sans text-sm font-semibold uppercase tracking-wide text-foreground">
                      {node.title}
                    </span>
                    <span className="block truncate font-mono text-[10px] tracking-wider text-muted-foreground">
                      {node.description}
                    </span>
                  </span>
                  <span className="shrink-0 font-mono text-[9px] tracking-[0.2em] text-primary/80">
                    {cat?.label ?? node.category}
                  </span>
                </button>
              )
            })
          )}
        </div>

        <div className="relative flex items-center justify-between border-t border-border/60 px-4 py-2 font-mono text-[10px] tracking-[0.2em] text-muted-foreground">
          <span>↑ ↓ NAVIGATE</span>
          <span>ENTER ACCESS</span>
          <span>{results.length} NODES</span>
        </div>
      </div>
    </div>
  )
}
