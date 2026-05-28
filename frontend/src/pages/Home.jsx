import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useApi } from '../hooks/useApi'
import { useScrollReveal } from '../hooks/useScrollReveal'
import PageTransition from '../components/ui/PageTransition'
import ShaderBackground from '../components/ui/ShaderBackground'
import TestimonialsColumn from '../components/ui/TestimonialsColumn'
import BatteryQuickModal from '../components/ui/BatteryQuickModal'

const WA = '254791899602'

function toSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

const CATEGORIES = [
  { num: '01', key: 'Standard',   label: 'Car Batteries Standard', blurb: 'Small-engine sedans. Lower electrical demand. Maintenance free.', img: '/categories/regular-car.webp' },
  { num: '02', key: 'Large Car',  label: 'Large Cars',             blurb: 'SUVs and big engines. Higher draw. Built to keep up.',             img: '/categories/suv.webp'         },
  { num: '03', key: 'EFB',        label: 'Start-Stop EFB',         blurb: 'Engineered for cars with idle-stop. Frequent restarts, no sweat.', img: '/categories/efb.webp'         },
  { num: '04', key: 'Heavy Duty', label: 'Heavy Duty',             blurb: 'Maximum vibration resistance. Verified for Kenyan terrain.',       img: '/categories/heavy-duty.webp'  },
  { num: '05', key: 'European',   label: 'European',               blurb: 'High CCA. Long cycle life. For BMW, Mercedes, Audi & co.',         img: '/categories/euro-spec.webp'   },
]

const TESTIMONIALS = [
  { stars:5, quote:'Booked online, fitted in twelve minutes flat at the Thika Road branch. They even knocked off the old battery from the price.', name:'James M.', car:'Toyota Premio · Nairobi', initial:'J' },
  { stars:5, quote:'My usual shop kept giving me the wrong size. Maifa\'s battery finder got it right first try. Two years on, still going strong.', name:'Wanjiku K.', car:'Subaru Forester · Kiambu', initial:'W' },
  { stars:5, quote:'Needed a heavy-duty unit for my Land Cruiser before a Loita Hills trip. Called at 9am, fitted by noon. Exceptional service.', name:'David O.', car:'Land Cruiser 79 · Karen', initial:'D' },
  { stars:5, quote:'Dead battery on a Monday morning. Maifa Mombasa branch had me back on the road in under 20 minutes. Outstanding.', name:'Fatuma A.', car:'Toyota Vitz · Mombasa', initial:'F' },
  { stars:5, quote:'The team explained exactly why my old battery failed and what size I needed. No upselling, just honest advice. Will always come back.', name:'Brian N.', car:'Mazda CX-5 · Westlands', initial:'B' },
  { stars:5, quote:'Traded in my dead Exide and got KES 1,200 off a new Amaron. The whole swap took 18 minutes. Couldn\'t be happier.', name:'Grace W.', car:'Honda Fit · Thika Road', initial:'G' },
  { stars:5, quote:'My Premio had been sluggish-starting for weeks. Maifa diagnosed a failing battery and replaced it on the spot. Starts perfectly now.', name:'Peter K.', car:'Toyota Premio · South C', initial:'P' },
  { stars:5, quote:'I drive a Prius so I was worried about finding the right EFB battery. Maifa stocked exactly what I needed and fitted it for free.', name:'Sarah O.', car:'Toyota Prius · Lavington', initial:'S' },
  { stars:5, quote:'Three buses in my fleet. Maifa gave me a bulk deal and sent a technician to our yard. Saved us a full day of downtime.', name:'Hassan M.', car:'Fleet Owner · Industrial Area', initial:'H' },
  { stars:5, quote:'Called the Kiambu Road branch at 6pm thinking they\'d be closed. They waited for me and sorted my battery. Real customer care.', name:'Anne K.', car:'Nissan X-Trail · Ridgeways', initial:'A' },
]

const TRUST_ITEMS = [
  { icon:'⚡', name:'Free installation',     desc:'All Nairobi branches' },
  { icon:'🛡',  name:'1-year warranty',        desc:'Replacement guarantee' },
  { icon:'📱', name:'M-Pesa accepted',        desc:'Plus card & cash on delivery' },
  { icon:'♻', name:'Old battery trade-in',   desc:'Up to KES 500 off' },
]

const TICKER = [
  'Free Installation in Nairobi','Same-Day Delivery','Old Battery Trade-In Up to KES 500','1-Year Warranty','M-Pesa Accepted',
]

const MAKES  = ['Toyota','Nissan','Honda','Mercedes','BMW','Subaru','Mazda','Mitsubishi','Volkswagen','Isuzu']
const MODELS = { Toyota:['Axio','Premio','Fielder','Land Cruiser','Vitz','Harrier','RAV4'], Nissan:['Note','March','X-Trail','Navara','Patrol'], Honda:['Fit','CRV','Accord'], Mercedes:['C-Class','E-Class','GLE'], BMW:['3 Series','5 Series','X5'], Subaru:['Forester','Outback','Impreza'], Mazda:['Demio','CX-5','Atenza'], Mitsubishi:['Pajero','Outlander','L200'], Volkswagen:['Golf','Touareg','Polo'], Isuzu:['D-Max','MUX'] }
const YEARS  = Array.from({length:20}, (_,i)=>(2024-i).toString())

