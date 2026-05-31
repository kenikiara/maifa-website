import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useScrollReveal } from '../hooks/useScrollReveal'

const TEAM_VALUES = [
  { n: '01', title: 'Battery expertise', body: 'We stock and fit only proven brands — Amaron leads our range because it outperforms in East African heat and short-trip cycles.' },
  { n: '02', title: 'Same-day service', body: 'Order before 4pm, fitted same day in Nairobi. We carry stock across three branches so you are never left waiting.' },
  { n: '03', title: 'Honest pricing', body: 'No markups, no hidden fitting fees. The price you see includes delivery and installation at your location or at our branch.' },
  { n: '04', title: 'Warranty peace of mind', body: 'Every battery comes with a 12-month warranty you can claim at any branch — in person, in minutes, with no paperwork maze.' },
]

const STATS = [
  { value: '12+', label: 'Years in business' },
  { value: '3',   label: 'Branches across Kenya' },
  { value: '5K+', label: 'Batteries fitted annually' },
  { value: '4.9★', label: 'Customer rating' },
]

const TIMELINE = [
  { year: '2012', event: 'Maifa opens its first branch on Thika Road, stocking Amaron Hi Life for Japanese-import vehicles.', image: '/branches/thika-road.webp', label: 'Thika Road branch' },
  { year: '2016', event: 'Kiambu Road branch opens following demand from Runda, Muthaiga, and Ruaka customers.', image: '/branches/kiambu-road.webp', label: 'Kiambu Road branch' },
  { year: '2020', event: 'Mombasa branch launches — Maifa\'s first outside Nairobi, serving the Coast corridor.', image: '/branches/mombasa.webp', label: 'Mombasa branch' },
  { year: '2024', event: 'EFB and European DIN ranges added as Kenya\'s fleet of newer start-stop vehicles grows.', image: null, label: null },
  { year: '2026', event: 'maifa.ke launches — online battery finder, warranty registration, and nationwide ordering.', image: null, label: null },
]

const BRANCHES = [
  { name: 'Thika Road', phone: '+254 791 899 602', hours: 'Mon–Sat · 7:30am – 7pm', image: '/branches/thika-road.webp' },
  { name: 'Kiambu Road', phone: '+254 700 777 698', hours: 'Mon–Sat · 7:30am – 7pm', image: '/branches/kiambu-road.webp' },
  { name: 'Mombasa', phone: '+254 701 880 955', hours: 'Mon–Sat · 8am – 6:30pm', image: '/branches/mombasa.webp' },
]

