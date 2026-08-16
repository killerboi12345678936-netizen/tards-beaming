'use client'

import { useState } from 'react'
import { ArrowRight, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Icon } from '@/lib/icon'
import { CircularHud } from './circular-hud'
import type { TardsNode } from '@/lib/types'

export function FeaturedNode({
  node,
  index,
  categoryLabel,
  isFavorite,
  onAccess,
  onToggleFavorite,
}: {
  node: TardsNode
  index: number
  categoryLabel: string
  isFavorite: boolean
  onAccess: (node: TardsNode) => void
  onToggleFavorite: (id: string) => void
}) {
  const [hover, setHover] = useState(false)
  const nodeId = `NODE_${(index + 1).toString().padStart(2, '0')}`

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => onAccess(node)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onAccess(node)
        }
      }}
      data-cursor="ring"
      className={cn(
        'brackets group relative flex h-full min-h-[240px] cursor-pointer flex-col justify-between overflow-hidden border bg-card/80 p-6 backdrop-blur-sm transition-all duration-300 lg:min-h-[300px]',
        hover ? 'border-primary box-glow' : 'border-primary/40',
      )}
    >
      {hover && <div className="card-scanline" aria-hidden />}

      {/* HUD backdrop */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 opacity-40 sm:h-80 sm:w-80">
        <CircularHud className="h-full w-full" reticle={false} />
      </div>
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(90% 90% at 100% 0%, oklch(0.4 0.2 25 / 0.25), transparent 60%)',
        }}
        aria-hidden
      />

      {/* image bleed if provided */}
      {node.image && (
        <div className="pointer-events-none absolute inset-0 opacity-20">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={node.image} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/70 to-transparent" />
        </div>
      )}

      {/* header */}
      <div className="relative flex items-center justify-between font-mono text-[11px]">
        <div className="flex items-center gap-2 tracking-widest text-primary">
          <span
            className="h-2 w-2 rounded-full bg-primary status-dot"
            style={{ boxShadow: '0 0 8px var(--red-bright)' }}
          />
          FEATURED NODE // {nodeId}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onToggleFavorite(node.id)
          }}
          className={cn('p-1', isFavorite ? 'text-primary' : 'text-muted-foreground/60 hover:text-primary')}
          aria-label={isFavorite ? 'Unfavorite' : 'Favorite'}
        >
          <Star size={16} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* body */}
      <div className="relative">
        <div
          className={cn(
            'mb-4 flex h-14 w-14 items-center justify-center border text-primary transition-colors',
            hover ? 'border-primary bg-primary/10' : 'border-primary/40 bg-secondary/50',
          )}
        >
          <Icon name={node.icon} size={26} />
        </div>
        <h2 className="font-display text-3xl font-black uppercase tracking-wide text-foreground text-glow sm:text-4xl">
          {node.title}
        </h2>
        <p className="mt-2 max-w-md font-sans text-sm leading-relaxed text-muted-foreground">
          {node.description}
        </p>
      </div>

      {/* footer */}
      <div className="relative mt-4 flex items-center justify-between border-t border-border pt-4">
        <span className="font-mono text-[11px] tracking-widest text-primary/80">
          {categoryLabel.toUpperCase()}
          {node.badge ? ` / ${node.badge}` : ''}
        </span>
        <span
          className={cn(
            'flex items-center gap-2 border px-4 py-2 font-mono text-[11px] tracking-widest transition-all',
            hover
              ? 'border-primary bg-primary/15 text-primary'
              : 'border-border text-muted-foreground',
          )}
        >
          ACCESS NODE
          <ArrowRight size={15} className={cn('transition-transform', hover && 'translate-x-1')} />
        </span>
      </div>
    </div>
  )
}
