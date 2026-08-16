export type NodeStatus = 'ONLINE' | 'OFFLINE' | 'SECURE' | 'BETA' | 'CLASSIFIED'

export interface TardsNode {
  id: string
  title: string
  description: string
  url: string
  category: string
  /** lucide-react icon name, e.g. "Brain", "Terminal" */
  icon: string
  /** optional local/remote image path for featured/imagery cards */
  image?: string
  badge?: string
  status: NodeStatus
  featured: boolean
  /** single-key keyboard shortcut, e.g. "G" */
  shortcut?: string
  createdAt: number
  order: number
}

export interface TardsCategory {
  id: string
  label: string
  /** lucide-react icon name */
  icon: string
}

export interface AccessRecord {
  id: string
  at: number
}

/** Aliases used across UI components. */
export type ResourceNode = TardsNode
export type Category = TardsCategory
