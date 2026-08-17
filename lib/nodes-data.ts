import type { TardsCategory, TardsNode } from './types'

/*
  ============================================================
  CENTRALIZED RESOURCE CONFIGURATION
  ------------------------------------------------------------
  TARDS // BEAMING is now a fixed-structure launcher:
    - DASHBOARD : MAIN + BACKUP website cards (see dashboard-view.tsx)
    - TOOLS     : built-in link shortener + upcoming tools
    - TUTORIALS : coming soon
    - METHODS   : coming soon
  The generic node system below is kept intact for the command
  palette / terminal, but ships empty by default.
  ============================================================
*/

export const DEFAULT_CATEGORIES: TardsCategory[] = [
  { id: 'tools', label: 'Tools', icon: 'Wrench' },
  { id: 'tutorials', label: 'Tutorials', icon: 'BookOpen' },
  { id: 'methods', label: 'Methods', icon: 'FlaskConical' },
]

export const DEFAULT_NODES: TardsNode[] = []
