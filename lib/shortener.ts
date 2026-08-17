export interface ShortLink {
  code: string
  url: string
  createdAt: number
  hits: number
}

const KEY = "tards.shortlinks.v1"
const ALPHABET = "abcdefghijkmnpqrstuvwxyz23456789"

export function readLinks(): ShortLink[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as ShortLink[]) : []
  } catch {
    return []
  }
}

function writeLinks(links: ShortLink[]) {
  localStorage.setItem(KEY, JSON.stringify(links))
}

function genCode(len = 6): string {
  let out = ""
  for (let i = 0; i < len; i++) {
    out += ALPHABET[Math.floor(Math.random() * ALPHABET.length)]
  }
  return out
}

export function normalizeUrl(input: string): string | null {
  const trimmed = input.trim()
  if (!trimmed) return null
  const withProto = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
  try {
    const u = new URL(withProto)
    if (!u.hostname.includes(".")) return null
    return u.toString()
  } catch {
    return null
  }
}

export function createShortLink(rawUrl: string, custom?: string): ShortLink {
  const url = normalizeUrl(rawUrl)
  if (!url) throw new Error("INVALID TARGET URL")

  const links = readLinks()

  let code = (custom ?? "").trim().toLowerCase().replace(/[^a-z0-9-]/g, "")
  if (code) {
    if (links.some((l) => l.code === code)) throw new Error("CODE ALREADY IN USE")
  } else {
    do {
      code = genCode()
    } while (links.some((l) => l.code === code))
  }

  const link: ShortLink = { code, url, createdAt: Date.now(), hits: 0 }
  writeLinks([link, ...links])
  return link
}

export function deleteShortLink(code: string) {
  writeLinks(readLinks().filter((l) => l.code !== code))
}

export function resolveShortLink(code: string): ShortLink | null {
  const links = readLinks()
  const link = links.find((l) => l.code === code)
  if (!link) return null
  link.hits += 1
  writeLinks(links)
  return link
}

export function shortOrigin(): string {
  if (typeof window === "undefined") return ""
  return window.location.origin
}
