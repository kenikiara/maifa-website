import { Link } from 'react-router-dom'
import ThreeAurora from '../ui/ThreeAurora'

const SOCIALS = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/maifa_ltd',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <circle cx="12" cy="12" r="4"/>
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
      </svg>
    ),
  },
  {
    label: 'TikTok',
    href: 'https://www.tiktok.com/@amaron_batteries_kenya',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/>
      </svg>
    ),
  },
  {
    label: 'Facebook',
    href: '#',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
      </svg>
    ),
  },
]

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="site-footer">
      <ThreeAurora />
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="footer-grid">
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
              <span style={{ fontFamily:'var(--serif)', fontSize:28, color:'#fff' }}>Maifa</span>
            </div>
            <p style={{ fontSize:14, maxWidth:300, lineHeight:1.65, color:'rgba(255,255,255,.6)' }}>
              Maifa supplies and fits Amaron and partner-brand batteries across Kenya.
              Power on — wherever the road takes you.
            </p>
            <div style={{ display:'flex', gap:10, marginTop:20 }}>
              {SOCIALS.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="social-btn"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4>Shop</h4>
            <ul>
              <li><Link to="/shop">All Batteries</Link></li>
              <li><Link to="/shop?category=Standard">Standard</Link></li>
              <li><Link to="/shop?category=Large+Car">Large Car</Link></li>
              <li><Link to="/shop?category=EFB">EFB / Start-Stop</Link></li>
              <li><Link to="/shop?category=Heavy+Duty">Heavy Duty</Link></li>
              <li><Link to="/shop?category=European">European</Link></li>
            </ul>
          </div>

          <div>
            <h4>Help</h4>
            <ul>
              <li><a href="/#finder">Battery Finder</a></li>
              <li><Link to="/warranty">Register Warranty</Link></li>
              <li><a href="https://wa.me/254791899602?text=Hi! I'd like to trade in my old battery." target="_blank" rel="noopener noreferrer">Trade-In Programme</a></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/about">About Maifa</Link></li>
            </ul>
          </div>

          <div>
            <h4>Branches</h4>
            <ul>
              <li>
                <a href="tel:+254791899602">
                  Thika Road · 0791 899 602
                </a>
              </li>
              <li>
                <a href="tel:+254700777698">
                  Kiambu Road · 0700 777 698
                </a>
              </li>
              <li>
                <a href="tel:+254701880955">
                  Mombasa · 0701 880 955
                </a>
              </li>
              <li style={{ marginTop:12, color:'rgba(255,255,255,.3)', fontFamily:'var(--mono)', fontSize:11, letterSpacing:'.08em', textTransform:'uppercase' }}>
                Mon–Sat · 7:30 – 19:00
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {year} Maifa Ltd · Nairobi, Kenya</span>
          <div style={{ display:'flex', gap:'var(--s5)', alignItems:'center', flexWrap:'wrap' }}>
            <Link to="/privacy-policy" style={{ fontSize:12, color:'rgba(255,255,255,.4)', fontFamily:'var(--mono)', letterSpacing:'.04em' }}>Privacy Policy</Link>
            <Link to="/terms" style={{ fontSize:12, color:'rgba(255,255,255,.4)', fontFamily:'var(--mono)', letterSpacing:'.04em' }}>Terms of Use</Link>
            <a href="https://kendesigners.com" target="_blank" rel="noopener noreferrer"
              style={{ fontSize:12, color:'rgba(255,255,255,.28)', fontFamily:'var(--mono)', letterSpacing:'.04em' }}>
              Made by kendesigners.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
