import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useScrollReveal } from '../hooks/useScrollReveal'

const WA = '254791899602'

const BRANCHES = [
  {
    id: 1,
    name: 'Thika Road',
    area: 'Nairobi',
    address: 'Amaron Battery Kenya – Nairobi, Thika Road',
    phone: '+254 791 899 602',
    tel: '+254791899602',
    wa: '254791899602',
    hours: { weekday: 'Mon – Sat', time: '7:30 am – 7:00 pm' },
    open: true,
    maps: 'https://maps.app.goo.gl/uikDAKHvtGHbiFcw9',
    embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2402.167556337681!2d36.869916798464736!3d-1.2315114999999968!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f15c42e8ba0c5%3A0x2972a910aadc2d85!2sAmaron%20Battery%20Kenya%20-%20Nairobi%20-%20Thika%20Road!5e1!3m2!1sen!2ske!4v1779619483929!5m2!1sen!2ske',
    image: '/branches/thika-road.png',
    services: ['Free Installation', 'Battery Testing', 'Trade-in', 'Same-Day Delivery'],
  },
  {
    id: 2,
    name: 'Kiambu Road',
    area: 'Nairobi',
    address: 'Amaron Battery Kenya – Nairobi, Kiambu Road',
    phone: '+254 700 777 698',
    tel: '+254700777698',
    wa: '254700777698',
    hours: { weekday: 'Mon – Sat', time: '7:30 am – 7:00 pm' },
    open: true,
    maps: 'https://maps.app.goo.gl/P87JbPsayc2Kxr7JA',
    embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4804.382198714865!2d36.830105011306934!3d-1.2051069355392965!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f3dfed29304b3%3A0x9c08e8eb6fc4cfbe!2sAmaron%20Battery%20Kenya%20-%20Nairobi%20-%20Kiambu%20Road!5e1!3m2!1sen!2ske!4v1779620683887!5m2!1sen!2ske',
    image: '/branches/kiambu-road.png',
    services: ['Free Installation', 'Battery Testing', 'Trade-in', 'Same-Day Delivery'],
  },
  {
    id: 3,
    name: 'Mombasa',
    area: 'Mombasa',
    address: 'Amaron Battery Kenya – Mombasa',
    phone: '+254 701 880 955',
    tel: '+254701880955',
    wa: '254701880955',
    hours: { weekday: 'Mon – Sat', time: '8:00 am – 6:30 pm' },
    open: true,
    maps: 'https://maps.app.goo.gl/4axNTbqZjkyrkYLcA',
    embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2457686.498809158!2d36.94228027099616!3d-2.6851557360990097!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1840133e6ef16e5d%3A0x3141049c92fce55a!2sAmaron%20Battery%20Kenya%20-%20Mombasa!5e1!3m2!1sen!2ske!4v1779620624932!5m2!1sen!2ske',
    image: '/branches/mombasa.png',
    services: ['Free Installation', 'Battery Testing', 'Trade-in'],
  },
]

