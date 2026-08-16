'use client'

import * as Icons from 'lucide-react'
import type { LucideProps } from 'lucide-react'

/**
 * Resolve a lucide-react icon by name with a safe fallback.
 * Node/category configs store icon names as strings.
 */
export function Icon({ name, ...props }: { name: string } & LucideProps) {
  const Cmp =
    (Icons as unknown as Record<string, React.ComponentType<LucideProps>>)[name] ??
    Icons.Boxes
  return <Cmp {...props} />
}

/** Alias used by some components. */
export const NodeIcon = Icon

/** Curated list of icon names offered in the DEPLOY NODE picker. */
export const ICON_CHOICES = [
  'Sparkles',
  'BrainCircuit',
  'Bot',
  'MessageSquareCode',
  'Wand2',
  'Code2',
  'Github',
  'Terminal',
  'Codepen',
  'ShieldHalf',
  'Bug',
  'Radar',
  'Lock',
  'KeyRound',
  'BookOpen',
  'GraduationCap',
  'PenTool',
  'Triangle',
  'Figma',
  'Regex',
  'Map',
  'Route',
  'Star',
  'Newspaper',
  'Wrench',
  'FlaskConical',
  'FolderGit2',
  'Boxes',
  'Cpu',
  'Database',
  'Globe',
  'Rocket',
  'Zap',
  'Camera',
  'Film',
  'Music',
  'Palette',
]

/** Alias used by some components. */
export const ICON_NAMES = ICON_CHOICES
