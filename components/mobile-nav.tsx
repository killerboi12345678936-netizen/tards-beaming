'use client'

import { LayoutDashboard, Wrench, BookOpen, FlaskConical, Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Icon } from '@/lib/icon'
import { TardsMark } from './tards-mark'
import type { TardsCategory } from '@/lib/types'

export function MobileBottomBar({
  active,
  onSelect,
  onOpenSearch,
}: {
  active: string
  onSelect: (v: string) => void
  onOpenSearch: () => void
}) {
  const items = [
    { id: 'dashboard', label: 'HOME', icon: <LayoutDashboard size={18} /> },
    { id: 'tools', label: 'TOOLS', icon: <Wrench size={18} /> },
    { id: '__search', label: 'SEARCH', icon: <Search size={18} /> },
    { id: 'tutorials', label: 'GUIDES', icon: <BookOpen size={18} /> },
    { id: 'methods', label: 'METHODS', icon: <FlaskConical size={18} /> },
  ]
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex items-stretch border-t border-border bg-background/95 backdrop-blur-md lg:hidden">
      {items.map((it) => {
        const isActive = active === it.id
        return (
          <button
            key={it.id}
            onClick={() => {
              if (it.id === '__search') return onOpenSearch()
              onSelect(it.id)
            }}
            className={cn(
              'relative flex flex-1 flex-col items-center gap-1 py-2.5 font-mono text-[9px] tracking-widest transition-colors',
              isActive ? 'text-primary' : 'text-muted-foreground',
            )}
          >
            {isActive && (
              <span
                className="absolute inset-x-4 top-0 h-0.5 bg-primary"
                style={{ boxShadow: '0 0 8px var(--red-bright)' }}
              />
            )}
            {it.icon}
            {it.label}
          </button>
        )
      })}
    </nav>
  )
}

export function MobileDrawer({
  open,
  onClose,
  active,
  onSelect,
  categories,
  onOpenTerminal,
  onOpenSettings,
}: {
  open: boolean
  onClose: () => void
  active: string
  onSelect: (v: string) => void
  categories: TardsCategory[]
  onOpenTerminal: () => void
  onOpenSettings: () => void
}) {
  return (
    <div
      className={cn(
        'fixed inset-0 z-50 lg:hidden',
        open ? 'pointer-events-auto' : 'pointer-events-none',
      )}
      aria-hidden={!open}
    >
      {/* backdrop */}
      <div
        className={cn(
          'absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity',
          open ? 'opacity-100' : 'opacity-0',
        )}
        onClick={onClose}
      />
      {/* panel */}
      <div
        className={cn(
          'absolute left-0 top-0 flex h-full w-72 max-w-[85vw] flex-col border-r border-border bg-panel transition-transform duration-300',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-4">
          <div className="flex items-center gap-3">
            <TardsMark className="h-8 w-8 text-primary" />
            <div className="leading-none">
              <div className="font-display text-sm font-black tracking-[0.25em] text-foreground">
                TARDS
              </div>
              <div className="mt-1 font-mono text-[10px] tracking-[0.3em] text-primary">
                // BEAMING
              </div>
            </div>
          </div>
          <button onClick={onClose} aria-label="Close navigation" className="text-muted-foreground">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-3">
          <div className="px-4 pb-1 pt-2 font-mono text-[10px] tracking-[0.3em] text-primary/70">
            COMMAND
          </div>
          <button
            onClick={() => {
              onSelect('dashboard')
              onClose()
            }}
            className={cn(
              'flex w-full items-center gap-3 px-4 py-2.5 font-mono text-[13px]',
              active === 'dashboard' ? 'bg-primary/10 text-primary' : 'text-muted-foreground',
            )}
          >
            <LayoutDashboard size={16} />
            <span className="flex-1 text-left">Dashboard</span>
          </button>

          <div className="px-4 pb-1 pt-4 font-mono text-[10px] tracking-[0.3em] text-primary/70">
            NETWORK
          </div>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                onSelect(c.id)
                onClose()
              }}
              className={cn(
                'flex w-full items-center gap-3 px-4 py-2.5 font-mono text-[13px]',
                active === c.id ? 'bg-primary/10 text-primary' : 'text-muted-foreground',
              )}
            >
              <Icon name={c.icon} size={16} />
              <span className="flex-1 text-left">{c.label}</span>
            </button>
          ))}

          <div className="px-4 pb-1 pt-4 font-mono text-[10px] tracking-[0.3em] text-primary/70">
            SYSTEM
          </div>
          <button
            onClick={() => {
              onOpenTerminal()
              onClose()
            }}
            className="flex w-full items-center gap-3 px-4 py-2.5 font-mono text-[13px] text-muted-foreground"
          >
            <span className="flex-1 text-left">Terminal</span>
          </button>
          <button
            onClick={() => {
              onOpenSettings()
              onClose()
            }}
            className="flex w-full items-center gap-3 px-4 py-2.5 font-mono text-[13px] text-muted-foreground"
          >
            <span className="flex-1 text-left">Settings</span>
          </button>
        </div>
      </div>
    </div>
  )
}
