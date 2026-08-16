"use client"

import { useStore } from "@/lib/store"
import { CircularHud } from "@/components/circular-hud"
import { playSound } from "@/lib/sound"

export function SettingsPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { settings, setSetting, resetNetwork, nodes, favorites, categories } = useStore()

  if (!open) return null

  const toggles: { key: keyof typeof settings; label: string; desc: string }[] = [
    { key: "sound", label: "AUDIO SUBSYSTEM", desc: "Boot, access & interface tones" },
    { key: "cursor", label: "TARGETING CURSOR", desc: "Custom HUD cursor (desktop)" },
    { key: "effects", label: "AMBIENT EFFECTS", desc: "Background circuitry & particles" },
    { key: "adminMode", label: "ADMIN / EDIT MODE", desc: "Deploy, edit & delete nodes" },
  ]

  return (
    <div
      className="fixed inset-0 z-[120] flex items-start justify-center overflow-y-auto px-4 py-[8vh]"
      role="dialog"
      aria-modal="true"
      aria-label="System settings"
    >
      <button
        className="fixed inset-0 cursor-default bg-background/85 backdrop-blur-sm"
        aria-label="Close settings"
        onClick={onClose}
      />
      <div className="anim-modal-in relative w-full max-w-md overflow-hidden border border-primary/40 bg-card/95 shadow-glow-lg">
        <div className="pointer-events-none absolute -right-24 -top-24 opacity-[0.15]">
          <CircularHud size={220} />
        </div>

        <div className="relative flex items-center justify-between border-b border-border/60 px-5 py-3">
          <span className="font-mono text-[11px] tracking-[0.25em] text-primary">SYSTEM SETTINGS</span>
          <button
            onClick={onClose}
            className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground transition-colors hover:text-primary"
          >
            [ CLOSE ]
          </button>
        </div>

        <div className="relative flex flex-col gap-2 p-5">
          {toggles.map((t) => (
            <button
              key={t.key}
              onClick={() => {
                setSetting(t.key, !settings[t.key])
                playSound("click")
              }}
              className="brackets flex items-center justify-between border border-border/60 bg-input/40 px-4 py-3 text-left transition-colors hover:border-primary/50"
            >
              <span>
                <span className="block font-mono text-[11px] tracking-[0.2em] text-foreground">{t.label}</span>
                <span className="block font-sans text-[11px] text-muted-foreground">{t.desc}</span>
              </span>
              <span
                className={`relative h-5 w-10 shrink-0 border transition-colors ${
                  settings[t.key] ? "border-primary bg-primary/25" : "border-border bg-input"
                }`}
              >
                <span
                  className={`absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 transition-all ${
                    settings[t.key] ? "left-[calc(100%-1rem)] bg-primary shadow-glow" : "left-0.5 bg-muted-foreground"
                  }`}
                />
              </span>
            </button>
          ))}

          <div className="mt-3 grid grid-cols-3 gap-2 border-t border-border/50 pt-4 font-mono">
            <Stat label="NODES" value={String(nodes.length).padStart(3, "0")} />
            <Stat label="FAVORITES" value={String(favorites.length).padStart(2, "0")} />
            <Stat label="CATEGORIES" value={String(categories.length - 1).padStart(2, "0")} />
          </div>

          <button
            onClick={() => {
              if (confirm("PURGE ALL LOCAL DATA AND RESTORE FACTORY NODES?")) {
                resetNetwork()
                playSound("error")
                onClose()
              }
            }}
            className="mt-3 border border-destructive/50 px-4 py-2.5 font-mono text-[10px] tracking-[0.25em] text-destructive transition-colors hover:bg-destructive/15"
          >
            ⚠ PURGE SYSTEM / RESTORE DEFAULTS
          </button>
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-border/50 bg-input/30 px-2 py-2 text-center">
      <div className="text-lg leading-none text-glow text-primary">{value}</div>
      <div className="mt-1 text-[8px] tracking-[0.2em] text-muted-foreground">{label}</div>
    </div>
  )
}
