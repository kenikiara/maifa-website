import { motion } from 'framer-motion'

/**
 * Infinite-scrolling vertical column of testimonial cards.
 *
 * Props:
 *   testimonials  — array of { stars, quote, name, car, initial }
 *   duration      — seconds for one full scroll cycle (default 15)
 *   style         — extra inline styles on the wrapper (e.g. display:none on mobile)
 */
export default function TestimonialsColumn({ testimonials, duration = 15, style, className }) {
  return (
    <div className={className} style={{ overflow: 'hidden', ...style }}>
      <motion.div
        animate={{ y: '-50%' }}
        transition={{
          duration,
          repeat: Infinity,
          ease: 'linear',
          repeatType: 'loop',
        }}
        style={{ display: 'flex', flexDirection: 'column', gap: 20, paddingBottom: 20 }}
      >
        {/* Two copies so the loop is seamless */}
        {[0, 1].map(copy => (
          testimonials.map(({ stars, quote, name, car, initial }, i) => (
            <div
              key={`${copy}-${i}`}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.09)',
                borderRadius: 20,
                padding: '28px 26px',
                width: 300,
                flexShrink: 0,
              }}
            >
              {/* Stars */}
              <div style={{ display: 'flex', gap: 2, marginBottom: 14 }}>
                {Array.from({ length: stars }).map((_, s) => (
                  <svg key={s} width="14" height="14" viewBox="0 0 24 24" fill="#fbbc04">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <p style={{ fontSize: 14, lineHeight: 1.65, color: 'rgba(255,255,255,0.82)', margin: 0 }}>
                "{quote}"
              </p>

              {/* Author */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 20 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: '50%',
                  background: 'var(--green)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--serif)', fontSize: 16, color: '#fff', flexShrink: 0,
                }}>
                  {initial}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13, color: '#fff', lineHeight: 1.3 }}>{name}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', lineHeight: 1.3, marginTop: 2, fontFamily: 'var(--mono)' }}>{car}</div>
                </div>
              </div>
            </div>
          ))
        ))}
      </motion.div>
    </div>
  )
}