// Battery category matching — model takes priority over make
const MAKE_CAT  = { Mercedes:'European', BMW:'European', Volkswagen:'European' }
const MODEL_CAT = {
  // Heavy Duty
  'Land Cruiser':'Heavy Duty', 'Navara':'Heavy Duty', 'Patrol':'Heavy Duty',
  'D-Max':'Heavy Duty', 'MUX':'Heavy Duty', 'L200':'Heavy Duty', 'Pajero':'Heavy Duty',
  // Large Car
  'RAV4':'Large Car', 'Harrier':'Large Car', 'X-Trail':'Large Car', 'CRV':'Large Car',
  'Forester':'Large Car', 'Outback':'Large Car', 'Outlander':'Large Car',
  'CX-5':'Large Car', 'GLE':'Large Car', 'X5':'Large Car', 'Touareg':'Large Car',
  // EFB (idle stop-start)
  'Note':'EFB',
  // European (by model)
  '3 Series':'European', '5 Series':'European', 'C-Class':'European',
  'E-Class':'European', 'Golf':'European', 'Polo':'European',
  // Standard
  'Vitz':'Standard', 'Axio':'Standard', 'Premio':'Standard', 'Fielder':'Standard',
  'Fit':'Standard', 'Accord':'Standard', 'Demio':'Standard', 'Atenza':'Standard',
  'March':'Standard', 'Impreza':'Standard',
}

function matchCategory(make, model) {
  return MODEL_CAT[model] || MAKE_CAT[make] || 'Standard'
}

