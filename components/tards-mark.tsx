import { cn } from '@/lib/utils'

/**
 * TARDS insignia — an angular targeting emblem built from a hex frame,
 * an embedded "T" glyph, chevrons, and crosshair ticks. Uses currentColor
 * so it inherits the crimson glow. Not just text: reads as a real mark.
 */
export function TardsMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={cn('text-primary', className)}
      fill="none"
      aria-label="TARDS insignia"
      role="img"
    >
      {/* hex frame */}
      <path
        d="M50 4 L88 26 L88 74 L50 96 L12 74 L12 26 Z"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.55"
      />
      <path
        d="M50 12 L81 30 L81 70 L50 88 L19 70 L19 30 Z"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.3"
      />

      {/* chevrons */}
      <path d="M50 20 L62 27 M50 20 L38 27" stroke="currentColor" strokeWidth="2" />
      <path d="M50 80 L62 73 M50 80 L38 73" stroke="currentColor" strokeWidth="2" opacity="0.6" />

      {/* T glyph */}
      <g>
        <rect x="30" y="38" width="40" height="7" fill="currentColor" />
        <rect x="46" y="38" width="8" height="30" fill="currentColor" />
        {/* white core highlight */}
        <rect x="47.5" y="40" width="5" height="24" fill="var(--foreground)" opacity="0.85" />
      </g>

      {/* crosshair ticks */}
      <line x1="50" y1="0" x2="50" y2="8" stroke="currentColor" strokeWidth="1.5" />
      <line x1="50" y1="92" x2="50" y2="100" stroke="currentColor" strokeWidth="1.5" />
      <line x1="4" y1="50" x2="12" y2="50" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      <line
        x1="88"
        y1="50"
        x2="96"
        y2="50"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.5"
      />

      {/* corner nodes */}
      {[
        [12, 26],
        [88, 26],
        [88, 74],
        [12, 74],
      ].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="2.4" fill="currentColor" />
      ))}
    </svg>
  )
}
