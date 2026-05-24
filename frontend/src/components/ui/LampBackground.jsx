/**
 * LampBackground — adapted from 21st.dev lamp component
 * Converted from TypeScript + Tailwind to plain JavaScript + inline styles.
 * Cyan replaced with Maifa brand green (#0f7a3d / #1db954).
 * Usage: position: absolute, inset: 0 — place inside position: relative section.
 */
import { motion } from 'framer-motion'

const BG     = '#020817'   // slate-950
const GREEN  = '#0f7a3d'   // Maifa brand green
const BRIGHT = '#1db954'   // green-bright glow

const FADE = { delay: 0.3, duration: 0.8, ease: 'easeInOut' }

export default function LampBackground() {
  return (
    <div style={{
      position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0,
      background: BG, pointerEvents: 'none',
    }}>
      {/* Scale-y wrapper — creates the stretched lamp look */}
      <div style={{
        position: 'relative', width: '100%', height: '100%',
        transform: 'scaleY(1.25)',
      }}>

        {/* ── Left beam (conic from top-center, sweeps left) ── */}
        <motion.div
          initial={{ opacity: 0.5, width: '15rem' }}
          whileInView={{ opacity: 1, width: '30rem' }}
          transition={FADE}
          viewport={{ once: true }}
          style={{
            position: 'absolute',
            right: '50%',
            top: 'calc(50% - 7rem)',   /* cone top sits at lamp origin */
            height: '14rem',
            overflow: 'visible',
            backgroundImage: `conic-gradient(from 70deg at center top, ${GREEN}, transparent, transparent)`,
          }}
        >
          {/* Fade bottom edge */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, width: '100%', height: '10rem', zIndex: 20,
            background: BG,
            WebkitMaskImage: 'linear-gradient(to top, white, transparent)',
            maskImage: 'linear-gradient(to top, white, transparent)',
          }} />
          {/* Fade left edge */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, width: '10rem', height: '100%', zIndex: 20,
            background: BG,
            WebkitMaskImage: 'linear-gradient(to right, white, transparent)',
            maskImage: 'linear-gradient(to right, white, transparent)',
          }} />
        </motion.div>

        {/* ── Right beam (conic from top-center, sweeps right) ── */}
        <motion.div
          initial={{ opacity: 0.5, width: '15rem' }}
          whileInView={{ opacity: 1, width: '30rem' }}
          transition={FADE}
          viewport={{ once: true }}
          style={{
            position: 'absolute',
            left: '50%',
            top: 'calc(50% - 7rem)',
            height: '14rem',
            overflow: 'visible',
            backgroundImage: `conic-gradient(from 290deg at center top, transparent, transparent, ${GREEN})`,
          }}
        >
          {/* Fade right edge */}
          <div style={{
            position: 'absolute', bottom: 0, right: 0, width: '10rem', height: '100%', zIndex: 20,
            background: BG,
            WebkitMaskImage: 'linear-gradient(to left, white, transparent)',
            maskImage: 'linear-gradient(to left, white, transparent)',
          }} />
          {/* Fade bottom edge */}
          <div style={{
            position: 'absolute', bottom: 0, right: 0, width: '100%', height: '10rem', zIndex: 20,
            background: BG,
            WebkitMaskImage: 'linear-gradient(to top, white, transparent)',
            maskImage: 'linear-gradient(to top, white, transparent)',
          }} />
        </motion.div>

        {/* ── Haze blur (below lamp origin) ── */}
        <div style={{
          position: 'absolute', top: '50%', left: 0,
          width: '100%', height: '12rem',
          transform: 'translateY(3rem) scaleX(1.5)',
          background: BG, filter: 'blur(40px)',
        }} />

        {/* ── Backdrop glass layer ── */}
        <div style={{
          position: 'absolute', top: '50%', left: 0, zIndex: 50,
          width: '100%', height: '12rem',
          opacity: 0.1, backdropFilter: 'blur(12px)',
        }} />

        {/* ── Wide glow orb ── */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%', zIndex: 50,
          width: '28rem', height: '9rem',
          transform: 'translate(-50%, -50%)',
          borderRadius: '9999px',
          background: GREEN, opacity: 0.5,
          filter: 'blur(64px)',
        }} />

        {/* ── Bright inner glow (animated width) ── */}
        <motion.div
          initial={{ width: '8rem' }}
          whileInView={{ width: '16rem' }}
          transition={FADE}
          viewport={{ once: true }}
          style={{
            position: 'absolute', top: 'calc(50% - 10.5rem)', left: '50%', zIndex: 30,
            height: '9rem',
            transform: 'translateX(-50%)',
            borderRadius: '9999px',
            background: BRIGHT, filter: 'blur(40px)',
          }}
        />

        {/* ── Horizontal glowing line at lamp origin ── */}
        <motion.div
          initial={{ width: '15rem' }}
          whileInView={{ width: '30rem' }}
          transition={FADE}
          viewport={{ once: true }}
          style={{
            position: 'absolute', top: 'calc(50% - 7rem)', left: '50%', zIndex: 50,
            height: '2px',
            transform: 'translateX(-50%)',
            background: BRIGHT,
          }}
        />

        {/* ── Dark mask — hides everything above the lamp origin ── */}
        <div style={{
          position: 'absolute', top: 'calc(50% - 12.5rem)', left: 0, zIndex: 40,
          width: '100%', height: '11rem',
          background: BG,
        }} />

      </div>
    </div>
  )
}
