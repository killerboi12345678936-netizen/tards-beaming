"use client"

import { useEffect, useRef, useState } from "react"
import { useStore } from "@/lib/store"
import { playSound } from "@/lib/sound"

type Line = { type: "in" | "out" | "sys"; text: string }

const HELP = ["status", "nodes", "search <query>", "favorites", "recent", "categories", "clear", "sudo tards", "help"]

export function Terminal({
  open,
  onClose,
  onDeepMode,
}: {
  open: boolean
  onClose: () => void
  onDeepMode: () => void
}) {
  const { nodes, favorites, recent, categories } = useStore()
  const [history, setHistory] = useState<Line[]>([
    { type: "sys", text: "TARDS TERMINAL v2.6" },
    { type: "sys", text: 'TYPE "help" FOR AVAILABLE COMMANDS' },
  ])
  const [value, setValue] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50)
  }, [open])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [history, open])

  function push(lines: Line[]) {
    setHistory((h) => [...h, ...lines])
  }

  function run(raw: string) {
    const cmd = raw.trim().toLowerCase()
    push([{ type: "in", text: `> ${raw}` }])
    playSound("click")
    if (!cmd) return

    if (cmd === "clear") {
      setHistory([])
      return
    }
    if (cmd === "help") {
      push(HELP.map((h) => ({ type: "out", text: `  ${h}` })))
      return
    }
    if (cmd === "status") {
      push([
        { type: "out", text: "SYSTEM ........ ONLINE" },
        { type: "out", text: "NETWORK ....... SECURE" },
        { type: "out", text: `NODES ......... ${String(nodes.length).padStart(3, "0")}` },
        { type: "out", text: "ENCRYPTION .... ACTIVE" },
        { type: "out", text: "UPTIME ........ 99.98%" },
      ])
      return
    }
    if (cmd === "nodes") {
      push([{ type: "out", text: `${nodes.length} ACTIVE RESOURCE NODES` }])
      push(nodes.slice(0, 12).map((n, i) => ({ type: "out", text: `  ${String(i + 1).padStart(2, "0")}  ${n.title}` })))
      return
    }
    if (cmd === "favorites") {
      const favs = nodes.filter((n) => favorites.includes(n.id))
      if (!favs.length) return push([{ type: "out", text: "NO FAVORITE NODES" }])
      push(favs.map((n) => ({ type: "out", text: `  ★ ${n.title}` })))
      return
    }
    if (cmd === "recent") {
      const recs = recent.map((r) => nodes.find((n) => n.id === r.id)).filter(Boolean)
      if (!recs.length) return push([{ type: "out", text: "NO RECENT ACTIVITY" }])
      push(recs.map((n, i) => ({ type: "out", text: `  ${String(i + 1).padStart(2, "0")}  ${n!.title}` })))
      return
    }
    if (cmd === "categories") {
      push(
        categories.map((c) => {
          const count = nodes.filter((n) => n.category === c.id).length
          return { type: "out", text: `  ${c.label.padEnd(14, ".")} ${String(count).padStart(2, "0")}` }
        }),
      )
      return
    }
    if (cmd.startsWith("search")) {
      const q = cmd.replace("search", "").trim()
      if (!q) return push([{ type: "out", text: "USAGE: search <query>" }])
      const hits = nodes.filter((n) => n.title.toLowerCase().includes(q) || n.description.toLowerCase().includes(q))
      if (!hits.length) return push([{ type: "out", text: `NO MATCH FOR "${q}"` }])
      push(hits.map((n) => ({ type: "out", text: `  ◉ ${n.title} — ${n.url}` })))
      return
    }
    if (cmd === "sudo tards") {
      push([
        { type: "sys", text: "ROOT ACCESS REQUESTED..." },
        { type: "sys", text: "BYPASSING SECURITY LAYER..." },
        { type: "sys", text: "ACCESS GRANTED" },
      ])
      playSound("boot")
      setTimeout(onDeepMode, 500)
      return
    }
    push([{ type: "out", text: `UNKNOWN COMMAND: ${cmd}` }, { type: "out", text: 'TYPE "help" FOR COMMANDS' }])
    playSound("error")
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[120] flex items-end justify-center p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label="TARDS terminal"
    >
      <button
        className="absolute inset-0 cursor-default bg-background/70 backdrop-blur-sm"
        aria-label="Close terminal"
        onClick={onClose}
      />
      <div className="anim-modal-in relative flex h-[70vh] w-full max-w-2xl flex-col overflow-hidden border border-primary/40 bg-black/95 shadow-glow-lg sm:h-[60vh]">
        <div className="flex items-center justify-between border-b border-border/60 px-4 py-2">
          <span className="flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] text-primary">
            <span className="dot-online h-2 w-2 rounded-full bg-primary" />
            TARDS TERMINAL v2.6
          </span>
          <button
            onClick={onClose}
            className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground transition-colors hover:text-primary"
          >
            [ EXIT ]
          </button>
        </div>

        <div ref={scrollRef} className="scanlines flex-1 overflow-y-auto p-4 font-mono text-xs leading-relaxed">
          {history.map((line, i) => (
            <div
              key={i}
              className={
                line.type === "in"
                  ? "text-foreground"
                  : line.type === "sys"
                    ? "text-primary"
                    : "text-muted-foreground"
              }
            >
              {line.text || "\u00A0"}
            </div>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            run(value)
            setValue("")
          }}
          className="flex items-center gap-2 border-t border-border/60 px-4 py-3"
        >
          <span className="font-mono text-sm text-primary">{">"}</span>
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full bg-transparent font-mono text-xs uppercase tracking-wider text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
            placeholder="ENTER COMMAND..."
            aria-label="Terminal command input"
            autoComplete="off"
            spellCheck={false}
          />
          <span className="h-4 w-2 animate-pulse bg-primary" />
        </form>
      </div>
    </div>
  )
}
