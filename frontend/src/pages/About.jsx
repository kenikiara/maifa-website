import { Link } from 'react-router-dom'
import { useScrollReveal } from '../hooks/useScrollReveal'

const TEAM_VALUES = [
  { n: '01', title: 'Battery expertise', body: 'We stock and fit only proven brands — Amaron leads our range because it outperforms in East African heat and short-trip cycles.' },
  { n: '02', title: 'Same-day service', body: 'Order before 4pm, fitted same day in Nairobi. We carry stock across three branches so you are never left waiting.' },
  { n: '03', title: 'Honest pricing', body: 'No markups, no hidden fitting fees. The price you see includes delivery and installation at your location or at our branch.' },
  { n: '04', title: 'Warranty peace of mind', body: 'Every battery comes with a 12-month warranty you can claim at any branch — in person, in minutes, with no paperwork maze.' },
]

const STATS = [
  { value: '12+', label: 'Years in business' },
  { value: '3', label: 'Nairobi branches' },
  { value: '5K+', label: 'Batteries fitted annually' },
  { value: '4.9★', label: 'Customer rating' },
]

const TIMELINE = [
  { year: '2012', event: 'Maifa opens its first branch on Thika Road, stocking Amaron Hi Life for Japanese-import vehicles.' },
  { year: '2016', event: 'Kiambu Road branch opens following demand from Runda, Muthaiga, and Ruaka customers.' },
  { year: '2020', event: 'Mombasa branch launches — Maifa\'s first outside Nairobi, serving the Coast corridor.' },
  { year: '2024', event: 'EFB and European DIN ranges added as Kenya\'s fleet of newer start-stop vehicles grows.' },
  { year: '2026', event: 'maifa.ke launches — online battery finder, warranty registration, and nationwide ordering.' },
]

export default function About() {
  useScrollReveal()

  return (
    <>
      {/* Hero */}
      <section style={{ padding: 'var(--s9) 0', borderBottom: '1px solid var(--line)' }}>
        <div className="container">
          <div className="crumbs" style={{ marginBottom: 'var(--s5)' }}>
            <Link to="/">Home</Link> / <span>About</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--s8)', alignItems: 'center' }}>
            <div>
              <span className="eyebrow">About Maifa</span>
              <h1 style={{ marginTop: 'var(--s4)', fontSize: 'clamp(48px,6vw,88px)' }}>
                Nairobi's battery specialists, since 2012.
              </h1>
              <p style={{ fontSize: 17, lineHeight: 1.7, color: '#444', marginTop: 'var(--s5)', maxWidth: 480 }}>
                Maifa was founded by mechanics tired of watching customers buy cheap batteries that failed in six months. We set out to stock only proven brands — Amaron first, then partners — and back every sale with honest advice and real warranty.
              </p>
              <div style={{ display: 'flex', gap: 'var(--s3)', marginTop: 'var(--s6)', flexWrap: 'wrap' }}>
                <a href="https://wa.me/254791899602?text=Hi! I'd like to know more about Maifa." target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  Talk to us →
                </a>
                <Link to="/shop" className="btn btn-secondary">Browse batteries</Link>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--s4)' }}>
              {STATS.map(s => (
                <div key={s.label} style={{ background: 'var(--white)', border: '1px solid var(--line)', borderRadius: 'var(--r-lg)', padding: 'var(--s6)' }}>
                  <div style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(36px,5vw,56px)', lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--muted)', marginTop: 'var(--s2)' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section style={{ background: 'var(--paper-2)' }}>
        <div className="container">
          <div className="section-head reveal">
            <div>
              <span className="eyebrow">What we stand for</span>
              <h2 style={{ marginTop: 'var(--s4)' }}>Why customers come back.</h2>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 'var(--s5)' }}>
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

      {/* Timeline */}
      <section>
        <div className="container">
          <div className="section-head reveal">
            <div>
              <span className="eyebrow">Our story</span>
              <h2 style={{ marginTop: 'var(--s4)' }}>A decade of powering Nairobi.</h2>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0, maxWidth: 720 }}>
            {TIMELINE.map((t, i) => (
              <div key={t.year} className="reveal" style={{ transitionDelay: `${i * 0.1}s`, display: 'grid', gridTemplateColumns: '100px 1fr', gap: 'var(--s5)', padding: 'var(--s5) 0', borderTop: i === 0 ? 'none' : '1px solid var(--line)' }}>
                <div style={{ fontFamily: 'var(--serif)', fontSize: 32, lineHeight: 1, color: 'var(--green)' }}>{t.year}</div>
                <p style={{ fontSize: 15, lineHeight: 1.65, color: '#333', paddingTop: 6 }}>{t.event}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--ink)', color: '#fff' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="eyebrow no-rule" style={{ color: 'rgba(255,255,255,.5)' }}>Start today</span>
          <h2 style={{ color: '#fff', marginTop: 'var(--s4)', maxWidth: 640, marginLeft: 'auto', marginRight: 'auto' }}>
            Need a battery? We'll sort you out — same day.
          </h2>
          <div style={{ display: 'flex', gap: 'var(--s3)', justifyContent: 'center', marginTop: 'var(--s6)', flexWrap: 'wrap' }}>
            <a
              href="https://wa.me/254791899602?text=Hi! I need help finding the right battery for my car."
              target="_blank" rel="noopener noreferrer"
              className="btn btn-primary"
            >
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
