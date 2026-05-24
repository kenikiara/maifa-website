/**
 * AuroraBackground — adapted from 21st.dev aurora-background component
 * Converted from TypeScript + Tailwind to plain JavaScript + inline styles + CSS class.
 * Blue/violet palette replaced with Maifa brand greens for a light, on-brand aurora.
 * Usage: position: absolute, inset: 0 — place inside a position: relative section.
 */

export default function AuroraBackground() {
  return (
    <div style={{
      position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0,
      background: 'var(--paper)',        /* #f7f6f2 — original site background */
      pointerEvents: 'none',
    }}>
      {/* Aurora animated layer */}
      <div
        className="aurora-layer"
        style={{
          position: 'absolute',
          inset: '-10px',               /* slightly oversized so blur edges don't show */
          opacity: 0.55,
          backgroundImage: [
            /* White "light ray" base — creates the streaked light effect */
            'repeating-linear-gradient(100deg, #fff 0%, #fff 7%, transparent 10%, transparent 12%, #fff 16%)',
            /* Aurora colour bands — Maifa green palette */
            'repeating-linear-gradient(100deg, #0f7a3d 10%, #22c55e 15%, #86efac 20%, #bbf7d0 25%, #4ade80 30%)',
          ].join(', '),
          backgroundSize: '300%, 200%',
          backgroundPosition: '50% 50%, 50% 50%',
          filter: 'blur(10px)',
          /* Radial mask — aurora fades toward bottom-left, bright at top-right */
          WebkitMaskImage: 'radial-gradient(ellipse at 100% 0%, black 10%, transparent 70%)',
          maskImage:        'radial-gradient(ellipse at 100% 0%, black 10%, transparent 70%)',
          animation: 'aurora 60s linear infinite',
          willChange: 'background-position',
        }}
      />
    </div>
  )
}
