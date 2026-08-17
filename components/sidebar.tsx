'use client'

import {
  LayoutDashboard,
  TerminalSquare,
  Settings,
  Volume2,
  VolumeX,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Icon } from '@/lib/icon'
import { TardsMark } from './tards-mark'
import { AvatarHud } from './avatar-hud'
import type { TardsCategory } from '@/lib/types'

interface SidebarProps {
  active: string
  onSelect: (view: string) => void
  categories: TardsCategory[]
  soundOn: boolean
  onToggleSound: () => void
  onOpenTerminal: () => void
  onOpenSettings: () => void
}

function NavItem({
  label,
  active,
  onClick,
  icon,
}: {
  label: string
  active: boolean
  onClick: () => void
  icon: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'group relative flex w-full items-center gap-3 px-3 py-2.5 font-mono text-[13px] transition-all',
        active
          ? 'bg-primary/10 text-foreground'
          : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground',
      )}
    >
      {active && (
        <>
          <span className="absolute left-0 top-0 h-full w-0.5 bg-primary" style={{ boxShadow: '0 0 8px var(--red-bright)' }} />
          <span className="absolute right-1.5 top-1 h-1.5 w-1.5 border-r border-t border-primary" />
          <span className="absolute bottom-1 right-1.5 h-1.5 w-1.5 border-b border-r border-primary" />
        </>
      )}
      <span className={cn('shrink-0 transition-colors', active ? 'text-primary' : 'text-muted-foreground group-hover:text-primary')}>
        {icon}
      </span>
      <span className="flex-1 truncate text-left tracking-wide">{label}</span>
    </button>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 px-3 pb-1 pt-4">
      <span className="font-mono text-[10px] tracking-[0.3em] text-primary/70">{children}</span>
      <span className="h-px flex-1 bg-border" />
    </div>
  )
}

export function Sidebar(props: SidebarProps) {
  const { active, onSelect, categories, soundOn, onToggleSound, onOpenTerminal, onOpenSettings } = props

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-border bg-panel/60 backdrop-blur-sm">
      {/* brand */}
      <div className="flex items-center gap-3 border-b border-border px-4 py-4">
        <TardsMark className="h-9 w-9 shrink-0 text-primary" />
        <div className="leading-none">
          <div className="font-display text-base font-black tracking-[0.25em] text-foreground text-glow">
            TARDS
          </div>
          <div className="mt-1 font-mono text-[10px] tracking-[0.3em] text-primary">
            // BEAMING
          </div>
        </div>
      </div>

      {/* nav */}
      <nav className="flex-1 overflow-y-auto py-2">
        <SectionLabel>COMMAND</SectionLabel>
        <NavItem
          label="Dashboard"
          icon={<LayoutDashboard size={16} />}
          active={active === 'dashboard'}
          onClick={() => onSelect('dashboard')}
        />

        <SectionLabel>NETWORK</SectionLabel>
        {categories.map((c) => (
          <NavItem
            key={c.id}
            label={c.label}
            icon={<Icon name={c.icon} size={16} />}
            active={active === c.id}
            onClick={() => onSelect(c.id)}
          />
        ))}

        <SectionLabel>SYSTEM</SectionLabel>
        <NavItem
          label="Terminal"
          icon={<TerminalSquare size={16} />}
          active={false}
          onClick={onOpenTerminal}
        />
        <NavItem
          label="Settings"
          icon={<Settings size={16} />}
          active={active === 'settings'}
          onClick={onOpenSettings}
        />
      </nav>

      {/* footer controls */}
      <div className="border-t border-border p-3">
        <div className="mb-3 flex items-center gap-2">
          <button
            onClick={onToggleSound}
            className="flex flex-1 items-center justify-center gap-2 border border-border px-2 py-1.5 font-mono text-[11px] tracking-widest text-muted-foreground transition-colors hover:border-primary/60 hover:text-primary"
            aria-label={soundOn ? 'Sound on' : 'Sound off'}
            aria-pressed={soundOn}
          >
            {soundOn ? <Volume2 size={14} /> : <VolumeX size={14} />}
            {soundOn ? 'SOUND: ON' : 'SOUND: OFF'}
          </button>
        </div>
        <AvatarHud label="OPERATOR" sub="ROOT // TARDS" initials="TX" />
      </div>
    </aside>
  )
}
