import { useEffect, useState } from 'react'

export default function SplashScreen({ onDone }) {
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setLeaving(true), 1700)   // start exit
    const t2 = setTimeout(() => onDone(),          2150)  // unmount after fade
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [onDone])

  return (
    <div className={`splash${leaving ? ' splash-out' : ''}`}>
      <div className="splash-inner">
        <img src="/maifa-logo.png" alt="Maifa" className="splash-logo" />
        <div className="splash-track">
          <div className="splash-fill" />
        </div>
        <span className="splash-hint">Loading…</span>
      </div>
    </div>
  )
}
