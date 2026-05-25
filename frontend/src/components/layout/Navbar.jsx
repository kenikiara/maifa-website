import { useState } from 'react'
import { NavLink } from 'react-router-dom'

const WA_NUMBER = '254791899602'

const links = [
  { to: '/',          label: 'Home' },
  { to: '/shop',      label: 'Shop' },
  { to: '/#finder',   label: 'Battery Finder', ext: true },
  { to: '/about',     label: 'About' },
  { to: '/locations', label: 'Locations' },
  { to: '/warranty',  label: 'Warranty' },
  { to: '/blog',      label: 'Blog' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <NavLink to="/" className="logo" aria-label="Maifa home">
            <img src="/maifa-logo.webp" alt="Maifa" onError={e => e.target.style.display = 'none'} />
          </NavLink>

          <nav className="nav" aria-label="Main navigation">
            {links.map(l => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) => isActive ? 'active' : ''}
                end={l.to === '/'}
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="header-actions">
            <a
              href={`https://wa.me/${WA_NUMBER}?text=Hi! I need help finding the right battery.`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{ height: 40, padding: '0 16px', fontSize: 13 }}
            >
              Find My Battery
            </a>
            <button
              className="mobile-menu-btn icon-btn"
              aria-label="Open menu"
              onClick={() => setOpen(true)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6"/>
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Backdrop */}
      <div
        className={`mobile-nav-backdrop${open ? ' open' : ''}`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile nav drawer */}
      <nav className={`mobile-nav${open ? ' open' : ''}`} aria-label="Mobile navigation">
        {/* Header */}
        <div className="mobile-nav-head">
          <img src="/maifa-logo.webp" alt="Maifa" style={{ height: 28, objectFit: 'contain' }} />
          <button
            className="mobile-nav-close"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Links */}
        <div className="mobile-nav-links">
          {links.map((l, i) => (
            <NavLink
              key={l.to}
              to={l.to}
              style={{ '--i': i }}
              className={({ isActive }) => `mobile-nav-link${isActive ? ' active' : ''}`}
              end={l.to === '/'}
              onClick={() => setOpen(false)}
            >
              <span className="mobile-nav-num">0{i + 1}</span>
              {l.label}
            </NavLink>
          ))}
        </div>

        {/* Footer strip */}
        <div className="mobile-nav-foot">
          <a
            href={`https://wa.me/${WA_NUMBER}?text=Hi! I need help finding the right battery.`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', fontSize: 15, height: 50 }}
          >
            Find My Battery →
          </a>
          <p style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--mono)', textAlign: 'center', letterSpacing: '.06em' }}>
            Free fitting · Same-day Nairobi
          </p>
        </div>
      </nav>
    </>
  )
}
