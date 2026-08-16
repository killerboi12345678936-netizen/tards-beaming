'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import type { AccessRecord, TardsCategory, TardsNode } from './types'
import { DEFAULT_CATEGORIES, DEFAULT_NODES } from './nodes-data'

const KEYS = {
  nodes: 'tards.nodes.v1',
  categories: 'tards.categories.v1',
  favorites: 'tards.favorites.v1',
  recent: 'tards.recent.v1',
  sound: 'tards.sound.v1',
  booted: 'tards.booted.v1',
}

type NewNode = Omit<TardsNode, 'id' | 'createdAt' | 'order'>

interface StoreValue {
  ready: boolean
  nodes: TardsNode[]
  categories: TardsCategory[]
  favorites: string[]
  recent: AccessRecord[]
  soundOn: boolean
  addNode: (data: NewNode) => TardsNode
  updateNode: (id: string, data: Partial<TardsNode>) => void
  deleteNode: (id: string) => void
  duplicateNode: (id: string) => void
  reorderNode: (id: string, direction: 'up' | 'down') => void
  toggleFeatured: (id: string) => void
  toggleFavorite: (id: string) => void
  recordAccess: (id: string) => void
  addCategory: (label: string, icon?: string) => TardsCategory
  setSoundOn: (on: boolean) => void
  resetNetwork: () => void
}

const StoreContext = createContext<StoreValue | null>(null)

function read<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function slug(label: string) {
  return label
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function TardsStoreProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false)
  const [nodes, setNodes] = useState<TardsNode[]>(DEFAULT_NODES)
  const [categories, setCategories] = useState<TardsCategory[]>(DEFAULT_CATEGORIES)
  const [favorites, setFavorites] = useState<string[]>([])
  const [recent, setRecent] = useState<AccessRecord[]>([])
  const [soundOn, setSoundOnState] = useState(false)

  // hydrate from localStorage after mount
  useEffect(() => {
    setNodes(read(KEYS.nodes, DEFAULT_NODES))
    setCategories(read(KEYS.categories, DEFAULT_CATEGORIES))
    setFavorites(read(KEYS.favorites, []))
    setRecent(read(KEYS.recent, []))
    setSoundOnState(read(KEYS.sound, false))
    setReady(true)
  }, [])

  // persistence helpers
  const persist = useRef((key: string, value: unknown) => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      /* storage unavailable */
    }
  }).current

  useEffect(() => {
    if (ready) persist(KEYS.nodes, nodes)
  }, [nodes, ready, persist])
  useEffect(() => {
    if (ready) persist(KEYS.categories, categories)
  }, [categories, ready, persist])
  useEffect(() => {
    if (ready) persist(KEYS.favorites, favorites)
  }, [favorites, ready, persist])
  useEffect(() => {
    if (ready) persist(KEYS.recent, recent)
  }, [recent, ready, persist])

  const addNode = useCallback((data: NewNode) => {
    const node: TardsNode = {
      ...data,
      id: `node-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: Date.now(),
      order: Date.now(),
    }
    setNodes((prev) => [node, ...prev])
    return node
  }, [])

  const updateNode = useCallback((id: string, data: Partial<TardsNode>) => {
    setNodes((prev) => prev.map((it) => (it.id === id ? { ...it, ...data } : it)))
  }, [])

  const deleteNode = useCallback((id: string) => {
    setNodes((prev) => prev.filter((it) => it.id !== id))
    setFavorites((prev) => prev.filter((f) => f !== id))
    setRecent((prev) => prev.filter((r) => r.id !== id))
  }, [])

  const duplicateNode = useCallback((id: string) => {
    setNodes((prev) => {
      const src = prev.find((it) => it.id === id)
      if (!src) return prev
      const copy: TardsNode = {
        ...src,
        id: `node-${Math.random().toString(36).slice(2, 8)}`,
        title: `${src.title} COPY`,
        featured: false,
        createdAt: Date.now(),
        order: Date.now(),
      }
      const idx = prev.findIndex((it) => it.id === id)
      const next = [...prev]
      next.splice(idx + 1, 0, copy)
      return next
    })
  }, [])

  const reorderNode = useCallback((id: string, direction: 'up' | 'down') => {
    setNodes((prev) => {
      const idx = prev.findIndex((it) => it.id === id)
      if (idx < 0) return prev
      const swap = direction === 'up' ? idx - 1 : idx + 1
      if (swap < 0 || swap >= prev.length) return prev
      const next = [...prev]
      ;[next[idx], next[swap]] = [next[swap], next[idx]]
      return next
    })
  }, [])

  const toggleFeatured = useCallback((id: string) => {
    setNodes((prev) => prev.map((it) => (it.id === id ? { ...it, featured: !it.featured } : it)))
  }, [])

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [id, ...prev]))
  }, [])

  const recordAccess = useCallback((id: string) => {
    setRecent((prev) => {
      const filtered = prev.filter((r) => r.id !== id)
      return [{ id, at: Date.now() }, ...filtered].slice(0, 12)
    })
  }, [])

  const addCategory = useCallback((label: string, icon = 'Boxes') => {
    const cat: TardsCategory = { id: slug(label) || `cat-${Date.now()}`, label, icon }
    setCategories((prev) => (prev.some((c) => c.id === cat.id) ? prev : [...prev, cat]))
    return cat
  }, [])

  const setSoundOn = useCallback(
    (on: boolean) => {
      setSoundOnState(on)
      persist(KEYS.sound, on)
    },
    [persist],
  )

  const resetNetwork = useCallback(() => {
    setNodes(DEFAULT_NODES)
    setCategories(DEFAULT_CATEGORIES)
    setFavorites([])
    setRecent([])
  }, [])

  const value = useMemo<StoreValue>(
    () => ({
      ready,
      nodes,
      categories,
      favorites,
      recent,
      soundOn,
      addNode,
      updateNode,
      deleteNode,
      duplicateNode,
      reorderNode,
      toggleFeatured,
      toggleFavorite,
      recordAccess,
      addCategory,
      setSoundOn,
      resetNetwork,
    }),
    [
      ready,
      nodes,
      categories,
      favorites,
      recent,
      soundOn,
      addNode,
      updateNode,
      deleteNode,
      duplicateNode,
      reorderNode,
      toggleFeatured,
      toggleFavorite,
      recordAccess,
      addCategory,
      setSoundOn,
      resetNetwork,
    ],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useTards() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useTards must be used within TardsStoreProvider')
  return ctx
}
