import { Link } from 'react-router-dom'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="site-footer">
      <div className="container">
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
              {[
                { href:'https://www.instagram.com/maifa_ltd', label:'Instagram', icon:'IG' },
                { href:'https://www.tiktok.com/@amaron_batteries_kenya', label:'TikTok', icon:'TT' },
                { href:'#', label:'Facebook', icon:'FB' },
              ].map(s => (
                <a
                  key={s.icon}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  style={{ width:36, height:36, borderRadius:'50%', background:'rgba(255,255,255,.07)', border:'1px solid rgba(255,255,255,.12)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontFamily:'var(--mono)', letterSpacing:'.06em', color:'rgba(255,255,255,.6)', transition:'color .15s, border-color .15s' }}
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
          <span>Power on.</span>
        </div>
      </div>
    </footer>
  )
}
