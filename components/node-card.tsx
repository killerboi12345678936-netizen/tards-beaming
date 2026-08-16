'use client'

import { useState } from 'react'
import {
  ArrowUpRight,
  Star,
  Pencil,
  Copy,
  Trash2,
  Sparkle,
  ChevronUp,
  ChevronDown,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Icon } from '@/lib/icon'
import type { TardsNode } from '@/lib/types'

const STATUS_STYLE: Record<string, string> = {
  ONLINE: 'text-primary',
  SECURE: 'text-primary',
  OFFLINE: 'text-muted-foreground',
  BETA: 'text-red-bright',
  CLASSIFIED: 'text-red-bright',
}

export function NodeCard({
  node,
  index,
  categoryLabel,
  isFavorite,
  editMode,
  onAccess,
  onToggleFavorite,
  onEdit,
  onDuplicate,
  onDelete,
  onToggleFeatured,
  onReorder,
}: {
  node: TardsNode
  index: number
  categoryLabel: string
  isFavorite: boolean
  editMode: boolean
  onAccess: (node: TardsNode) => void
  onToggleFavorite: (id: string) => void
  onEdit: (node: TardsNode) => void
  onDuplicate: (id: string) => void
  onDelete: (id: string) => void
  onToggleFeatured: (id: string) => void
  onReorder: (id: string, dir: 'up' | 'down') => void
}) {
  const [hover, setHover] = useState(false)
  const nodeId = `NODE_${(index + 1).toString().padStart(2, '0')}`

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={cn(
        'group brackets relative flex h-full min-h-[168px] cursor-pointer flex-col overflow-hidden border bg-card/70 p-4 backdrop-blur-sm transition-all duration-300',
        hover
          ? 'z-10 -translate-y-1 border-primary/80 box-glow'
          : 'border-border hover:border-border',
      )}
      onClick={() => !editMode && onAccess(node)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && !editMode) {
          e.preventDefault()
          onAccess(node)
        }
      }}
      data-cursor="ring"
    >
      {/* hover scanline */}
      {hover && <div className="card-scanline" aria-hidden />}

      {/* ambient glow */}
      <div
        className={cn(
          'pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300',
          hover && 'opacity-100',
        )}
        style={{
          background:
            'radial-gradient(120% 100% at 50% 0%, oklch(0.5 0.22 25 / 0.14), transparent 70%)',
        }}
        aria-hidden
      />

      {/* header */}
      <div className="relative mb-3 flex items-center justify-between font-mono text-[10px]">
        <div className="flex items-center gap-1.5">
          <span
            className={cn('h-1.5 w-1.5 rounded-full bg-primary', hover && 'status-dot')}
            style={{ boxShadow: hover ? '0 0 6px var(--red-bright)' : undefined }}
          />
          <span className={cn('tracking-widest text-muted-foreground', hover && 'animate-flicker')}>
            {nodeId}
          </span>
        </div>
        <span className={cn('tracking-widest', STATUS_STYLE[node.status] ?? 'text-primary')}>
          {node.status}
        </span>
      </div>

      {/* icon + fav */}
      <div className="relative mb-2 flex items-start justify-between">
        <div
          className={cn(
            'flex h-10 w-10 items-center justify-center border border-border bg-secondary/50 text-primary transition-colors',
            hover && 'border-primary/70',
          )}
        >
          <Icon name={node.icon} size={18} />
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onToggleFavorite(node.id)
          }}
          className={cn(
            'p-1 transition-colors',
            isFavorite ? 'text-primary' : 'text-muted-foreground/60 hover:text-primary',
          )}
          aria-label={isFavorite ? 'Unfavorite' : 'Favorite'}
          aria-pressed={isFavorite}
        >
          <Star size={15} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* title + desc */}
      <h3 className="relative font-display text-base font-bold uppercase tracking-wide text-foreground">
        {node.title}
      </h3>
      <p className="relative mt-1 line-clamp-2 flex-1 font-sans text-[13px] leading-relaxed text-muted-foreground">
        {node.description}
      </p>

      {/* footer */}
      <div className="relative mt-3 flex items-center justify-between border-t border-border pt-2 font-mono text-[10px]">
        <span className="tracking-widest text-primary/80">
          {categoryLabel.toUpperCase()}
          {node.badge ? ` / ${node.badge}` : ''}
        </span>
        <ArrowUpRight
          size={15}
          className={cn(
            'transition-all duration-300',
            hover ? 'translate-x-0.5 -translate-y-0.5 text-primary' : 'text-muted-foreground',
          )}
        />
      </div>

      {/* perimeter pulse on hover */}
      {hover && (
        <span
          className="pointer-events-none absolute inset-0 border border-primary/40"
          style={{ animation: 'hud-pulse 1.2s ease-in-out infinite' }}
          aria-hidden
        />
      )}

      {/* EDIT MODE overlay */}
      {editMode && (
        <div className="absolute inset-0 z-20 flex flex-col justify-between bg-background/92 p-3 backdrop-blur-sm">
          <div className="flex items-center justify-between font-mono text-[10px] text-primary">
            <span className="tracking-widest">{nodeId} // EDIT</span>
            <div className="flex gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onReorder(node.id, 'up')
                }}
                className="border border-border p-1 text-muted-foreground hover:border-primary hover:text-primary"
                aria-label="Move up"
              >
                <ChevronUp size={13} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onReorder(node.id, 'down')
                }}
                className="border border-border p-1 text-muted-foreground hover:border-primary hover:text-primary"
                aria-label="Move down"
              >
                <ChevronDown size={13} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <EditBtn label="EDIT" icon={<Pencil size={13} />} onClick={() => onEdit(node)} />
            <EditBtn
              label={node.featured ? 'UNFEATURE' : 'FEATURE'}
              icon={<Sparkle size={13} />}
              active={node.featured}
              onClick={() => onToggleFeatured(node.id)}
            />
            <EditBtn
              label="CLONE"
              icon={<Copy size={13} />}
              onClick={() => onDuplicate(node.id)}
            />
            <EditBtn
              label="DELETE"
              icon={<Trash2 size={13} />}
              danger
              onClick={() => onDelete(node.id)}
            />
          </div>
        </div>
      )}
    </div>
  )
}

function EditBtn({
  label,
  icon,
  onClick,
  danger,
  active,
}: {
  label: string
  icon: React.ReactNode
  onClick: () => void
  danger?: boolean
  active?: boolean
}) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      className={cn(
        'flex items-center justify-center gap-1.5 border py-2 font-mono text-[10px] tracking-widest transition-colors',
        danger
          ? 'border-border text-muted-foreground hover:border-destructive hover:bg-destructive/15 hover:text-destructive'
          : active
            ? 'border-primary bg-primary/15 text-primary'
            : 'border-border text-muted-foreground hover:border-primary hover:text-primary',
      )}
    >
      {icon}
      {label}
    </button>
  )
}
