"use client"

import { useEffect, useState } from "react"
import { useStore } from "@/lib/store"
import { CircularHud } from "@/components/circular-hud"
import { NodeIcon, ICON_NAMES } from "@/lib/icon"
import { playSound } from "@/lib/sound"
import type { NodeStatus, ResourceNode } from "@/lib/types"

const STATUSES: NodeStatus[] = ["ONLINE", "OFFLINE", "SECURE", "BETA", "CLASSIFIED"]

type Draft = Omit<ResourceNode, "id" | "createdAt" | "order">

const EMPTY: Draft = {
  title: "",
  description: "",
  url: "",
  category: "ai",
  icon: "Cpu",
  image: "",
  badge: "",
  status: "ONLINE",
  featured: false,
  shortcut: "",
}

export function DeployModal({
  open,
  editing,
  onClose,
}: {
  open: boolean
  editing: ResourceNode | null
  onClose: () => void
}) {
  const { categories, addNode, updateNode } = useStore()
  const [draft, setDraft] = useState<Draft>(EMPTY)
  const [deploying, setDeploying] = useState(false)

  useEffect(() => {
    if (open) {
      setDeploying(false)
      if (editing) {
        const { id, createdAt, order, ...rest } = editing
        setDraft(rest)
      } else {
        setDraft(EMPTY)
      }
    }
  }, [open, editing])

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onClose])

  function set<K extends keyof Draft>(key: K, val: Draft[K]) {
    setDraft((d) => ({ ...d, [key]: val }))
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!draft.title.trim() || !draft.url.trim()) {
      playSound("error")
      return
    }
    setDeploying(true)
    playSound("deploy")
    setTimeout(() => {
      if (editing) {
        updateNode(editing.id, draft)
      } else {
        addNode(draft)
      }
      onClose()
    }, 900)
  }

  if (!open) return null

  const label = editing ? "RECONFIGURE NODE" : "DEPLOY NODE"

  return (
    <div
      className="fixed inset-0 z-[120] flex items-start justify-center overflow-y-auto px-4 py-[6vh]"
      role="dialog"
      aria-modal="true"
      aria-label={label}
    >
      <button
        className="fixed inset-0 cursor-default bg-background/85 backdrop-blur-sm"
        aria-label="Close"
        onClick={onClose}
      />
      <div className="anim-modal-in relative w-full max-w-xl overflow-hidden border border-primary/40 bg-card/95 shadow-glow-lg">
        <div className="pointer-events-none absolute -right-28 -top-28 opacity-[0.15]">
          <CircularHud size={260} />
        </div>
        <div className="scanlines pointer-events-none absolute inset-0 opacity-30" />

        <div className="relative flex items-center justify-between border-b border-border/60 px-5 py-3">
          <span className="flex items-center gap-2 font-mono text-[11px] tracking-[0.25em] text-primary">
            <span className="dot-online h-2 w-2 rounded-full bg-primary" />
            {label}
          </span>
          <button
            onClick={onClose}
            className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground transition-colors hover:text-primary"
          >
            [ ABORT ]
          </button>
        </div>

        <form onSubmit={submit} className="relative grid gap-4 p-5 sm:grid-cols-2">
          <Field label="NODE NAME" full>
            <input
              value={draft.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="GEMINI"
              className="tards-input"
              autoFocus
            />
          </Field>

          <Field label="DESCRIPTION" full>
            <input
              value={draft.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="ADVANCED AI RESEARCH TERMINAL"
              className="tards-input"
            />
          </Field>

          <Field label="TARGET URL" full>
            <input
              value={draft.url}
              onChange={(e) => set("url", e.target.value)}
              placeholder="https://gemini.google.com"
              className="tards-input"
            />
          </Field>

          <Field label="CATEGORY">
            <select
              value={draft.category}
              onChange={(e) => set("category", e.target.value)}
              className="tards-input"
            >
              {categories
                .filter((c) => c.id !== "all")
                .map((c) => (
                  <option key={c.id} value={c.id} className="bg-card text-foreground">
                    {c.label}
                  </option>
                ))}
            </select>
          </Field>

          <Field label="STATUS">
            <select
              value={draft.status}
              onChange={(e) => set("status", e.target.value as NodeStatus)}
              className="tards-input"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s} className="bg-card text-foreground">
                  {s.toUpperCase()}
                </option>
              ))}
            </select>
          </Field>

          <Field label="ICON">
            <select value={draft.icon} onChange={(e) => set("icon", e.target.value)} className="tards-input">
              {ICON_NAMES.map((n) => (
                <option key={n} value={n} className="bg-card text-foreground">
                  {n.toUpperCase()}
                </option>
              ))}
            </select>
          </Field>

          <Field label="KEYBOARD SHORTCUT">
            <input
              value={draft.shortcut ?? ""}
              onChange={(e) => set("shortcut", e.target.value.toUpperCase().slice(0, 3))}
              placeholder="G"
              className="tards-input"
            />
          </Field>

          <Field label="IMAGE URL (OPTIONAL)" full>
            <input
              value={draft.image ?? ""}
              onChange={(e) => set("image", e.target.value)}
              placeholder="/featured-node.png"
              className="tards-input"
            />
          </Field>

          <Field label="BADGE (OPTIONAL)">
            <input
              value={draft.badge ?? ""}
              onChange={(e) => set("badge", e.target.value.toUpperCase())}
              placeholder="NEW"
              className="tards-input"
            />
          </Field>

          <Field label="FEATURED NODE">
            <button
              type="button"
              onClick={() => set("featured", !draft.featured)}
              className={`flex h-[38px] items-center justify-between border px-3 font-mono text-[11px] tracking-[0.2em] transition-colors ${
                draft.featured
                  ? "border-primary bg-primary/15 text-primary shadow-glow"
                  : "border-border bg-input text-muted-foreground"
              }`}
            >
              <span className="flex items-center gap-2">
                <NodeIcon name={draft.icon} className="h-3.5 w-3.5" />
                {draft.featured ? "ENABLED" : "DISABLED"}
              </span>
              <span
                className={`h-3 w-3 border ${draft.featured ? "border-primary bg-primary" : "border-muted-foreground"}`}
              />
            </button>
          </Field>

          <div className="sm:col-span-2 mt-1 flex items-center justify-between border-t border-border/50 pt-4">
            <span className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground">
              {editing ? `ID / ${editing.id}` : "ID / AUTO-ASSIGNED"}
            </span>
            <button
              type="submit"
              disabled={deploying}
              className="group relative flex items-center gap-2 border border-primary bg-primary/10 px-5 py-2.5 font-mono text-[11px] font-bold tracking-[0.25em] text-primary transition-all hover:bg-primary hover:text-primary-foreground hover:shadow-glow disabled:opacity-60"
            >
              {deploying ? "DEPLOYING..." : editing ? "COMMIT NODE →" : "DEPLOY NODE →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Field({ label, full, children }: { label: string; full?: boolean; children: React.ReactNode }) {
  return (
    <label className={`flex flex-col gap-1.5 ${full ? "sm:col-span-2" : ""}`}>
      <span className="font-mono text-[10px] tracking-[0.25em] text-muted-foreground">{label}</span>
      {children}
    </label>
  )
}
