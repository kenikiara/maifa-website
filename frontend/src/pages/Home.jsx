import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useApi } from '../hooks/useApi'
import { useScrollReveal } from '../hooks/useScrollReveal'
import PageTransition from '../components/ui/PageTransition'

const WA = '254791899602'

function toSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

const CATEGORIES = [
  { num: '01', key: 'Standard',   label: 'Car Batteries Standard', blurb: 'Small-engine sedans. Lower electrical demand. Maintenance free.' },
  { num: '02', key: 'Large Car',  label: 'Large Cars',             blurb: 'SUVs and big engines. Higher draw. Built to keep up.' },
  { num: '03', key: 'EFB',        label: 'Start-Stop EFB',         blurb: 'Engineered for cars with idle-stop. Frequent restarts, no sweat.' },
  { num: '04', key: 'Heavy Duty', label: 'Heavy Duty',             blurb: 'Maximum vibration resistance. Verified for Kenyan terrain.' },
  { num: '05', key: 'European',   label: 'European',               blurb: 'High CCA. Long cycle life. For BMW, Mercedes, Audi & co.' },
]

const TESTIMONIALS = [
  { stars:5, quote: '"Booked online, fitted in twelve minutes flat at the Thika Road branch. They even took my old battery off the price."', name:'James M.', car:'Toyota Premio · 2014' },
  { stars:5, quote: '"My usual battery shop kept giving me the wrong size. Maifa\'s finder got it right first try. Two years on, still strong."', name:'Wanjiku K.', car:'Subaru Forester · 2017' },
  { stars:5, quote: '"Needed a heavy-duty unit for my Land Cruiser before a Loita Hills trip. They delivered to Karen and fit it in my driveway."', name:'David O.', car:'Land Cruiser 79 · 2020' },
]

const TRUST_ITEMS = [
  { icon:'⚡', name:'Free installation',     desc:'All Nairobi branches' },
  { icon:'🛡',  name:'1-year warranty',        desc:'Replacement guarantee' },
  { icon:'📱', name:'M-Pesa accepted',        desc:'Plus card & cash on delivery' },
  { icon:'♻', name:'Old battery trade-in',   desc:'Up to KES 1,500 off' },
]

const TICKER = [
  'Free Installation in Nairobi','Same-Day Delivery','Old Battery Trade-In Up to KES 1,500','1-Year Warranty','M-Pesa Accepted',
  'Free Installation in Nairobi','Same-Day Delivery','Old Battery Trade-In Up to KES 1,500','1-Year Warranty','M-Pesa Accepted',
]

const MAKES  = ['Toyota','Nissan','Honda','Mercedes','BMW','Subaru','Mazda','Mitsubishi','Volkswagen','Isuzu']
const MODELS = { Toyota:['Axio','Premio','Fielder','Land Cruiser','Vitz','Harrier','RAV4'], Nissan:['Note','March','X-Trail','Navara','Patrol'], Honda:['Fit','CRV','Accord'], Mercedes:['C-Class','E-Class','GLE'], BMW:['3 Series','5 Series','X5'], Subaru:['Forester','Outback','Impreza'], Mazda:['Demio','CX-5','Atenza'], Mitsubishi:['Pajero','Outlander','L200'], Volkswagen:['Golf','Touareg','Polo'], Isuzu:['D-Max','MUX'] }
const YEARS  = Array.from({length:20}, (_,i)=>(2024-i).toString())

