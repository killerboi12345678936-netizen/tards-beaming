"use client"

import { useEffect, useState } from "react"
import { Link2, Copy, Check, Trash2, ArrowUpRight, QrCode, KeyRound, Timer, Cog } from "lucide-react"
import {
  createShortLink,
  deleteShortLink,
  readLinks,
  shortOrigin,
  type ShortLink,
} from "@/lib/shortener"

export function ToolsView() {
  const [links, setLinks] = useState<ShortLink[]>([])
  const [url, setUrl] = useState("")
  const [custom, setCustom] = useState("")
  const [error, setError] = useState("")
  const [origin, setOrigin] = useState("")
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    setLinks(readLinks())
    setOrigin(shortOrigin())
  }, [])

  function deploy() {
    setError("")
    try {
      createShortLink(url, custom || undefined)
      setLinks(readLinks())
      setUrl("")
      setCustom("")
    } catch (e) {
      setError((e as Error).message)
    }
  }

  function remove(code: string) {
    deleteShortLink(code)
    setLinks(readLinks())
  }

  async function copy(code: string) {
    const full = `${origin}/s/${code}`
    try {
      await navigator.clipboard.writeText(full)
      setCopied(code)
      setTimeout(() => setCopied(null), 1400)
    } catch {
      /* clipboard blocked */
    }
  }

  return (
    <div className="space-y-8">
      {/* ---------- LINK SHORTENER ---------- */}
      <section className="brackets border border-primary/40 bg-card/50 p-5 sm:p-6">
        <div className="mb-5 flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center border border-primary/50 bg-primary/10 text-primary">
            <Link2 size={18} />
          </span>
          <div>
            <h3 className="font-display text-lg font-bold tracking-[0.2em] text-foreground">
              LINK COMPRESSOR
            </h3>
            <p className="font-mono text-[10px] tracking-widest text-muted-foreground">
              BEAMING URL SHORTENER // ACTIVE
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
          <div className="space-y-3">
            <div>
              <label className="mb-1 block font-mono text-[10px] tracking-widest text-muted-foreground">
                TARGET URL
              </label>
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.nativeEvent.isComposing) deploy()
                }}
                placeholder="https://example.com/very/long/path"
                className="tards-input"
              />
            </div>
            <div>
              <label className="mb-1 block font-mono text-[10px] tracking-widest text-muted-foreground">
                CUSTOM CODE {"(OPTIONAL)"}
              </label>
              <div className="flex items-center">
                <span className="flex h-[38px] items-center border border-r-0 border-border bg-input px-2 font-mono text-[12px] text-muted-foreground">
                  /s/
                </span>
                <input
                  value={custom}
                  onChange={(e) => setCustom(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.nativeEvent.isComposing) deploy()
                  }}
                  placeholder="my-link"
                  className="tards-input"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-end">
            <button
              onClick={deploy}
              className="flex h-[38px] items-center justify-center gap-2 border border-primary bg-primary/15 px-5 font-mono text-[12px] font-bold tracking-widest text-primary transition-all hover:bg-primary/25 hover:shadow-glow"
            >
              COMPRESS →
            </button>
          </div>
        </div>

        {error && (
          <p className="mt-3 font-mono text-[11px] tracking-widest text-destructive">
            {"! "}
            {error}
          </p>
        )}

        {/* generated links */}
        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between border-b border-border/60 pb-1.5">
            <span className="font-mono text-[10px] tracking-[0.25em] text-primary">
              ACTIVE LINKS
            </span>
            <span className="font-mono text-[10px] tracking-widest text-muted-foreground">
              {links.length.toString().padStart(2, "0")}
            </span>
          </div>

          {links.length === 0 ? (
            <p className="py-6 text-center font-mono text-[11px] tracking-widest text-muted-foreground/70">
              NO LINKS COMPRESSED YET
            </p>
          ) : (
            <ul className="space-y-2">
              {links.map((l) => (
                <li
                  key={l.code}
                  className="group flex items-center gap-3 border border-border/60 bg-input/40 px-3 py-2.5 transition-colors hover:border-primary/50"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[13px] font-bold text-primary">
                        /s/{l.code}
                      </span>
                      <span className="font-mono text-[9px] tracking-widest text-muted-foreground">
                        {l.hits} HITS
                      </span>
                    </div>
                    <span className="block truncate font-mono text-[10px] text-muted-foreground">
                      {l.url}
                    </span>
                  </div>
                  <button
                    onClick={() => copy(l.code)}
                    aria-label="Copy short link"
                    className="flex h-8 w-8 items-center justify-center border border-border text-muted-foreground transition-colors hover:border-primary/60 hover:text-primary"
                  >
                    {copied === l.code ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                  <a
                    href={`/s/${l.code}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Open short link"
                    className="flex h-8 w-8 items-center justify-center border border-border text-muted-foreground transition-colors hover:border-primary/60 hover:text-primary"
                  >
                    <ArrowUpRight size={14} />
                  </a>
                  <button
                    onClick={() => remove(l.code)}
                    aria-label="Delete short link"
                    className="flex h-8 w-8 items-center justify-center border border-border text-muted-foreground transition-colors hover:border-destructive/60 hover:text-destructive"
                  >
                    <Trash2 size={14} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* ---------- UPCOMING TOOLS ---------- */}
      <section>
        <div className="mb-4 flex items-center gap-2 font-mono text-[11px] tracking-[0.25em] text-primary">
          <Cog size={13} />
          UPCOMING TOOLS
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {UPCOMING.map((t) => (
            <div
              key={t.name}
              className="brackets relative flex flex-col gap-3 border border-border/60 bg-card/30 p-4"
            >
              <span className="flex h-9 w-9 items-center justify-center border border-border bg-secondary/40 text-muted-foreground">
                {t.icon}
              </span>
              <div>
                <h4 className="font-display text-sm font-bold tracking-widest text-foreground/80">
                  {t.name}
                </h4>
                <p className="mt-1 font-sans text-xs leading-relaxed text-muted-foreground">
                  {t.desc}
                </p>
              </div>
              <span className="mt-auto w-fit border border-border bg-secondary/40 px-2 py-0.5 font-mono text-[9px] tracking-widest text-primary/80">
                COMING SOON
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

const UPCOMING = [
  {
    name: "QR FORGE",
    desc: "Generate branded QR codes for any node or short link instantly.",
    icon: <QrCode size={18} />,
  },
  {
    name: "PASS FORGE",
    desc: "Cryptographic password + secret key generator with entropy readout.",
    icon: <KeyRound size={18} />,
  },
  {
    name: "TEMP CHANNEL",
    desc: "Self-destructing note and link relay with countdown expiry.",
    icon: <Timer size={18} />,
  },
]
