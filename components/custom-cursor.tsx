'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Red HUD targeting cursor. Grows a ring over interactive elements,
 * emits a pulse on click. Disabled on touch / coarse pointers.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const [enabled, setEnabled] = useState(false)
  const [hovering, setHovering] = useState(false)

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduce) return
    setEnabled(true)
    document.documentElement.classList.add('cursor-none-desktop')

    let rx = window.innerWidth / 2
    let ry = window.innerHeight / 2
    let x = rx
    let y = ry
    let raf = 0

    const move = (e: MouseEvent) => {
      x = e.clientX
      y = e.clientY
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`
      }
      const t = e.target as HTMLElement
      setHovering(
        !!t.closest('a, button, [role="button"], input, textarea, select, [data-cursor="ring"]'),
      )
    }

    const loop = () => {
      rx += (x - rx) * 0.18
      ry += (y - ry) * 0.18
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`
      }
      raf = requestAnimationFrame(loop)
    }
    loop()

    const click = (e: MouseEvent) => {
      const ping = document.createElement('div')
      ping.className = 'pointer-events-none fixed z-[9999] h-6 w-6 rounded-full border border-primary'
      ping.style.left = `${e.clientX}px`
      ping.style.top = `${e.clientY}px`
      ping.style.animation = 'cursor-ping 0.5s ease-out forwards'
      document.body.appendChild(ping)
      setTimeout(() => ping.remove(), 520)
    }

    window.addEventListener('mousemove', move)
    window.addEventListener('mousedown', click)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mousedown', click)
      document.documentElement.classList.remove('cursor-none-desktop')
    }
  }, [])

  if (!enabled) return null

  return (
    <>
      {/* center dot */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-1 w-1 rounded-full bg-primary"
        style={{ boxShadow: '0 0 6px 1px var(--red-bright)' }}
        aria-hidden
      />
      {/* trailing reticle ring */}
      <div
        ref={ringRef}
        className={`pointer-events-none fixed left-0 top-0 z-[9998] flex items-center justify-center transition-[width,height,opacity] duration-200 ${
          hovering ? 'h-10 w-10 opacity-100' : 'h-6 w-6 opacity-70'
        }`}
        aria-hidden
      >
        <div className="absolute inset-0 rounded-full border border-primary/70" />
        <div className="absolute left-1/2 top-0 h-1.5 w-px -translate-x-1/2 bg-primary/80" />
        <div className="absolute bottom-0 left-1/2 h-1.5 w-px -translate-x-1/2 bg-primary/80" />
        <div className="absolute left-0 top-1/2 h-px w-1.5 -translate-y-1/2 bg-primary/80" />
        <div className="absolute right-0 top-1/2 h-px w-1.5 -translate-y-1/2 bg-primary/80" />
      </div>
    </>
  )
}
