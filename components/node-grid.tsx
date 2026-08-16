'use client'

import { NodeCard } from './node-card'
import { FeaturedNode } from './featured-node'
import type { TardsNode } from '@/lib/types'

export interface NodeGridCallbacks {
  onAccess: (node: TardsNode) => void
  onToggleFavorite: (id: string) => void
  onEdit: (node: TardsNode) => void
  onDuplicate: (id: string) => void
  onDelete: (id: string) => void
  onToggleFeatured: (id: string) => void
  onReorder: (id: string, dir: 'up' | 'down') => void
}

export function NodeGrid({
  nodes,
  numberMap,
  labelMap,
  favorites,
  editMode,
  allowFeatured = true,
  callbacks,
}: {
  nodes: TardsNode[]
  numberMap: Record<string, number>
  labelMap: Record<string, string>
  favorites: string[]
  editMode: boolean
  allowFeatured?: boolean
  callbacks: NodeGridCallbacks
}) {
  if (nodes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 border border-dashed border-border py-16 text-center">
        <span className="font-mono text-xs tracking-widest text-primary">NO NODES DETECTED</span>
        <span className="font-mono text-[11px] text-muted-foreground">
          DEPLOY A NODE TO POPULATE THIS SECTOR
        </span>
      </div>
    )
  }

  return (
    <div className="grid auto-rows-[minmax(168px,auto)] grid-flow-dense grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {nodes.map((node) => {
        const idx = numberMap[node.id] ?? 0
        const label = labelMap[node.category] ?? node.category
        const isFav = favorites.includes(node.id)
        const featured = allowFeatured && node.featured && !editMode
        return (
          <div
            key={node.id}
            className={featured ? 'animate-fade-up sm:col-span-2 sm:row-span-2' : 'animate-fade-up'}
          >
            {featured ? (
              <FeaturedNode
                node={node}
                index={idx}
                categoryLabel={label}
                isFavorite={isFav}
                onAccess={callbacks.onAccess}
                onToggleFavorite={callbacks.onToggleFavorite}
              />
            ) : (
              <NodeCard
                node={node}
                index={idx}
                categoryLabel={label}
                isFavorite={isFav}
                editMode={editMode}
                {...callbacks}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
