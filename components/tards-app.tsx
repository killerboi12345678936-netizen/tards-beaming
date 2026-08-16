"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useTards } from "@/lib/store"
import { sfx } from "@/lib/sound"
import type { TardsNode } from "@/lib/types"

import { BootSequence } from "./boot-sequence"
import { HudBackground } from "./hud-background"
import { CustomCursor } from "./custom-cursor"
import { Sidebar } from "./sidebar"
import { TopBar } from "./top-bar"
import { HeroHud } from "./hero-hud"
import { CategoryBar } from "./category-bar"
import { NodeGrid, type NodeGridCallbacks } from "./node-grid"
import { RecentPanel } from "./recent-panel"
import { CommandPalette } from "./command-palette"
import { Terminal } from "./terminal"
import { DeployModal } from "./deploy-modal"
import { SettingsPanel } from "./settings-panel"
import { DeepMode } from "./deep-mode"
import { ConnectOverlay } from "./connect-overlay"
import { MobileBottomBar, MobileDrawer } from "./mobile-nav"

export function TardsApp() {
  const {
    ready,
    nodes,
    categories,
    favorites,
    recent,
    settings,
    addNode,
    updateNode,
    deleteNode,
    duplicateNode,
    reorderNode,
    toggleFeatured,
    toggleFavorite,
    recordAccess,
    setSetting,
  } = useTards()

  const [booted, setBooted] = useState(false)
  const [view, setView] = useState("dashboard") // dashboard | all | favorites | recent | <categoryId>
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [terminalOpen, setTerminalOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [deployOpen, setDeployOpen] = useState(false)
  const [editing, setEditing] = useState<TardsNode | null>(null)
  const [connecting, setConnecting] = useState<TardsNode | null>(null)
  const [deepMode, setDeepMode] = useState(false)
  const [logoClicks, setLogoClicks] = useState(0)
  const [sudoBuffer, setSudoBuffer] = useState("")

  const soundOn = settings.sound
  const beep = useCallback((name: keyof typeof sfx) => soundOn && sfx[name](), [soundOn])

  /* ------------- effects toggle on <html> ------------- */
  useEffect(() => {
    const el = document.documentElement
    if (settings.effects) el.classList.remove("reduce-motion-safe")
    else el.classList.add("reduce-motion-safe")
  }, [settings.effects])

  /* ------------- counts ------------- */
  const counts = useMemo(() => {
    const map: Record<string, number> = {}
    for (const n of nodes) map[n.category] = (map[n.category] ?? 0) + 1
    return map
  }, [nodes])

  const numberMap = useMemo(() => {
    const map: Record<string, number> = {}
    nodes.forEach((n, i) => (map[n.id] = i))
    return map
  }, [nodes])

  const labelMap = useMemo(() => {
    const map: Record<string, string> = {}
    for (const c of categories) map[c.id] = c.label
    return map
  }, [categories])

  /* ------------- access a node ------------- */
  const openNode = useCallback(
    (node: TardsNode) => {
      recordAccess(node.id)
      beep("access")
      setConnecting(node)
      setTimeout(() => {
        window.open(node.url, "_blank", "noopener,noreferrer")
        setConnecting(null)
      }, 620)
    },
    [recordAccess, beep],
  )

  /* ------------- keyboard: CTRL+K, ~ terminal, sudo tards ------------- */
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
      // sudo tards easter egg (typed anywhere, not in inputs)
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

  /* ------------- logo 7-click easter egg ------------- */
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

  /* ------------- deploy / edit ------------- */
  const openDeploy = useCallback(() => {
    setEditing(null)
    setDeployOpen(true)
    beep("click")
  }, [beep])

  const openEdit = useCallback(
    (node: TardsNode) => {
      setEditing(node)
      setDeployOpen(true)
      beep("click")
    },
    [beep],
  )

  const callbacks: NodeGridCallbacks = useMemo(
    () => ({
      onAccess: openNode,
      onToggleFavorite: (id) => {
        toggleFavorite(id)
        beep("click")
      },
      onEdit: openEdit,
      onDuplicate: (id) => {
        duplicateNode(id)
        beep("deploy")
      },
      onDelete: (id) => {
        if (confirm("DECOMMISSION THIS NODE?")) {
          deleteNode(id)
          beep("error")
        }
      },
      onToggleFeatured: (id) => {
        toggleFeatured(id)
        beep("click")
      },
      onReorder: (id, dir) => {
        reorderNode(id, dir)
        beep("click")
      },
    }),
    [openNode, openEdit, toggleFavorite, duplicateNode, deleteNode, toggleFeatured, reorderNode, beep],
  )

  /* ------------- which nodes to show ------------- */
  const visibleNodes = useMemo(() => {
    if (view === "favorites") return nodes.filter((n) => favorites.includes(n.id))
    if (view === "recent") {
      return recent.map((r) => nodes.find((n) => n.id === r.id)).filter(Boolean) as TardsNode[]
    }
    if (view === "all" || view === "dashboard") return nodes
    return nodes.filter((n) => n.category === view)
  }, [view, nodes, favorites, recent])

  const featuredNodes = useMemo(() => nodes.filter((n) => n.featured), [nodes])
  const newNodes = useMemo(
    () => [...nodes].sort((a, b) => b.createdAt - a.createdAt).slice(0, 3),
    [nodes],
  )

  if (!booted) {
    return (
      <>
        <BootSequence onComplete={() => setBooted(true)} />
      </>
    )
  }

  const sectionTitle =
    view === "dashboard"
      ? "RESOURCE NETWORK"
      : view === "all"
        ? "ALL NODES"
        : view === "favorites"
          ? "FAVORITE NODES"
          : view === "recent"
            ? "RECENTLY ACCESSED"
            : (labelMap[view] ?? view).toUpperCase() + " NODES"

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
            counts={counts}
            totalCount={nodes.length}
            favCount={favorites.length}
            recentCount={recent.length}
            editMode={settings.adminMode}
            onToggleEdit={() => {
              setSetting("adminMode", !settings.adminMode)
              beep("click")
            }}
            soundOn={soundOn}
            onToggleSound={() => setSetting("sound", !soundOn)}
            onOpenTerminal={() => setTerminalOpen(true)}
            onAddNode={openDeploy}
            onOpenSettings={() => setSettingsOpen(true)}
          />
        </div>

        {/* main column */}
        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar
            nodeCount={nodes.length}
            onOpenSearch={() => setPaletteOpen(true)}
            onOpenMobileNav={() => setDrawerOpen(true)}
          />

          <main className="flex-1 pb-24 lg:pb-8">
            {view === "dashboard" && (
              <HeroHud nodeCount={nodes.length} catCount={categories.length} />
            )}

            <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6">
              {/* logo click target (invisible hit area on the hero) is handled via sidebar mark;
                  provide an explicit brand button on dashboard */}
              {view === "dashboard" && (
                <button
                  onClick={onLogoClick}
                  aria-label="TARDS emblem"
                  className="sr-only"
                >
                  TARDS
                </button>
              )}

              {/* category filter */}
              <div className="mb-5">
                <CategoryBar
                  categories={categories}
                  counts={counts}
                  totalCount={nodes.length}
                  active={view}
                  onSelect={setView}
                />
              </div>

              {/* section header */}
              <div className="mb-4 flex items-end justify-between border-b border-border/60 pb-2">
                <h2 className="font-display text-lg font-bold tracking-[0.2em] text-foreground sm:text-xl">
                  {sectionTitle}
                </h2>
                <span className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground">
                  {visibleNodes.length.toString().padStart(2, "0")} / {nodes.length.toString().padStart(2, "0")}
                </span>
              </div>

              {/* main grid */}
              <NodeGrid
                nodes={visibleNodes}
                numberMap={numberMap}
                labelMap={labelMap}
                favorites={favorites}
                editMode={settings.adminMode}
                allowFeatured={view === "dashboard" || view === "all"}
                callbacks={callbacks}
              />

              {/* dashboard-only extra sections */}
              {view === "dashboard" && (
                <div className="mt-10 grid gap-6 lg:grid-cols-2">
                  <div>
                    <div className="mb-3 flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary status-dot" />
                      <span className="font-mono text-[11px] tracking-[0.25em] text-primary">
                        NEW NODES DETECTED
                      </span>
                    </div>
                    <div className="grid gap-3">
                      {newNodes.map((n) => (
                        <button
                          key={n.id}
                          onClick={() => openNode(n)}
                          className="brackets group flex items-center justify-between border border-border/60 bg-card/40 px-4 py-3 text-left transition-colors hover:border-primary/50"
                        >
                          <span>
                            <span className="block font-mono text-[10px] tracking-widest text-primary/80">
                              NODE_{numberMap[n.id] !== undefined ? (numberMap[n.id] + 1).toString().padStart(3, "0") : "000"}
                            </span>
                            <span className="font-sans text-sm text-foreground">{n.title}</span>
                          </span>
                          <span className="font-mono text-[11px] text-primary opacity-0 transition-opacity group-hover:opacity-100">
                            ↗
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <RecentPanel onAccess={openNode} />
                </div>
              )}

              {view === "recent" && recent.length > 0 && (
                <div className="mt-8">
                  <RecentPanel onAccess={openNode} />
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* mobile chrome */}
      <MobileBottomBar
        active={view}
        onSelect={setView}
        onOpenSearch={() => setPaletteOpen(true)}
        onAddNode={openDeploy}
      />
      <MobileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        active={view}
        onSelect={setView}
        categories={categories}
        counts={counts}
        onOpenTerminal={() => setTerminalOpen(true)}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      {/* overlays */}
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} onAccess={openNode} />
      <Terminal open={terminalOpen} onClose={() => setTerminalOpen(false)} onDeepMode={() => setDeepMode(true)} />
      <DeployModal open={deployOpen} editing={editing} onClose={() => setDeployOpen(false)} />
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
