"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useTards } from "@/lib/store"
import { sfx } from "@/lib/sound"

import { BootSequence } from "./boot-sequence"
import { HudBackground } from "./hud-background"
import { CustomCursor } from "./custom-cursor"
import { Sidebar } from "./sidebar"
import { TopBar } from "./top-bar"
import { HeroHud } from "./hero-hud"
import { DashboardView } from "./dashboard-view"
import { ToolsView } from "./tools-view"
import { ComingSoon } from "./coming-soon"
import { CommandPalette } from "./command-palette"
import { Terminal } from "./terminal"
import { SettingsPanel } from "./settings-panel"
import { DeepMode } from "./deep-mode"
import { ConnectOverlay } from "./connect-overlay"
import { MobileBottomBar, MobileDrawer } from "./mobile-nav"
import type { TardsNode } from "@/lib/types"

export function TardsApp() {
  const { ready, categories, settings, setSetting } = useTards()

  const [booted, setBooted] = useState(false)
  const [view, setView] = useState("dashboard") // dashboard | tools | tutorials | methods
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [terminalOpen, setTerminalOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [connecting, setConnecting] = useState<TardsNode | null>(null)
  const [deepMode, setDeepMode] = useState(false)
  const [logoClicks, setLogoClicks] = useState(0)
  const [sudoBuffer, setSudoBuffer] = useState("")

  const soundOn = settings.sound
  const beep = useCallback((name: keyof typeof sfx) => soundOn && sfx[name](), [soundOn])

  /* effects toggle on <html> */
  useEffect(() => {
    const el = document.documentElement
    if (settings.effects) el.classList.remove("reduce-motion-safe")
    else el.classList.add("reduce-motion-safe")
  }, [settings.effects])

  /* open an external URL with a brief connection transition */
  const openUrl = useCallback(
    (url: string, title = "EXTERNAL NODE") => {
      beep("access")
      setConnecting({ url, title } as TardsNode)
      setTimeout(() => {
        window.open(url, "_blank", "noopener,noreferrer")
        setConnecting(null)
      }, 620)
    },
    [beep],
  )

  /* keyboard: CTRL+K, ` terminal, sudo tards */
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setPaletteOpen((p) => !p)
        beep("click")
        return
      }
      if (e.key === "`" && !isTyping(e)) {
        e.preventDefault()
        setTerminalOpen((t) => !t)
        beep("click")
        return
      }
      if (!isTyping(e) && e.key.length === 1) {
        setSudoBuffer((buf) => {
          const next = (buf + e.key.toLowerCase()).slice(-10)
          if (next.includes("sudo tards")) {
            setDeepMode(true)
            beep("boot")
            return ""
          }
          return next
        })
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [beep])

  /* logo 7-click easter egg */
  const onLogoClick = useCallback(() => {
    beep("click")
    setLogoClicks((c) => {
      const next = c + 1
      if (next >= 7) {
        setDeepMode(true)
        beep("boot")
        return 0
      }
      return next
    })
  }, [beep])

  const sectionTitle = useMemo(() => {
    switch (view) {
      case "dashboard":
        return "RESOURCE NETWORK"
      case "tools":
        return "TOOLS"
      case "tutorials":
        return "TUTORIALS"
      case "methods":
        return "METHODS"
      default:
        return view.toUpperCase()
    }
  }, [view])

  if (!booted) {
    return <BootSequence onComplete={() => setBooted(true)} />
  }

  return (
    <div className="relative min-h-svh">
      {settings.effects && <HudBackground />}
      {settings.cursor && <CustomCursor />}

      <div className="relative z-10 flex min-h-svh">
        {/* desktop sidebar */}
        <div className="hidden lg:block">
          <Sidebar
            active={view}
            onSelect={setView}
            categories={categories}
            soundOn={soundOn}
            onToggleSound={() => setSetting("sound", !soundOn)}
            onOpenTerminal={() => setTerminalOpen(true)}
            onOpenSettings={() => setSettingsOpen(true)}
          />
        </div>

        {/* main column */}
        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar
            nodeCount={24}
            onOpenSearch={() => setPaletteOpen(true)}
            onOpenMobileNav={() => setDrawerOpen(true)}
          />

          <main className="flex-1 pb-24 lg:pb-8">
            {view === "dashboard" && (
              <HeroHud nodeCount={24} catCount={categories.length} />
            )}

            <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6">
              {view === "dashboard" && (
                <button onClick={onLogoClick} aria-label="TARDS emblem" className="sr-only">
                  TARDS
                </button>
              )}

              {/* section header */}
              <div className="mb-5 flex items-end justify-between border-b border-border/60 pb-2">
                <h2 className="font-display text-lg font-bold tracking-[0.2em] text-foreground sm:text-xl">
                  {sectionTitle}
                </h2>
                <span className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground">
                  TARDS // BEAMING
                </span>
              </div>

              {/* view content */}
              {view === "dashboard" && <DashboardView onAccess={openUrl} />}
              {view === "tools" && <ToolsView />}
              {view === "tutorials" && <ComingSoon title="TUTORIALS" code="SECTOR_02 // GUIDES" />}
              {view === "methods" && <ComingSoon title="METHODS" code="SECTOR_03 // PROTOCOLS" />}
            </div>
          </main>
        </div>
      </div>

      {/* mobile chrome */}
      <MobileBottomBar active={view} onSelect={setView} onOpenSearch={() => setPaletteOpen(true)} />
      <MobileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        active={view}
        onSelect={setView}
        categories={categories}
        onOpenTerminal={() => setTerminalOpen(true)}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      {/* overlays */}
      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onAccess={(n) => openUrl(n.url)}
      />
      <Terminal open={terminalOpen} onClose={() => setTerminalOpen(false)} onDeepMode={() => setDeepMode(true)} />
      <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <ConnectOverlay node={connecting} />
      <DeepMode active={deepMode} onDone={() => setDeepMode(false)} />

      {!ready && null}
    </div>
  )
}

function isTyping(e: KeyboardEvent) {
  const t = e.target as HTMLElement | null
  if (!t) return false
  const tag = t.tagName
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || t.isContentEditable
}
