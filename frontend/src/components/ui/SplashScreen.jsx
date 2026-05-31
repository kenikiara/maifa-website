import { useEffect, useState } from 'react'

export default function SplashScreen({ onDone }) {
  const [phase, setPhase] = useState('in') // 'in' | 'out'

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('out'), 2000)
    const t2 = setTimeout(() => onDone(),        2450)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [onDone])

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      background: '#050d06',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 0,
      transition: 'opacity .45s ease, transform .45s cubic-bezier(0.25,1,0.5,1)',
      opacity:   phase === 'out' ? 0 : 1,
      transform: phase === 'out' ? 'translateY(-10px) scale(1.01)' : 'none',
      pointerEvents: phase === 'out' ? 'none' : 'auto',
    }}>

      {/* Ambient green glow behind logo */}
      <div style={{
        position: 'absolute',
        width: 320,
        height: 320,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(15,122,61,.28) 0%, transparent 70%)',
        animation: 'splash-pulse 2s ease-in-out infinite',
        pointerEvents: 'none',
      }} />

      {/* Spinning charge ring */}
      <div style={{ position: 'relative', marginBottom: 32 }}>
        <svg
          width="110"
          height="110"
          viewBox="0 0 110 110"
          style={{ position: 'absolute', top: -15, left: -15, animation: 'splash-spin 2s linear infinite' }}
        >
          <circle
            cx="55" cy="55" r="50"
            fill="none"
            stroke="rgba(15,122,61,.15)"
            strokeWidth="1.5"
          />
          <circle
            cx="55" cy="55" r="50"
            fill="none"
            stroke="#1db954"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="60 255"
            strokeDashoffset="0"
          />
        </svg>

        {/* Logo */}
        <div style={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: 'rgba(255,255,255,.04)',
          border: '1px solid rgba(255,255,255,.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'splash-logo-in .7s cubic-bezier(0.16,1,0.3,1) both',
        }}>
          <img
            src="/maifa-logo.webp"
            alt="Maifa"
            style={{
              width: 50,
              height: 'auto',
              filter: 'brightness(0) invert(1)',
              display: 'block',
            }}
          />
        </div>
      </div>

      {/* Brand name */}
      <div style={{
        fontFamily: 'var(--serif)',
        fontSize: 28,
        color: '#fff',
        letterSpacing: '-0.02em',
        animation: 'splash-fade-up .6s ease .2s both',
      }}>
        Maifa
      </div>

      {/* Tagline */}
      <div style={{
        fontFamily: 'var(--mono)',
        fontSize: 10,
        letterSpacing: '.18em',
        textTransform: 'uppercase',
        color: 'rgba(255,255,255,.3)',
        marginTop: 6,
        marginBottom: 36,
        animation: 'splash-fade-up .6s ease .4s both',
      }}>
        Amaron Car Batteries · Kenya
      </div>

      {/* Progress bar */}
      <div style={{
        width: 120,
        height: 2,
        background: 'rgba(255,255,255,.08)',
        borderRadius: 999,
        overflow: 'hidden',
        animation: 'splash-fade-up .4s ease .3s both',
      }}>
        <div style={{
          height: '100%',
          background: 'linear-gradient(90deg, var(--green), #22c55e)',
          borderRadius: 999,
          animation: 'splash-bar 1.8s cubic-bezier(.4,0,.2,1) .15s forwards',
          width: 0,
        }} />
      </div>

      <style>{`
        @keyframes splash-pulse {
          0%, 100% { transform: scale(1);   opacity: 1; }
          50%       { transform: scale(1.1); opacity: .6; }
        }
        @keyframes splash-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes splash-logo-in {
          from { opacity: 0; transform: scale(.82); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes splash-fade-up {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes splash-bar {
          0%   { width: 0%; }
          60%  { width: 85%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  )
}