function BranchCard({ branch, active, onSelect }) {
  return (
    <div
      onClick={onSelect}
      style={{
        border: `2px solid ${active ? 'var(--ink)' : 'var(--line)'}`,
        borderRadius: 'var(--r-lg)',
        overflow: 'hidden',
        background: 'var(--white)',
        cursor: 'pointer',
        transition: 'border-color .2s, box-shadow .2s',
        boxShadow: active ? 'var(--shadow-2)' : 'none',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Photo or Map */}
      <div style={{ position: 'relative', height: 220, flexShrink: 0, background: '#e8e8e4' }}>
        {branch.image ? (
          <img
            src={branch.image}
            alt={`${branch.name} branch`}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <iframe
            src={branch.embed}
            title={`Map — ${branch.name}`}
            width="100%" height="100%"
            style={{ position: 'absolute', inset: 0, border: 0, filter: 'grayscale(15%) contrast(1.05)' }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        )}
        {/* Open badge overlay */}
        <span style={{
          position: 'absolute', top: 12, left: 12,
          background: branch.open ? 'var(--green)' : 'var(--muted)',
          color: '#fff',
          fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase',
          padding: '4px 10px', borderRadius: 'var(--r-pill)',
          display: 'flex', alignItems: 'center', gap: 5, zIndex: 2,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff' }} />
          {branch.open ? 'Open now' : 'Closed'}
        </span>
      </div>

      {/* Info */}
      <div style={{ padding: 'var(--s5)', display: 'flex', flexDirection: 'column', gap: 'var(--s3)', flex: 1 }}>
        {/* Name + area */}
        <div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 4 }}>
            Branch {String(branch.id).padStart(2, '0')}
          </div>
          <h3 style={{ fontFamily: 'var(--serif)', fontSize: 26, lineHeight: 1.05 }}>{branch.name}</h3>
          <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 3 }}>{branch.address}</p>
        </div>

        <div style={{ height: 1, background: 'var(--line)' }} />

        {/* Hours */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 3 }}>Hours</div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 13, fontWeight: 600 }}>{branch.hours.weekday}</div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--muted)' }}>{branch.hours.time}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 3 }}>Phone</div>
            <a href={`tel:${branch.tel}`} style={{ fontFamily: 'var(--mono)', fontSize: 14, fontWeight: 700, color: 'var(--ink)' }} onClick={e => e.stopPropagation()}>
              {branch.phone}
            </a>
          </div>
        </div>

        {/* Services */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {branch.services.map(s => (
            <span key={s} style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '.06em', textTransform: 'uppercase', padding: '3px 8px', border: '1px solid var(--line)', borderRadius: 'var(--r-pill)', color: 'var(--muted)' }}>
              {s}
            </span>
          ))}
        </div>

        <div style={{ height: 1, background: 'var(--line)' }} />

        {/* Action buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--s2)' }}>
          <a
            href={`https://wa.me/${branch.wa}?text=${encodeURIComponent(`Hi! I'd like to enquire about batteries at your ${branch.name} branch.`)}`}
            target="_blank" rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, background: '#25d366', color: '#fff', borderRadius: 'var(--r-sm)', padding: '11px 12px', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
            WhatsApp
          </a>
          <a
            href={branch.maps}
            target="_blank" rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, background: 'var(--ink)', color: '#fff', borderRadius: 'var(--r-sm)', padding: '11px 12px', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
            Directions
          </a>
        </div>
      </div>
    </div>
  )
}

export default function Locations() {
  useScrollReveal()
  const [activeBranch, setActiveBranch] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  function set(field) {
    return e => setForm(prev => ({ ...prev, [field]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSending(true)
    setError('')
    const subject = activeBranch ? `Enquiry — ${BRANCHES.find(b => b.id === activeBranch)?.name} branch` : 'General enquiry'
    try {
      const res = await fetch('/api/contact.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, subject }),
      })
      const data = await res.json()
      if (data.ok) setSent(true)
      else setError(data.error || 'Failed to send. Please try again.')
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setSending(false)
    }
  }

  const selectedBranch = BRANCHES.find(b => b.id === activeBranch)

  return (
    <>
      {/* Page head */}
      <section className="page-head">
        <div className="container">
          <div className="crumbs"><Link to="/">Home</Link> / <span>Locations</span></div>
          <h1>Find us.</h1>
          <div className="meta">
            <p>Three branches across Kenya — walk in or reach us directly on WhatsApp.</p>
            <div style={{ display: 'flex', gap: 'var(--s2)', flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)', letterSpacing: '.08em' }}>
                MON – SAT &nbsp;·&nbsp; 7:30AM – 7PM
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick-select tabs */}
      <div style={{ borderBottom: '1px solid var(--line)', background: 'var(--white)', position: 'sticky', top: 'var(--nav-h)', zIndex: 30 }}>
        <div className="container">
          <div style={{ display: 'flex', gap: 'var(--s6)', overflow: 'auto', scrollbarWidth: 'none' }}>
            <button
              onClick={() => setActiveBranch(null)}
              style={{ padding: 'var(--s4) 0', fontFamily: 'var(--serif)', fontSize: 18, color: activeBranch === null ? 'var(--ink)' : 'var(--muted)', borderBottom: `3px solid ${activeBranch === null ? 'var(--ink)' : 'transparent'}`, marginBottom: -1, whiteSpace: 'nowrap', cursor: 'pointer', background: 'none', border: 'none', transition: 'color .15s' }}
            >
              All branches
            </button>
            {BRANCHES.map(b => (
              <button
                key={b.id}
                onClick={() => setActiveBranch(b.id)}
                style={{ padding: 'var(--s4) 0', fontFamily: 'var(--serif)', fontSize: 18, color: activeBranch === b.id ? 'var(--ink)' : 'var(--muted)', borderBottom: `3px solid ${activeBranch === b.id ? 'var(--ink)' : 'transparent'}`, marginBottom: -1, whiteSpace: 'nowrap', cursor: 'pointer', background: 'none', border: 'none', transition: 'color .15s' }}
              >
                {b.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Branch cards */}
      <section style={{ background: 'var(--paper)' }}>
        <div className="container">
          <div className="grid-3 reveal">
            {BRANCHES.map(b => (
              <BranchCard
                key={b.id}
                branch={b}
                active={activeBranch === b.id}
                onSelect={() => setActiveBranch(prev => prev === b.id ? null : b.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Selected branch spotlight */}
      {selectedBranch && (
        <section style={{ background: 'var(--ink)', padding: 'var(--s8) 0' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--s8)', alignItems: 'center' }}>
              <div>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--green-bright)' }}>Selected branch</span>
                <h2 style={{ color: '#fff', marginTop: 'var(--s3)', marginBottom: 'var(--s4)' }}>{selectedBranch.name}</h2>
                <p style={{ color: 'rgba(255,255,255,.6)', fontSize: 15, marginBottom: 'var(--s6)', lineHeight: 1.6 }}>
                  {selectedBranch.address} &mdash; {selectedBranch.hours.weekday} {selectedBranch.hours.time}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s4)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s4)' }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--green-bright)" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.81 19.79 19.79 0 01.11 2.21 2 2 0 012.11.02h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/></svg>
                    </div>
                    <div>
                      <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,.4)', marginBottom: 2 }}>Call direct</div>
                      <a href={`tel:${selectedBranch.tel}`} style={{ fontFamily: 'var(--mono)', fontSize: 18, fontWeight: 700, color: '#fff' }}>{selectedBranch.phone}</a>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s4)' }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--green-bright)" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    </div>
                    <div>
                      <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,.4)', marginBottom: 2 }}>Address</div>
                      <span style={{ fontSize: 15, color: '#fff' }}>{selectedBranch.address}</span>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 'var(--s3)', marginTop: 'var(--s6)', flexWrap: 'wrap' }}>
                  <a
                    href={`https://wa.me/${selectedBranch.wa}?text=${encodeURIComponent(`Hi! I'd like to enquire about batteries at your ${selectedBranch.name} branch.`)}`}
                    target="_blank" rel="noopener noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#25d366', color: '#fff', padding: '13px 22px', borderRadius: 'var(--r)', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                    WhatsApp this branch
                  </a>
                  <a
                    href={selectedBranch.maps}
                    target="_blank" rel="noopener noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,.1)', color: '#fff', padding: '13px 22px', borderRadius: 'var(--r)', fontSize: 14, fontWeight: 600, textDecoration: 'none', border: '1px solid rgba(255,255,255,.15)' }}
                  >
                    Get directions →
                  </a>
                </div>
              </div>

              {/* Branch photo + map */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s4)' }}>
                {selectedBranch.image && (
                  <div style={{ borderRadius: 'var(--r-lg)', overflow: 'hidden', height: 220 }}>
                    <img
                      src={selectedBranch.image}
                      alt={`${selectedBranch.name} branch`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  </div>
                )}
                <div style={{ borderRadius: 'var(--r-lg)', overflow: 'hidden', flex: 1, minHeight: selectedBranch.image ? 160 : 380 }}>
                  <iframe
                    src={selectedBranch.embed}
                    title={`Map — ${selectedBranch.name}`}
                    width="100%" height="100%"
                    style={{ border: 0, display: 'block', minHeight: selectedBranch.image ? 160 : 380 }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Contact / Enquiry */}
      <section style={{ background: 'var(--white)' }}>
        <div className="container">
          <div className="contact-grid">

            {/* Form */}
            <div>
              <span className="eyebrow">Send a message</span>
              <h2 style={{ marginTop: 'var(--s4)', marginBottom: 'var(--s6)' }}>We'll get back to you fast.</h2>

              {sent ? (
                <div style={{ background: 'var(--paper)', border: '1.5px solid var(--green)', borderRadius: 'var(--r-lg)', padding: 'var(--s6)', textAlign: 'center' }}>
                  <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--s4)' }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <h3 style={{ fontSize: 22, marginBottom: 'var(--s3)' }}>Message sent!</h3>
                  <p style={{ color: 'var(--muted)', fontSize: 14 }}>We'll respond within one business hour. For urgent needs, WhatsApp is fastest.</p>
                  <button className="btn btn-secondary" style={{ marginTop: 'var(--s5)' }} onClick={() => { setSent(false); setForm({ name: '', email: '', phone: '', message: '' }) }}>
                    Send another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s4)' }}>
                  {/* Branch selector */}
                  <div className="field">
                    <label>Which branch? <span style={{ color: 'var(--muted)', fontWeight: 400 }}>(optional)</span></label>
                    <select value={activeBranch ?? ''} onChange={e => setActiveBranch(e.target.value ? Number(e.target.value) : null)}>
                      <option value="">Any branch / general enquiry</option>
                      {BRANCHES.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--s4)' }}>
                    <div className="field">
                      <label>Name <span className="req">*</span></label>
                      <input type="text" placeholder="Your name" value={form.name} onChange={set('name')} required />
                    </div>
                    <div className="field">
                      <label>Phone</label>
                      <input type="tel" placeholder="+254 7XX XXX XXX" value={form.phone} onChange={set('phone')} />
                    </div>
                  </div>
                  <div className="field">
                    <label>Email <span className="req">*</span></label>
                    <input type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} required />
                  </div>
                  <div className="field">
                    <label>Message <span className="req">*</span></label>
                    <textarea rows={4} placeholder="Tell us what you need…" value={form.message} onChange={set('message')} required style={{ minHeight: 120 }} />
                  </div>
                  {error && (
                    <div style={{ background: '#fefce8', border: '1.5px solid #d97706', borderRadius: 'var(--r)', padding: 'var(--s4)', color: '#92400e', fontSize: 14 }}>
                      {error}
                    </div>
                  )}
                  <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }} disabled={sending}>
                    {sending ? 'Sending…' : 'Send message →'}
                  </button>
                </form>
              )}
            </div>

            {/* Side info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s5)' }}>

              {/* WhatsApp fastest */}
              <a
                href={`https://wa.me/${WA}?text=Hi! I need help finding the right battery.`}
                target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: 'var(--s4)', padding: 'var(--s4) var(--s5)', background: '#25d366', color: '#fff', borderRadius: 'var(--r-lg)', textDecoration: 'none', fontWeight: 600 }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                <div>
                  <div style={{ fontSize: 15 }}>WhatsApp — fastest response</div>
                  <div style={{ fontSize: 12, opacity: .85, fontFamily: 'var(--mono)' }}>0791 899 602</div>
                </div>
              </a>

              {/* All branches summary */}
              <div>
                <h3 style={{ fontFamily: 'var(--serif)', fontSize: 20, marginBottom: 'var(--s4)' }}>All branches</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s3)' }}>
                  {BRANCHES.map(b => (
                    <div
                      key={b.id}
                      style={{ background: 'var(--paper)', borderRadius: 'var(--r)', padding: 'var(--s4) var(--s5)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--s4)', cursor: 'pointer', border: `1.5px solid ${activeBranch === b.id ? 'var(--ink)' : 'var(--line)'}`, transition: 'border-color .15s' }}
                      onClick={() => { setActiveBranch(b.id); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                    >
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{b.name}</div>
                        <a href={`tel:${b.tel}`} style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--muted)' }} onClick={e => e.stopPropagation()}>{b.phone}</a>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)', letterSpacing: '.08em' }}>{b.hours.time}</div>
                        <a href={b.maps} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: 'var(--green)', fontWeight: 500 }} onClick={e => e.stopPropagation()}>Directions →</a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hours note */}
              <div style={{ background: 'var(--ink)', borderRadius: 'var(--r-lg)', padding: 'var(--s5)', color: '#fff' }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--green-bright)', marginBottom: 'var(--s3)' }}>Opening hours</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s3)' }}>
                  {[
                    { day: 'Monday – Saturday', time: '7:30 am – 7:00 pm' },
                    { day: 'Sunday', time: 'Closed' },
                    { day: 'Public Holidays', time: 'Call to confirm' },
                  ].map(row => (
                    <div key={row.day} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, borderTop: '1px solid rgba(255,255,255,.08)', paddingTop: 'var(--s3)' }}>
                      <span style={{ color: 'rgba(255,255,255,.6)' }}>{row.day}</span>
                      <span style={{ fontFamily: 'var(--mono)', fontWeight: 600 }}>{row.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  )
}