export default function About() {
  useScrollReveal()

  return (
    <>
      <Helmet>
        <title>About Maifa — Kenya's Amaron Battery Specialists Since 2012</title>
        <meta name="description" content="Maifa has been supplying and fitting Amaron car batteries across Kenya since 2012. Learn about our three branches, our team, and our commitment to Kenyan drivers." />
      </Helmet>
      {/* ── Hero ── */}
      <section className="page-head" style={{ padding: 'var(--s9) 0 var(--s7)', overflow: 'hidden' }}>
        <div className="container">
          <div className="crumbs" style={{ marginBottom: 'var(--s5)' }}>
            <Link to="/">Home</Link> / <span>About</span>
          </div>

          <div className="about-hero-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--s9)', alignItems: 'start' }}>
            {/* Copy */}
            <div>
              <span className="eyebrow">About Maifa</span>
              <h1 style={{ marginTop: 'var(--s4)', fontSize: 'clamp(42px,5.5vw,80px)', lineHeight: 1 }}>
                Nairobi's battery specialists, since 2012.
              </h1>
              <p style={{ fontSize: 17, lineHeight: 1.7, color: 'rgba(255,255,255,0.8)', marginTop: 'var(--s5)', maxWidth: 480 }}>
                Maifa was founded by mechanics tired of watching customers buy cheap batteries that failed in six months. We set out to stock only proven brands — Amaron first — and back every sale with honest advice and real warranty.
              </p>
              <div style={{ display: 'flex', gap: 'var(--s3)', marginTop: 'var(--s6)', flexWrap: 'wrap' }}>
                <a href="https://wa.me/254791899602?text=Hi! I'd like to know more about Maifa." target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  Talk to us →
                </a>
                <Link to="/shop" className="btn btn-secondary">Browse batteries</Link>
              </div>

              {/* Stats row */}
              <div className="about-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 'var(--s4)', marginTop: 'var(--s8)', paddingTop: 'var(--s6)', borderTop: '1px solid rgba(255,255,255,0.12)' }}>
                {STATS.map(s => (
                  <div key={s.label}>
                    <div style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(28px,3vw,44px)', lineHeight: 1, color: '#fff' }}>{s.value}</div>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', marginTop: 'var(--s2)', lineHeight: 1.4 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Photo collage */}
            <div style={{ position: 'relative', display: 'grid', gridTemplateRows: '1fr auto', gap: 'var(--s3)' }}>
              {/* Main branch photo */}
              <div style={{ borderRadius: 'var(--r-lg)', overflow: 'hidden', height: 380 }}>
                <img
                  src="/branches/thika-road.webp"
                  alt="Maifa Thika Road branch"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </div>
              {/* Second row — two smaller photos */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--s3)' }}>
                <div style={{ borderRadius: 'var(--r)', overflow: 'hidden', height: 180 }}>
                  <img
                    src="/branches/kiambu-road.webp"
                    alt="Maifa Kiambu Road branch"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </div>
                <div style={{ borderRadius: 'var(--r)', overflow: 'hidden', height: 180 }}>
                  <img
                    src="/branches/we-deliver.webp"
                    alt="Maifa delivery service"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section style={{ background: 'var(--paper-2)' }}>
        <div className="container">
          <div className="section-head reveal">
            <div>
              <span className="eyebrow">What we stand for</span>
              <h2 style={{ marginTop: 'var(--s4)' }}>Why customers come back.</h2>
            </div>
          </div>
          <div className="about-values" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 'var(--s5)' }}>
            {TEAM_VALUES.map((v, i) => (
              <div key={v.n} className="reveal" style={{ transitionDelay: `${i * 0.1}s`, background: 'var(--white)', border: '1px solid var(--line)', borderRadius: 'var(--r-lg)', padding: 'var(--s6)' }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--green)', marginBottom: 'var(--s3)' }}>{v.n}</div>
                <h3 style={{ fontSize: 22, marginBottom: 'var(--s3)' }}>{v.title}</h3>
                <p style={{ color: '#444', fontSize: 15, lineHeight: 1.65 }}>{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Branches photo strip ── */}
      <section style={{ background: 'var(--ink)', padding: 'var(--s8) 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'var(--s6)', flexWrap: 'wrap', gap: 'var(--s4)' }}>
            <div>
              <span className="eyebrow no-rule" style={{ color: 'var(--green-bright)' }}>Three locations</span>
              <h2 style={{ color: '#fff', marginTop: 'var(--s3)', fontSize: 'clamp(28px,4vw,48px)' }}>Walk in at any branch.</h2>
            </div>
            <Link to="/locations" className="btn btn-secondary" style={{ borderColor: 'rgba(255,255,255,.2)', color: '#fff', flexShrink: 0 }}>
              View all locations →
            </Link>
          </div>
          <div className="about-branches" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 'var(--s4)' }}>
            {BRANCHES.map((b, i) => (
              <div key={b.name} className="reveal" style={{ transitionDelay: `${i * 0.1}s`, borderRadius: 'var(--r-lg)', overflow: 'hidden', position: 'relative' }}>
                <div style={{ height: 260, overflow: 'hidden' }}>
                  {b.image ? (
                    <img
                      src={b.image}
                      alt={`Maifa ${b.name}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform .4s ease' }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', background: 'linear-gradient(148deg,#031508 0%,#063d1c 45%,#0f7a3d 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                      </svg>
                    </div>
                  )}
                </div>
                <div style={{ padding: 'var(--s4) var(--s5)', background: 'rgba(255,255,255,.06)', borderTop: '1px solid rgba(255,255,255,.1)' }}>
                  <div style={{ fontFamily: 'var(--serif)', fontSize: 20, color: '#fff', marginBottom: 4 }}>{b.name}</div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'rgba(255,255,255,.5)', letterSpacing: '.06em' }}>{b.hours}</div>
                  <a href={`tel:${b.phone.replace(/\s/g, '')}`} style={{ fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--green-bright)', fontWeight: 600, display: 'block', marginTop: 6, textDecoration: 'none' }}>{b.phone}</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Timeline ── */}
      <section style={{ background: 'var(--paper)' }}>
        <div className="container">
          <div className="section-head reveal">
            <div>
              <span className="eyebrow">Our story</span>
              <h2 style={{ marginTop: 'var(--s4)' }}>A decade of powering Nairobi.</h2>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {TIMELINE.map((t, i) => (
              <div
                key={t.year}
                className={`reveal about-timeline-row${t.image ? ' has-photo' : ''}`}
                style={{
                  transitionDelay: `${i * 0.08}s`,
                  padding: 'var(--s6) 0',
                  borderTop: i === 0 ? 'none' : '1px solid var(--line)',
                }}
              >
                {/* Year */}
                <div className="about-year" style={{ fontFamily: 'var(--serif)', fontSize: 38, lineHeight: 1, color: 'var(--green-deep)' }}>{t.year}</div>

                {/* Event text */}
                <div>
                  {t.label && (
                    <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--green)', marginBottom: 'var(--s2)' }}>
                      {t.label}
                    </div>
                  )}
                  <p style={{ fontSize: 16, lineHeight: 1.65, color: '#333', margin: 0 }}>{t.event}</p>
                </div>

                {/* Branch photo */}
                {t.image && (
                  <div className="timeline-photo" style={{ borderRadius: 'var(--r)', overflow: 'hidden', height: 140 }}>
                    <img
                      src={t.image}
                      alt={t.label}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Delivery banner ── */}
      <section style={{ padding: 0, overflow: 'hidden', maxHeight: 380, position: 'relative' }}>
        <img
          src="/branches/we-deliver.webp"
          alt="Maifa same-day battery delivery"
          style={{ width: '100%', height: 380, objectFit: 'cover', display: 'block' }}
        />
        {/* Dark overlay with text */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(6,13,7,.85) 40%, transparent 100%)', display: 'flex', alignItems: 'center' }}>
          <div className="container">
            <span className="eyebrow no-rule" style={{ color: 'var(--green-bright)' }}>Same-day delivery</span>
            <h2 style={{ color: '#fff', marginTop: 'var(--s3)', fontSize: 'clamp(28px,4vw,52px)', maxWidth: 480 }}>
              Order before 4pm. Fitted same day across Nairobi.
            </h2>
            <a href="https://wa.me/254791899602?text=Hi! I need a battery delivered today." target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ marginTop: 'var(--s5)' }}>
              Order now →
            </a>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: 'var(--ink)', color: '#fff' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="eyebrow no-rule" style={{ color: 'rgba(255,255,255,.5)' }}>Start today</span>
          <h2 style={{ color: '#fff', marginTop: 'var(--s4)', maxWidth: 640, marginLeft: 'auto', marginRight: 'auto' }}>
            Need a battery? We'll sort you out — same day.
          </h2>
          <div style={{ display: 'flex', gap: 'var(--s3)', justifyContent: 'center', marginTop: 'var(--s6)', flexWrap: 'wrap' }}>
            <a href="https://wa.me/254791899602?text=Hi! I need help finding the right battery for my car." target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              Find my battery →
            </a>
            <Link to="/contact" className="btn btn-secondary" style={{ borderColor: 'rgba(255,255,255,.2)', color: '#fff' }}>
              Contact us
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