/* ── Newsletter section with live API ── */
function NewsletterSection() {
  const [email,   setEmail]   = useState('')
  const [loading, setLoading] = useState(false)
  const [status,  setStatus]  = useState(null) // null | 'success' | 'error'
  const [msg,     setMsg]     = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setStatus(null)
    try {
      const res  = await fetch('/api/newsletter.php', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email }),
      })
      const data = await res.json()
      if (data.success) {
        setStatus('success')
        setMsg(data.message === 'Already subscribed' ? "You're already on the list!" : "You're in! We'll be in touch.")
        setEmail('')
      } else {
        setStatus('error')
        setMsg(data.error || 'Something went wrong. Please try again.')
      }
    } catch {
      setStatus('error')
      setMsg('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="newsletter" style={{ background:'var(--ink)', color:'#fff', padding:'var(--s8) 0' }}>
      <div className="container">
        <div className="newsletter-grid">
          <div>
            <span className="eyebrow no-rule" style={{ color:'var(--green-bright)' }}>Stay charged</span>
            <h3 style={{ color:'#fff', marginTop:'var(--s4)' }}>Battery tips, new arrivals, and the occasional discount.</h3>
          </div>
          <div>
            {status === 'success' ? (
              <div style={{ display:'flex', alignItems:'center', gap:14, padding:'var(--s5)', background:'rgba(15,122,61,.18)', border:'1.5px solid var(--green)', borderRadius:'var(--r-lg)' }}>
                <div style={{ width:38, height:38, borderRadius:'50%', background:'var(--green)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <div>
                  <div style={{ fontWeight:600, color:'#fff', fontSize:15 }}>{msg}</div>
                  <div style={{ fontSize:12, color:'rgba(255,255,255,.5)', fontFamily:'var(--mono)', marginTop:3 }}>We won't spam you — ever.</div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="newsletter-form">
                <input
                  type="email"
                  placeholder="your@email.com"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{ flex:1, background:'transparent', border:'none', padding:'12px 16px', color:'#fff', fontFamily:'var(--sans)', fontSize:14, outline:'none', minWidth:0 }}
                />
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                  style={{ height:46, padding:'0 20px', flexShrink:0, opacity: loading ? .7 : 1 }}
                >
                  {loading ? 'Subscribing…' : 'Subscribe'}
                </button>
              </form>
            )}
            {status === 'error' && (
              <p style={{ color:'#f87171', fontSize:13, fontFamily:'var(--mono)', marginTop:8 }}>{msg}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── Page ── */

export default function Home() {
  useScrollReveal()

  const [quickModal, setQuickModal] = useState(false)

  const { data } = useApi('/api/products.php')
  const products  = (data?.products || []).slice(0, 4)

  const [activeCat, setActiveCat] = useState('All')
  const { data: filteredData } = useApi(activeCat === 'All' ? '/api/products.php' : `/api/products.php?category=${encodeURIComponent(activeCat)}`)
  const featured = (filteredData?.products || []).slice(0, 4)

  const [make, setMake]         = useState('')
  const [model, setModel]       = useState('')
  const [year, setYear]         = useState('')
  const [finderResult, setFinderResult] = useState(null) // null | { category, picks, carLabel }
  const models = make ? (MODELS[make] || []) : []

  const { data: allProducts } = useApi('/api/products.php?limit=100')

  function handleFinder(e) {
    e.preventDefault()
    const category = matchCategory(make, model)
    const pool = allProducts?.products || []
    const picks = pool.filter(p => p.category === category).slice(0, 3)
    setFinderResult({ category, picks, carLabel: [year, make, model].filter(Boolean).join(' ') })
  }

  function resetFinder() {
    setFinderResult(null)
    setMake(''); setModel(''); setYear('')
  }

  function waConsult() {
    const msg = `Hi! I need help finding a battery for my ${finderResult?.carLabel || [year, make, model].filter(Boolean).join(' ')}. Can you advise?`
    window.open(`https://wa.me/${WA}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  return (
    <>
    <PageTransition>
      {/* Marquee */}
      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[...TICKER, ...TICKER].map((t, i) => (
            <span key={i}><span className="dot" />{t}</span>
          ))}
        </div>
      </div>

      {/* Hero */}
      <section id="hero" style={{ position:'relative', borderBottom:'1px solid var(--line)', overflow:'hidden', background:'var(--paper)' }}>
        {/* Hero background — branded car photo with gradient isolation */}
        <div style={{ position:'absolute', inset:0, zIndex:0, pointerEvents:'none' }}>
          <img
            src="/hero-car.webp"
            alt=""
            style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', objectPosition:'center center' }}
          />
          {/* Left-to-right gradient: solid paper on left (text readable), car fully visible on right */}
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(90deg, #f7f6f2 0%, #f7f6f2 32%, rgba(247,246,242,.85) 48%, rgba(247,246,242,.15) 65%, transparent 100%)' }} />
        </div>

        <div className="container" style={{ position:'relative', zIndex:1 }}>
          <div className="hero-copy" style={{ maxWidth:580, paddingBottom:'var(--s9)' }}>
            <span className="eyebrow">Maifa · Built for Kenyan roads</span>
            <h1 style={{ fontSize:'clamp(56px,8vw,112px)', lineHeight:.95, margin:'var(--s4) 0 var(--s4)' }}>
              Built for <em style={{ fontStyle:'italic', color:'var(--green-deep)' }}>Kenyan</em> roads.
            </h1>
            <p style={{ fontSize:18, color:'#333', maxWidth:480, marginBottom:'var(--s6)', lineHeight:1.6 }}>
              Maintenance-free car batteries engineered for tropical heat and rough roads. Free installation, same-day delivery across Nairobi, Kiambu and Mombasa.
            </p>
            <div style={{ display:'flex', gap:'var(--s3)', flexWrap:'wrap' }}>
              <button onClick={() => setQuickModal(true)} className="btn btn-primary">Find my battery <span style={{ marginLeft:4 }}>→</span></button>
              <Link to="/shop" className="btn btn-secondary">Browse all batteries</Link>
            </div>
            <div style={{ display:'flex', gap:'var(--s7)', marginTop:'var(--s7)', paddingTop:'var(--s5)', borderTop:'1px solid var(--line)', flexWrap:'wrap' }}>
              {[{num:'3',label:'Branches across Kenya'},{num:'42k+',label:'Batteries fitted'},{num:'12mo',label:'Standard warranty'},{num:'4.9★',label:'Customer rating'}].map(s=>(
                <div key={s.num}>
                  <div style={{ fontFamily:'var(--serif)', fontSize:38, lineHeight:1 }}>{s.num}</div>
                  <div style={{ fontFamily:'var(--mono)', fontSize:10, letterSpacing:'.12em', textTransform:'uppercase', color:'var(--muted)', marginTop:4 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Battery Finder */}
      <section id="finder" style={{ background:'rgb(13,40,8)', padding:'var(--s8) 0' }}>
        <div className="container">

          {!finderResult ? (
            /* ── Form ── */
            <div className="finder-grid">
              <div>
                <span className="eyebrow no-rule" style={{ color:'var(--green-bright)' }}>Battery finder · 60 seconds</span>
                <h3 style={{ color:'#fff', marginTop:'var(--s3)' }}>Tell us your car. We'll match the right battery.</h3>
                <p style={{ color:'rgba(255,255,255,.55)', fontSize:14, marginTop:'var(--s2)' }}>Over 240 vehicle fitments mapped to in-stock SKUs.</p>
              </div>
              <form onSubmit={handleFinder} className="finder-form">
                {[
                  { label:'Make',  value:make,  onChange:e=>{setMake(e.target.value);setModel('')}, options:MAKES },
                  { label:'Model', value:model, onChange:e=>setModel(e.target.value), options:models },
                  { label:'Year',  value:year,  onChange:e=>setYear(e.target.value),  options:YEARS },
                ].map(f=>(
                  <div key={f.label} style={{ display:'flex', flexDirection:'column', gap:6 }}>
                    <label style={{ fontFamily:'var(--mono)', fontSize:10, letterSpacing:'.14em', textTransform:'uppercase', color:'rgba(255,255,255,.45)' }}>{f.label}</label>
                    <select value={f.value} onChange={f.onChange} required={f.label!=='Model'} style={{ background:'rgba(255,255,255,.06)', border:'1px solid rgba(255,255,255,.16)', color:'#fff', padding:'13px 15px', borderRadius:'var(--r)', fontFamily:'var(--sans)', fontSize:14, appearance:'none', backgroundImage:'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'10\' height=\'6\'><path fill=\'%2333d930\' d=\'M5 6L0 0h10z\'/></svg>")', backgroundRepeat:'no-repeat', backgroundPosition:'right 14px center' }}>
                      <option value="">Select {f.label}</option>
                      {f.options.map(o=><option key={o} value={o} style={{ background:'#1a1a1a' }}>{o}</option>)}
                    </select>
                  </div>
                ))}
                <button type="submit" className="btn btn-primary" style={{ height:50 }}>Find match →</button>
              </form>
            </div>
          ) : (
            /* ── Results ── */
            <div>
              {/* Header row */}
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'var(--s6)', flexWrap:'wrap', gap:'var(--s3)' }}>
                <div>
                  <span className="eyebrow no-rule" style={{ color:'var(--green-bright)' }}>Battery finder · results</span>
                  <h3 style={{ color:'#fff', marginTop:'var(--s3)' }}>
                    Best matches for your <em style={{ fontStyle:'italic', color:'var(--green-bright)' }}>{finderResult.carLabel}</em>
                  </h3>
                  <p style={{ color:'rgba(255,255,255,.5)', fontSize:13, marginTop:'var(--s2)', fontFamily:'var(--mono)', letterSpacing:'.06em', textTransform:'uppercase' }}>
                    Category · {finderResult.category}
                  </p>
                </div>
                <button onClick={resetFinder} style={{ background:'transparent', border:'1px solid rgba(255,255,255,.2)', color:'rgba(255,255,255,.7)', padding:'10px 18px', borderRadius:'var(--r)', fontSize:13, cursor:'pointer', whiteSpace:'nowrap' }}>
                  ← Search again
                </button>
              </div>

              {finderResult.picks.length > 0 ? (
                <>
                  {/* Product cards */}
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'var(--s4)', marginBottom:'var(--s6)' }}>
                    {finderResult.picks.map((p, i) => (
                      <div key={p.id} style={{ background: i === 0 ? 'rgba(15,122,61,.18)' : 'rgba(255,255,255,.05)', border: i === 0 ? '1px solid rgba(15,122,61,.5)' : '1px solid rgba(255,255,255,.1)', borderRadius:'var(--r)', padding:'var(--s5)', display:'flex', flexDirection:'column', gap:'var(--s3)' }}>
                        {i === 0 && (
                          <span style={{ fontFamily:'var(--mono)', fontSize:10, letterSpacing:'.12em', textTransform:'uppercase', color:'var(--green-bright)', marginBottom:'var(--s1)' }}>● Best match</span>
                        )}
                        <div>
                          <h4 style={{ color:'#fff', fontSize:16, fontFamily:'var(--serif)', lineHeight:1.2 }}>{p.name}</h4>
                          <p style={{ color:'rgba(255,255,255,.5)', fontSize:12, marginTop:4, lineHeight:1.45 }}>{p.short_desc}</p>
                        </div>
                        <div style={{ display:'flex', gap:'var(--s4)', fontFamily:'var(--mono)', fontSize:11, color:'rgba(255,255,255,.45)', letterSpacing:'.06em' }}>
                          {p.ah  && <span>{p.ah}Ah</span>}
                          {p.cca && <span>{p.cca} CCA</span>}
                          <span style={{ marginLeft:'auto', color:'var(--green-bright)', fontSize:14, fontWeight:600 }}>{p.price_label}</span>
                        </div>
                        <div style={{ display:'flex', gap:'var(--s2)', marginTop:'var(--s1)' }}>
                          <Link to={`/shop/${toSlug(p.name)}-${p.id}`} style={{ flex:1, textAlign:'center', padding:'10px 12px', background:'var(--green)', color:'#fff', borderRadius:'var(--r-sm)', fontSize:13, fontWeight:600, textDecoration:'none' }}>
                            View details →
                          </Link>
                          <a
                            href={`https://wa.me/${WA}?text=${encodeURIComponent(`Hi! I'd like to order the ${p.name} (${p.price_label}) for my ${finderResult.carLabel}. Please confirm availability.`)}`}
                            target="_blank" rel="noopener noreferrer"
                            style={{ padding:'10px 14px', background:'#25d366', color:'#fff', borderRadius:'var(--r-sm)', fontSize:13, fontWeight:600, textDecoration:'none', whiteSpace:'nowrap' }}
                          >
                            Order
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* WhatsApp consultation strip */}
                  <div style={{ borderTop:'1px solid rgba(255,255,255,.1)', paddingTop:'var(--s5)', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'var(--s4)' }}>
                    <div>
                      <p style={{ color:'rgba(255,255,255,.7)', fontSize:14 }}>Not sure which one is right? Our team can confirm the exact fit.</p>
                    </div>
                    <button onClick={waConsult} style={{ display:'flex', alignItems:'center', gap:10, background:'#25d366', color:'#fff', border:'none', padding:'12px 22px', borderRadius:'var(--r)', fontSize:14, fontWeight:600, cursor:'pointer', whiteSpace:'nowrap' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                      Talk to an expert
                    </button>
                  </div>
                </>
              ) : (
                /* No match — straight to WhatsApp */
                <div style={{ textAlign:'center', padding:'var(--s7) 0' }}>
                  <p style={{ color:'rgba(255,255,255,.6)', fontSize:15, marginBottom:'var(--s5)' }}>
                    We don't have an automatic match for that vehicle yet — but our team can find the right battery for you in minutes.
                  </p>
                  <button onClick={waConsult} style={{ display:'inline-flex', alignItems:'center', gap:10, background:'#25d366', color:'#fff', border:'none', padding:'14px 28px', borderRadius:'var(--r)', fontSize:15, fontWeight:600, cursor:'pointer' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                    WhatsApp consultation for my {finderResult.carLabel}
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      </section>

      {/* Categories */}
      <section id="categories" style={{ background:'var(--paper)' }}>
        <div className="container">
          <div className="section-head reveal">
            <div>
              <span className="eyebrow">Five categories · One mission</span>
              <h2 style={{ marginTop:'var(--s4)' }}>A battery for every <em style={{ fontStyle:'italic', color:'var(--green-deep)' }}>drive.</em></h2>
            </div>
            <Link to="/shop" className="btn-ghost">View full catalogue</Link>
          </div>
          <div className="cat-grid">
            {CATEGORIES.map((c,i) => (
              <Link key={c.key} to={`/shop?category=${encodeURIComponent(c.key)}`}
                className="reveal"
                style={{ '--delay':`${i*.07}s`, transitionDelay:`${i*.07}s`, background:'var(--white)', border:'1px solid var(--line)', borderRadius:'var(--r)', padding:'var(--s5)', display:'flex', flexDirection:'column', justifyContent:'space-between', minHeight:260, transition:'all .2s var(--ease-out)', cursor:'pointer', position:'relative', textDecoration:'none', color:'inherit' }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--ink)';e.currentTarget.style.transform='translateY(-4px)';e.currentTarget.style.boxShadow='var(--shadow-2)'}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--line)';e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='none'}}
              >
                <div>
                  <div style={{ fontFamily:'var(--mono)', fontSize:10, color:'var(--muted)', letterSpacing:'.14em' }}>{c.num}</div>
                  <h4 style={{ fontFamily:'var(--serif)', fontSize:24, lineHeight:1.05, margin:'var(--s3) 0 var(--s2)' }}>{c.label}</h4>
                  <p style={{ fontSize:12, color:'var(--muted)', lineHeight:1.45 }}>{c.blurb}</p>
                </div>
                <div style={{ position:'relative', marginTop:'var(--s4)', flex:1, minHeight:120, display:'flex', alignItems:'flex-end' }}>
                  <img
                    src={c.img}
                    alt={c.label}
                    style={{ width:'100%', maxHeight:160, objectFit:'contain', objectPosition:'bottom center', display:'block', filter:'drop-shadow(0 4px 12px rgba(0,0,0,.13))' }}
                  />
                  <span style={{ position:'absolute', bottom:0, right:0, fontSize:18 }}>→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section id="featured-products" style={{ position:'relative', overflow:'hidden', isolation:'isolate' }}>
        <ShaderBackground />
        <div className="container" style={{ position:'relative', zIndex:1 }}>
          <div className="section-head">
            <div>
              <span className="eyebrow no-rule" style={{ color:'var(--green-bright)' }}>Top sellers · This month</span>
              <h2 style={{ marginTop:'var(--s4)', color:'#fff' }}>Featured batteries</h2>
            </div>
            <Link to="/shop" className="btn-ghost" style={{ color:'rgba(255,255,255,.7)', borderColor:'rgba(255,255,255,.2)' }}>Shop all batteries</Link>
          </div>
          <div className="filter-pills">
            {['All','Standard','Large Car','EFB','Heavy Duty','European'].map(c=>(
              <button
                key={c}
                className={`pill${activeCat===c?' active':''}`}
                onClick={()=>setActiveCat(c)}
                style={activeCat===c
                  ? {}
                  : { background:'rgba(255,255,255,.08)', borderColor:'rgba(255,255,255,.15)', color:'rgba(255,255,255,.7)' }
                }
              >{c}</button>
            ))}
          </div>
          <div className="featured-grid">
            {featured.map(p=>(
              <Link key={p.id} to={`/shop/${toSlug(p.name)}-${p.id}`} className="product-card shader-card">
                <div className="img">
                  {p.badge && (
                    <div className="badges">
                      <span className={`badge ${p.badge.includes('Best')?'green':p.badge.includes('Save')||p.badge.includes('New')?'red':'outline'}`}>
                        {p.badge.includes('Best')||p.badge.includes('New')?'● ':''}{p.badge}
                      </span>
                    </div>
                  )}
                  {p.image
                    ? <img src={`/products/${p.image}`} alt={p.name} loading="lazy" />
                    : <div className="battery-placeholder">M</div>
                  }
                  <span className="quick-view">Quick view</span>
                </div>
                <div className="body">
                  <span className="cat">{p.category}</span>
                  <h4>{p.name}</h4>
                  <div className="specs-mini">
                    <span><b>12V</b> · {p.ah}Ah</span>
                    <span><b>{p.cca}</b> CCA</span>
                  </div>
                  <div className="footer">
                    <div className="price">
                      {p.sale_price > p.price_from && <span className="old">KES {p.sale_price.toLocaleString()}</span>}
                      KES {p.price_from.toLocaleString()}
                    </div>
                    <button className="add-btn" aria-label="Order via WhatsApp" onClick={ev=>{ev.preventDefault();window.open(`https://wa.me/${WA}?text=${encodeURIComponent(p.whatsapp_message)}`,'_blank')}}>+</button>
                  </div>
                </div>
              </Link>
            ))}
            {featured.length === 0 && Array.from({length:4}).map((_,i)=>(
              <div key={i} className="product-card shader-card" style={{ opacity:.4 }}>
                <div className="img"><div className="battery-placeholder">M</div></div>
                <div className="body"><div style={{ height:12, background:'rgba(255,255,255,.1)', borderRadius:4, marginBottom:8 }} /><div style={{ height:16, background:'rgba(255,255,255,.1)', borderRadius:4 }} /></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Maifa */}
      <section id="why" style={{ background:'var(--paper)' }}>
        <div className="container">
          <div className="section-head reveal">
            <div>
              <span className="eyebrow">Why Maifa</span>
              <h2 style={{ marginTop:'var(--s4)' }}>Sold by people who fit them.</h2>
            </div>
          </div>
          <div className="grid-2">
            <div style={{ display:'flex', flexDirection:'column' }}>
              {[
                {num:'01',title:'Free installation, no appointment',body:'Drive in to any branch and we\'ll fit your battery on the spot — usually under 12 minutes. Or we\'ll come to you anywhere in Nairobi for free.'},
                {num:'02',title:'The right size, the first time',body:'Our 60-second battery finder maps over 240 vehicle fitments to in-stock SKUs. No guesswork — bring the wrong car and we\'ll still get it right.'},
                {num:'03',title:'Trade in your old battery',body:'We pay up to KES 500 for your old battery and recycle it responsibly through our partner facility outside Athi River.'},
                {num:'04',title:'Warranty that means it',body:'Every Maifa battery is backed by a one-year warranty with a real, in-person claim process. No call centres. No lost paperwork. Just bring it in.'},
              ].map((item,i)=>(
                <div key={item.num} className={`reveal reveal-delay-${i%3+1}`} style={{ padding:'var(--s6) 0', borderTop:'1px solid var(--line)', display:'grid', gridTemplateColumns:'54px 1fr', gap:'var(--s5)', alignItems:'start' }}>
                  <div style={{ fontFamily:'var(--serif)', fontSize:34, color:'var(--green-deep)', lineHeight:1 }}>{item.num}</div>
                  <div>
                    <h4 style={{ fontFamily:'var(--serif)', fontSize:26, lineHeight:1.1, marginBottom:'var(--s3)' }}>{item.title}</h4>
                    <p style={{ fontSize:15, color:'#444', maxWidth:'none' }}>{item.body}</p>
                  </div>
                </div>
              ))}
              <div style={{ borderTop:'1px solid var(--line)' }} />
            </div>

            {/* Stats visual */}
            <div className="reveal reveal-delay-2" style={{ background:'var(--ink)', borderRadius:'var(--r-lg)', aspectRatio:'4/5', padding:'var(--s7)', color:'#fff', display:'flex', flexDirection:'column', justifyContent:'space-between', overflow:'hidden', position:'relative' }}>
              <div style={{ position:'absolute', inset:0, background:'radial-gradient(circle at 30% 70%, rgba(246,4,4,.18), transparent 50%), repeating-linear-gradient(0deg,transparent 0 22px,rgba(255,255,255,.03) 22px 23px)', pointerEvents:'none' }} />
              <div style={{ position:'relative' }}>
                <span className="eyebrow no-rule" style={{ color:'var(--green-bright)' }}>By the numbers</span>
                <h3 style={{ fontSize:46, lineHeight:1, color:'#fff', marginTop:'var(--s4)' }}>A decade of <em style={{ fontStyle:'italic', color:'var(--green-bright)' }}>powering</em> Kenyan cars.</h3>
              </div>
              <div style={{ position:'relative', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'var(--s5)', paddingTop:'var(--s5)', borderTop:'1px solid rgba(255,255,255,.1)' }}>
                {[{n:'42k+',l:'Batteries fitted since 2015'},{n:'98%',l:'Same-day delivery rate'},{n:'3',l:'Branches: Thika · Kiambu · Mombasa'},{n:'12m',l:'Warranty on every battery'}].map(s=>(
                  <div key={s.n}>
                    <div style={{ fontFamily:'var(--serif)', fontSize:54, lineHeight:1, color:'var(--green-bright)' }}>{s.n}</div>
                    <div style={{ fontFamily:'var(--mono)', fontSize:10, letterSpacing:'.12em', textTransform:'uppercase', color:'rgba(255,255,255,.45)', marginTop:5 }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Locations */}
      <section id="locations" style={{ background:'var(--white)' }}>
        <div className="container">
          <div className="section-head reveal">
            <div>
              <span className="eyebrow">Walk-in branches</span>
              <h2 style={{ marginTop:'var(--s4)' }}>Three locations. <em style={{ fontStyle:'italic', color:'var(--green-deep)' }}>One promise.</em></h2>
            </div>
          </div>
          <div className="grid-3 reveal reveal-delay-1">
            {[
              { name:'Thika Road',  hours:'Mon–Sat · 7:30am – 7:00pm', phone:'+254 791 899 602', tel:'254791899602', maps:'https://maps.app.goo.gl/uikDAKHvtGHbiFcw9', image:'/branches/thika-road.webp' },
              { name:'Kiambu Road', hours:'Mon–Sat · 7:30am – 7:00pm', phone:'+254 700 777 698', tel:'254700777698', maps:'https://maps.app.goo.gl/P87JbPsayc2Kxr7JA', image:'/branches/kiambu-road.webp' },
              { name:'Mombasa',     hours:'Mon–Sat · 8:00am – 6:30pm', phone:'+254 701 880 955', tel:'254701880955', maps:'https://maps.app.goo.gl/4axNTbqZjkyrkYLcA', image:'/branches/mombasa.webp' },
            ].map(loc=>(
              <div key={loc.name} style={{ border:'1px solid var(--line)', borderRadius:'var(--r)', overflow:'hidden', display:'flex', flexDirection:'column', transition:'border-color .2s, box-shadow .2s', cursor:'default' }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--ink)';e.currentTarget.style.boxShadow='var(--shadow-2)'}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--line)';e.currentTarget.style.boxShadow='none'}}
              >
                {/* Branch photo */}
                <div style={{ aspectRatio:'16/10', overflow:'hidden', position:'relative', background:'#e8e8e4' }}>
                  {loc.image ? (
                    <img
                      src={loc.image}
                      alt={`Maifa ${loc.name} branch`}
                      loading="lazy"
                      style={{ width:'100%', height:'100%', objectFit:'cover', display:'block', transition:'transform .4s ease' }}
                      onMouseEnter={e=>e.currentTarget.style.transform='scale(1.04)'}
                      onMouseLeave={e=>e.currentTarget.style.transform='scale(1)'}
                    />
                  ) : (
                    <div style={{ width:'100%', height:'100%', background:'linear-gradient(148deg,#031508 0%,#063d1c 45%,#0f7a3d 100%)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                      </svg>
                    </div>
                  )}
                  <span style={{ position:'absolute', top:10, left:10, background:'var(--green)', color:'#fff', fontFamily:'var(--mono)', fontSize:9, letterSpacing:'.1em', textTransform:'uppercase', padding:'4px 10px', borderRadius:'var(--r-pill)', display:'flex', alignItems:'center', gap:5 }}>
                    <span style={{ width:5, height:5, borderRadius:'50%', background:'#fff' }} />Open now
                  </span>
                </div>
                <div style={{ padding:'var(--s5)', display:'flex', flexDirection:'column', gap:'var(--s3)' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                    <div>
                      <h4 style={{ fontFamily:'var(--serif)', fontSize:22 }}>{loc.name}</h4>
                      <p style={{ fontSize:13, color:'var(--muted)', marginTop:3 }}>{loc.hours}</p>
                    </div>
                  </div>
                  <div style={{ fontFamily:'var(--mono)', fontSize:14, color:'var(--ink)', fontWeight:500 }}>{loc.phone}</div>
                  <div style={{ display:'flex', gap:'var(--s2)' }}>
                    <a href={`tel:+${loc.tel}`} style={{ flex:1, textAlign:'center', padding:10, border:'1px solid var(--line)', borderRadius:'var(--r-sm)', fontSize:13, fontWeight:500, transition:'all .15s', color:'var(--ink)', textDecoration:'none' }}
                      onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--ink)';e.currentTarget.style.background='var(--paper)'}}
                      onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--line)';e.currentTarget.style.background='transparent'}}
                    >Call</a>
                    <a href={loc.maps} target="_blank" rel="noopener noreferrer" style={{ flex:1, textAlign:'center', padding:10, background:'var(--ink)', color:'#fff', borderRadius:'var(--r-sm)', fontSize:13, fontWeight:500, textDecoration:'none' }}>Directions</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" style={{ background:'radial-gradient(ellipse 70% 60% at 10% 55%, rgba(15,122,61,.28) 0%, transparent 100%), radial-gradient(ellipse 55% 65% at 88% 25%, rgba(29,185,84,.16) 0%, transparent 100%), radial-gradient(ellipse 45% 45% at 55% 95%, rgba(15,122,61,.2) 0%, transparent 100%), #060d07', overflow:'hidden', paddingTop:'var(--s9)', paddingBottom:'var(--s9)' }}>
        <div className="container">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            style={{ display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', marginBottom:'var(--s8)' }}
          >
            <div style={{ display:'inline-flex', alignItems:'center', gap:6, border:'1px solid rgba(15,122,61,.5)', borderRadius:'var(--r-pill)', padding:'5px 16px', marginBottom:'var(--s4)' }}>
              <div style={{ display:'flex', gap:2 }}>
                {[1,2,3,4,5].map(s=>(
                  <svg key={s} width="13" height="13" viewBox="0 0 24 24" fill="#fbbc04"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                ))}
              </div>
              <span style={{ fontFamily:'var(--mono)', fontSize:11, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--green-bright)' }}>4.9 · 200+ verified drivers</span>
            </div>
            <h2 style={{ color:'#fff', fontSize:'clamp(32px,4vw,52px)', marginBottom:'var(--s4)' }}>
              What Kenyan drivers say.
            </h2>
            <p style={{ color:'rgba(255,255,255,.55)', fontSize:16, maxWidth:480, lineHeight:1.65 }}>
              Real reviews from real customers — from Nairobi's city roads to the Mombasa highway.
            </p>
          </motion.div>

          {/* Scrolling columns — fade top & bottom */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 20,
            maxHeight: 680,
            overflow: 'hidden',
            maskImage: 'linear-gradient(to bottom, transparent, black 18%, black 82%, transparent)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 18%, black 82%, transparent)',
          }}>
            {/* Column 1 — always visible */}
            <TestimonialsColumn
              testimonials={TESTIMONIALS.slice(0, 4)}
              duration={18}
            />
            {/* Column 2 — hidden on mobile */}
            <TestimonialsColumn
              testimonials={TESTIMONIALS.slice(3, 7)}
              duration={22}
              style={{ display: 'none' }}
              className="testimonials-col-2"
            />
            {/* Column 3 — hidden on tablet */}
            <TestimonialsColumn
              testimonials={TESTIMONIALS.slice(6, 10)}
              duration={20}
              style={{ display: 'none' }}
              className="testimonials-col-3"
            />
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section id="trust-bar" style={{ background:'var(--paper)', padding:'var(--s7) 0' }}>
        <div className="container">
          <div className="grid-4 reveal">
            {TRUST_ITEMS.map(item=>(
              <div key={item.name} style={{ display:'flex', gap:'var(--s4)', alignItems:'center', padding:'var(--s4) 0' }}>
                <div style={{ width:46, height:46, borderRadius:'50%', background:'var(--ink)', color:'var(--green-bright)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }} aria-hidden="true">{item.icon}</div>
                <div>
                  <div style={{ fontWeight:600, fontSize:14 }}>{item.name}</div>
                  <div style={{ fontSize:12, color:'var(--muted)' }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section id="cta-banner" style={{ background:'var(--green-deep)', color:'#fff', padding:'var(--s9) 0', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, background:'repeating-linear-gradient(45deg,transparent 0 30px,rgba(255,255,255,.03) 30px 31px)', pointerEvents:'none' }} />
        <div className="container">
          <div style={{ display:'grid', gridTemplateColumns:'1.4fr 1fr', alignItems:'center', gap:'var(--s7)', position:'relative' }}>
            <div>
              <span className="eyebrow no-rule" style={{ color:'rgba(255,255,255,.8)', fontWeight:700 }}>Need it today?</span>
              <h2 style={{ color:'#fff', fontSize:'clamp(38px,5vw,68px)', marginTop:'var(--s4)' }}>Same-day delivery + <em style={{ fontStyle:'italic', color:'var(--green-bright)' }}>free fitting</em> across Nairobi.</h2>
              <p style={{ color:'rgba(255,255,255,.82)', marginTop:'var(--s4)', fontSize:17 }}>Order before 4pm. We'll deliver, install, and take your old battery — usually within three hours.</p>
            </div>
            <div style={{ display:'flex', gap:'var(--s3)', flexWrap:'wrap', justifyContent:'flex-end' }}>
              <a href={`https://wa.me/${WA}?text=Hi! I'd like to order a battery for same-day delivery.`} target="_blank" rel="noopener noreferrer" className="btn btn-dark">Order now →</a>
              <a href="tel:+254791899602" className="btn" style={{ background:'rgba(255,255,255,.12)', color:'#fff', border:'1px solid rgba(255,255,255,.22)' }}>Call 0791 899 602</a>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <NewsletterSection />
    </PageTransition>

    {quickModal && <BatteryQuickModal onClose={() => setQuickModal(false)} />}
    </>
  )
}
