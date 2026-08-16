'use client'

import { cn } from '@/lib/utils'

/**
 * Circular avatar frame with red outer ring, HUD ticks, scanning indicator.
 * Pass `src` to display a profile image inside; otherwise shows initials.
 */
export function AvatarHud({
  src,
  initials = 'TX',
  size = 44,
  className,
  label,
  sub,
}: {
  src?: string
  initials?: string
  size?: number
  className?: string
  label?: string
  sub?: string
}) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <div className="absolute inset-0 animate-spin-slower rounded-full border border-primary/60" />
        <div className="absolute inset-[3px] rounded-full border border-primary/30" />
        {/* scanning indicator */}
        <div className="absolute inset-0 animate-spin-slow">
          <span
            className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-primary"
            style={{ boxShadow: '0 0 6px var(--red-bright)' }}
          />
        </div>
        <div className="absolute inset-[6px] overflow-hidden rounded-full bg-background">
          {src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} alt="Profile" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-secondary font-display text-xs font-bold text-primary">
              {initials}
            </div>
          )}
        </div>
      </div>
      {label && (
        <div className="min-w-0">
          <div className="truncate font-mono text-xs font-semibold text-foreground">{label}</div>
          {sub && (
            <div className="truncate font-mono text-[10px] tracking-wider text-muted-foreground">
              {sub}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
