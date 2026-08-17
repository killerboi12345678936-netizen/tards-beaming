"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { resolveShortLink } from "@/lib/shortener"
import { CircularHud } from "@/components/circular-hud"

export function ShortRedirect({ code }: { code: string }) {
  const [status, setStatus] = useState<"resolving" | "notfound">("resolving")

  useEffect(() => {
    const link = resolveShortLink(code)
    if (link) {
      window.location.replace(link.url)
    } else {
      const t = setTimeout(() => setStatus("notfound"), 400)
      return () => clearTimeout(t)
    }
  }, [code])

  return (
    <main className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-background px-6 text-center">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-20">
        <CircularHud size={480} className="text-primary" ticks={72} />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <div className="mb-4 font-display text-2xl font-black tracking-[0.3em] text-foreground text-glow">
          TARDS <span className="text-primary">//</span> BEAMING
        </div>

        {status === "resolving" ? (
          <>
            <p className="font-mono text-[12px] tracking-[0.3em] text-primary">
              ESTABLISHING CONNECTION
            </p>
            <p className="mt-2 font-mono text-[11px] tracking-widest text-muted-foreground">
              RESOLVING /s/{code} ...
            </p>
            <div className="mt-6 h-1 w-56 overflow-hidden border border-border/70 bg-input">
              <div className="h-full w-1/3 bg-primary anim-progress-indeterminate" />
            </div>
          </>
        ) : (
          <>
            <p className="font-mono text-[12px] tracking-[0.3em] text-destructive">
              ! LINK NOT FOUND
            </p>
            <p className="mt-2 max-w-sm font-mono text-[11px] leading-relaxed tracking-widest text-muted-foreground">
              CODE /s/{code} DOES NOT EXIST ON THIS TERMINAL. SHORT LINKS ARE
              STORED LOCALLY AND ONLY RESOLVE IN THE BROWSER THAT CREATED THEM.
            </p>
            <Link
              href="/"
              className="mt-6 border border-primary bg-primary/10 px-5 py-2 font-mono text-[12px] font-bold tracking-widest text-primary transition-colors hover:bg-primary/20"
            >
              ← RETURN TO NETWORK
            </Link>
          </>
        )}
      </div>
    </main>
  )
}
