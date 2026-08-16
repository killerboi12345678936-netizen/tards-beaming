'use client'

import { cn } from '@/lib/utils'
import { Icon } from '@/lib/icon'
import type { TardsCategory } from '@/lib/types'

export function CategoryBar({
  categories,
  counts,
  totalCount,
  active,
  onSelect,
}: {
  categories: TardsCategory[]
  counts: Record<string, number>
  totalCount: number
  active: string
  onSelect: (v: string) => void
}) {
  const chips = [{ id: 'all', label: 'ALL', icon: 'Boxes', count: totalCount }].concat(
    categories.map((c) => ({
      id: c.id,
      label: c.label.toUpperCase(),
      icon: c.icon,
      count: counts[c.id] ?? 0,
    })),
  )

  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {chips.map((c) => {
        const isActive = active === c.id || (active === 'dashboard' && c.id === 'all')
        return (
          <button
            key={c.id}
            onClick={() => onSelect(c.id)}
            className={cn(
              'group flex shrink-0 items-center gap-2 border px-3 py-1.5 font-mono text-[11px] tracking-widest transition-all',
              isActive
                ? 'border-primary bg-primary/15 text-primary'
                : 'border-border text-muted-foreground hover:border-primary/50 hover:text-foreground',
            )}
          >
            <Icon name={c.icon} size={13} />
            {c.label}
            <span className={cn('text-[10px]', isActive ? 'text-primary' : 'text-muted-foreground/60')}>
              {c.count.toString().padStart(2, '0')}
            </span>
          </button>
        )
      })}
    </div>
  )
}