export default function Home() {
  useScrollReveal()

  const { data } = useApi('/api/products.php')
  const products  = (data?.products || []).slice(0, 4)

  const [activeCat, setActiveCat] = useState('All')
  const { data: filteredData } = useApi(activeCat === 'All' ? '/api/products.php' : `/api/products.php?category=${encodeURIComponent(activeCat)}`)
  const featured = (filteredData?.products || []).slice(0, 4)

  const [make, setMake]   = useState('')
  const [model, setModel] = useState('')
  const [year, setYear]   = useState('')
  const models = make ? (MODELS[make] || []) : []

  function handleFinder(e) {
    e.preventDefault()
    const msg = `Hi! I'm looking for a battery for my ${year} ${make} ${model}. Please advise.`
    window.open(`https://wa.me/${WA}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  return (
    <PageTransition>
      {/* Marquee */}
      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {TICKER.map((t, i) => (
            <span key={i}><span className="dot" />{t}</span>
          ))}
        </div>
      </div>

      {/* Hero */}
      <section id="hero" style={{ padding:'var(--s7) 0 0', borderBottom:'1px solid var(--line)', overflow:'hidden' }}>
        <div className="container">
          <div style={{ display:'grid', gridTemplateColumns:'1.1fr .9fr', gap:'var(--s8)', alignItems:'end', minHeight:'76vh' }}>
            {/* Copy */}
            <div style={{ paddingBottom:'var(--s9)' }}>
              <span className="eyebrow">Maifa · Built for Kenyan roads</span>
              <h1 style={{ fontSize:'clamp(56px,8vw,112px)', lineHeight:.95, margin:'var(--s4) 0 var(--s4)' }}>
                Built for <em style={{ fontStyle:'italic', color:'var(--green-deep)' }}>Kenyan</em> roads.
              </h1>
              <p style={{ fontSize:18, color:'#333', maxWidth:480, marginBottom:'var(--s6)', lineHeight:1.6 }}>
                Maintenance-free car batteries engineered for tropical heat and rough roads. Free installation, same-day delivery across Nairobi, Kiambu and Mombasa.
              </p>
              <div style={{ display:'flex', gap:'var(--s3)', flexWrap:'wrap' }}>
                <a href="#finder" className="btn btn-primary">Find my battery <span style={{ marginLeft:4 }}>→</span></a>
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

            {/* Visual card */}
            <div style={{ position:'relative', background:'var(--ink)', borderRadius:'var(--r-lg) var(--r-lg) 0 0', minHeight:580, display:'flex', flexDirection:'column', justifyContent:'space-between', color:'#fff', padding:'var(--s7)', overflow:'hidden' }}>
              <div style={{ position:'absolute', inset:0, background:'radial-gradient(circle at 70% 30%, rgba(51,217,48,.15), transparent 50%), repeating-linear-gradient(45deg,transparent 0 14px,rgba(255,255,255,.02) 14px 15px)', pointerEvents:'none' }} />
              <div style={{ position:'relative', zIndex:1 }}>
                <span style={{ position:'absolute', top:0, right:0, background:'var(--green)', color:'#fff', padding:'7px 13px', borderRadius:'var(--r-pill)', fontFamily:'var(--mono)', fontSize:10, letterSpacing:'.1em', textTransform:'uppercase' }}>● Best seller — Hi Life NS70L</span>
                <div className="eyebrow no-rule" style={{ color:'rgba(255,255,255,.45)' }}>Featured product</div>
              </div>
              {/* Battery card */}
              <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:'55%', aspectRatio:'4/5', background:'linear-gradient(160deg,#1a1a1a,#0a0a0a)', border:'1px solid rgba(255,255,255,.1)', borderRadius:8, padding:22, display:'flex', flexDirection:'column', justifyContent:'space-between', zIndex:1 }}>
                <div style={{ position:'absolute', top:-11, left:'22%', width:'18%', height:20, background:'#2a2a2a', borderRadius:'2px 2px 0 0' }} />
                <div style={{ position:'absolute', top:-11, right:'22%', width:'18%', height:20, background:'#2a2a2a', borderRadius:'2px 2px 0 0' }} />
                <div>
                  <div style={{ fontFamily:'var(--serif)', fontSize:26, color:'var(--green-bright)' }}>Maifa</div>
                  <div style={{ fontFamily:'var(--mono)', fontSize:9, letterSpacing:'.1em', textTransform:'uppercase', color:'rgba(255,255,255,.4)', marginTop:5, display:'grid', gap:2 }}>
                    <div>HI LIFE / NS70L</div><div>MAINTENANCE FREE</div>
                  </div>
                </div>
                <div>
                  <div style={{ fontFamily:'var(--serif)', fontSize:60, lineHeight:1 }}>12V</div>
                  <div style={{ fontFamily:'var(--mono)', fontSize:10, letterSpacing:'.1em', textTransform:'uppercase', color:'rgba(255,255,255,.4)', marginTop:6 }}>65 Ah · 600 CCA</div>
                </div>
              </div>
              {/* Ticker */}
              <div style={{ position:'relative', zIndex:1, display:'flex', justifyContent:'space-between', fontFamily:'var(--mono)', fontSize:10, letterSpacing:'.14em', textTransform:'uppercase', color:'rgba(255,255,255,.4)', borderTop:'1px solid rgba(255,255,255,.1)', paddingTop:'var(--s4)' }}>
                <span>SKU: NS70L-65A</span><span>KES 17,000</span><span>IN STOCK</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Battery Finder */}
      <section id="finder" style={{ background:'rgb(13,40,8)', padding:'var(--s8) 0' }}>
        <div className="container">
          <div style={{ display:'grid', gridTemplateColumns:'1fr 2fr', gap:'var(--s7)', alignItems:'center' }}>
            <div>
              <span className="eyebrow no-rule" style={{ color:'var(--green-bright)' }}>Battery finder · 60 seconds</span>
              <h3 style={{ color:'#fff', marginTop:'var(--s3)' }}>Tell us your car. We'll match the right battery.</h3>
              <p style={{ color:'rgba(255,255,255,.55)', fontSize:14, marginTop:'var(--s2)' }}>Over 240 vehicle fitments mapped to in-stock SKUs.</p>
            </div>
            <form onSubmit={handleFinder} style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'var(--s3)', alignItems:'end' }}>
              {[
                { label:'Make', value:make, onChange:e=>{setMake(e.target.value);setModel('')}, options:MAKES },
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
          <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:'var(--s4)' }}>
            {CATEGORIES.map((c,i) => (
              <Link key={c.key} to={`/shop?category=${encodeURIComponent(c.key)}`}
                className="reveal"
                style={{ '--delay':`${i*.07}s`, transitionDelay:`${i*.07}s`, background:'var(--white)', border:'1px solid var(--line)', borderRadius:'var(--r)', padding:'var(--s5)', aspectRatio:'4/5', display:'flex', flexDirection:'column', justifyContent:'space-between', transition:'all .2s var(--ease-out)', cursor:'pointer', position:'relative', overflow:'hidden', textDecoration:'none', color:'inherit' }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--ink)';e.currentTarget.style.transform='translateY(-4px)';e.currentTarget.style.boxShadow='var(--shadow-2)'}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--line)';e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='none'}}
              >
                <div>
                  <div style={{ fontFamily:'var(--mono)', fontSize:10, color:'var(--muted)', letterSpacing:'.14em' }}>{c.num}</div>
                  <h4 style={{ fontFamily:'var(--serif)', fontSize:24, lineHeight:1.05, margin:'var(--s3) 0 var(--s2)' }}>{c.label}</h4>
                  <p style={{ fontSize:12, color:'var(--muted)', lineHeight:1.45 }}>{c.blurb}</p>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end' }}>
                  <div style={{ width:56, height:70, background:'linear-gradient(180deg,#1a1a1a,#000)', borderRadius:4, position:'relative' }}>
                    <div style={{ position:'absolute', top:-5, left:7, width:12, height:7, background:'var(--green)', borderRadius:'1px 1px 0 0' }} />
                    <div style={{ position:'absolute', top:-5, right:7, width:12, height:7, background:'var(--green)', borderRadius:'1px 1px 0 0' }} />
                  </div>
                  <span style={{ fontSize:18 }}>→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section id="featured-products" style={{ background:'var(--paper-2)' }}>
        <div className="container">
          <div className="section-head reveal">
            <div>
              <span className="eyebrow">Top sellers · This month</span>
              <h2 style={{ marginTop:'var(--s4)' }}>Featured batteries</h2>
            </div>
            <Link to="/shop" className="btn-ghost">Shop all batteries</Link>
          </div>
          <div className="filter-pills reveal reveal-delay-1">
            {['All','Standard','Large Car','EFB','Heavy Duty','European'].map(c=>(
              <button key={c} className={`pill${activeCat===c?' active':''}`} onClick={()=>setActiveCat(c)}>{c}</button>
            ))}
          </div>
          <div className="product-grid reveal reveal-delay-2" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'var(--s5)' }}>
            {featured.map(p=>(
              <Link key={p.id} to={`/shop/${toSlug(p.name)}-${p.id}`} className="product-card">
                <div className="img">
                  {p.badge && (
                    <div className="badges">
                      <span className={`badge ${p.badge.includes('Best')?'green':p.badge.includes('Save')||p.badge.includes('New')?'red':'outline'}`}>
                        {p.badge.includes('Best')||p.badge.includes('New')?'● ':''}{p.badge}
                      </span>
                    </div>
                  )}
                  {p.image
                    ? <img src={p.image} alt={p.name} loading="lazy" />
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
              <div key={i} className="product-card" style={{ opacity:.4 }}>
                <div className="img"><div className="battery-placeholder">M</div></div>
                <div className="body"><div style={{ height:12, background:'var(--line)', borderRadius:4, marginBottom:8 }} /><div style={{ height:16, background:'var(--line)', borderRadius:4 }} /></div>
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
                {num:'03',title:'Trade in your old battery',body:'We pay up to KES 1,500 for your old battery and recycle it responsibly through our partner facility outside Athi River.'},
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
              {name:'Thika Road',   hours:'Mon–Sat · 7:30am – 7:00pm', phone:'+254 791 899 602', tel:'254791899602', maps:'https://maps.app.goo.gl/uikDAKHvtGHbiFcw9'},
              {name:'Kiambu Road',  hours:'Mon–Sat · 7:30am – 7:00pm', phone:'+254 700 777 698', tel:'254700777698', maps:'https://maps.app.goo.gl/P87JbPsayc2Kxr7JA'},
              {name:'Mombasa',      hours:'Mon–Sat · 8:00am – 6:30pm', phone:'+254 701 880 955', tel:'254701880955', maps:'https://maps.app.goo.gl/4axNTbqZjkyrkYLcA'},
            ].map(loc=>(
              <div key={loc.name} style={{ border:'1px solid var(--line)', borderRadius:'var(--r)', overflow:'hidden', display:'flex', flexDirection:'column', transition:'border-color .2s' }}
                onMouseEnter={e=>e.currentTarget.style.borderColor='var(--ink)'}
                onMouseLeave={e=>e.currentTarget.style.borderColor='var(--line)'}
              >
                {/* Map placeholder */}
                <div style={{ aspectRatio:'16/10', background:'var(--paper-2)', position:'relative', overflow:'hidden' }}>
                  <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(10,10,10,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(10,10,10,.06) 1px,transparent 1px),linear-gradient(rgba(10,10,10,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(10,10,10,.03) 1px,transparent 1px)', backgroundSize:'80px 80px,80px 80px,16px 16px,16px 16px' }} />
                  <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:20, height:20, borderRadius:'50%', background:'var(--green)', boxShadow:'0 0 0 7px rgba(15,122,61,.18),0 0 0 16px rgba(15,122,61,.08)' }} />
                </div>
                <div style={{ padding:'var(--s5)', display:'flex', flexDirection:'column', gap:'var(--s3)' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                    <div>
                      <h4 style={{ fontFamily:'var(--serif)', fontSize:22 }}>{loc.name}</h4>
                      <p style={{ fontSize:13, color:'var(--muted)', marginTop:3 }}>{loc.hours}</p>
                    </div>
                    <span className="badge green"><span className="dot" />Open</span>
                  </div>
                  <div style={{ fontFamily:'var(--mono)', fontSize:14, color:'var(--ink)', fontWeight:500 }}>{loc.phone}</div>
                  <div style={{ display:'flex', gap:'var(--s2)' }}>
                    <a href={`tel:+${loc.tel}`} style={{ flex:1, textAlign:'center', padding:10, border:'1px solid var(--line)', borderRadius:'var(--r-sm)', fontSize:13, fontWeight:500, transition:'all .15s' }}
                      onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--ink)';e.currentTarget.style.background='var(--paper)'}}
                      onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--line)';e.currentTarget.style.background='transparent'}}
                    >Call</a>
                    <a href={loc.maps} target="_blank" rel="noopener noreferrer" style={{ flex:1, textAlign:'center', padding:10, background:'var(--ink)', color:'#fff', borderRadius:'var(--r-sm)', fontSize:13, fontWeight:500 }}>Directions</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" style={{ background:'var(--paper-2)' }}>
        <div className="container">
          <div className="section-head reveal">
            <div>
              <span className="eyebrow">Reviews · 4.9 / 5 average</span>
              <h2 style={{ marginTop:'var(--s4)' }}>From Kenyan drivers.</h2>
            </div>
          </div>
          <div className="grid-3 reveal reveal-delay-1">
            {TESTIMONIALS.map((t,i)=>(
              <div key={i} style={{ background:'var(--white)', borderRadius:'var(--r)', padding:'var(--s6)', display:'flex', flexDirection:'column', gap:'var(--s4)' }}>
                <div style={{ color:'#d4a017', letterSpacing:4, fontSize:14 }}>{'★'.repeat(t.stars)}</div>
                <p style={{ fontFamily:'var(--serif)', fontSize:21, lineHeight:1.35, color:'var(--ink)' }}>{t.quote}</p>
                <div style={{ display:'flex', gap:'var(--s3)', alignItems:'center', marginTop:'auto' }}>
                  <div style={{ width:40, height:40, borderRadius:'50%', background:'var(--paper-2)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--serif)', fontSize:16, color:'var(--ink)', flexShrink:0 }}>{t.name[0]}</div>
                  <div>
                    <div style={{ fontWeight:600, fontSize:14 }}>{t.name}</div>
                    <div style={{ fontSize:12, color:'var(--muted)', fontFamily:'var(--mono)' }}>{t.car}</div>
                  </div>
                </div>
              </div>
            ))}
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
      <section id="newsletter" style={{ background:'var(--ink)', color:'#fff', padding:'var(--s8) 0' }}>
        <div className="container">
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'var(--s7)', alignItems:'center' }}>
            <div>
              <span className="eyebrow no-rule" style={{ color:'var(--green-bright)' }}>Stay charged</span>
              <h3 style={{ color:'#fff', marginTop:'var(--s4)' }}>Battery tips, new arrivals, and the occasional discount.</h3>
            </div>
            <form onSubmit={e=>e.preventDefault()} style={{ display:'flex', gap:6, padding:6, background:'rgba(255,255,255,.07)', borderRadius:'var(--r)', border:'1px solid rgba(255,255,255,.1)' }}>
              <input type="email" placeholder="your@email.com" required style={{ flex:1, background:'transparent', border:'none', padding:'12px 16px', color:'#fff', fontFamily:'var(--sans)', fontSize:14, outline:'none' }} />
              <button type="submit" className="btn btn-primary" style={{ height:46, padding:'0 20px' }}>Subscribe</button>
            </form>
          </div>
        </div>
      </section>
    </PageTransition>
  )
}
