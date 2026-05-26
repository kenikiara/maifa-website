import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useScrollReveal } from '../hooks/useScrollReveal'

const BRANCHES = [
  {
    name: 'Thika Road',
    address: 'Thika Road, Nairobi',
    phone: '+254 791 899 602',
    tel: '+254791899602',
    hours: 'Mon–Sat 7:30–19:00',
    maps: 'https://maps.google.com/?q=Maifa+Thika+Road+Nairobi',
  },
  {
    name: 'Kiambu Road',
    address: 'Kiambu Road, Nairobi',
    phone: '+254 700 777 698',
    tel: '+254700777698',
    hours: 'Mon–Sat 7:30–19:00',
    maps: 'https://maps.google.com/?q=Maifa+Kiambu+Road+Nairobi',
  },
  {
    name: 'Mombasa',
    address: 'Mombasa, Kenya',
    phone: '+254 701 880 955',
    tel: '+254701880955',
    hours: 'Mon–Sat 7:30–19:00',
    maps: 'https://maps.google.com/?q=Maifa+Mombasa',
  },
]

export default function Contact() {
  useScrollReveal()
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent]       = useState(false)
  const [error, setError]     = useState('')

  function set(field) {
    return e => setForm(prev => ({ ...prev, [field]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSending(true)
    setError('')
    try {
      const res = await fetch('/api/contact.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.success) setSent(true)
      else setError(data.error || 'Failed to send message. Please try again.')
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      <section className="page-head">
        <div className="container">
          <div className="crumbs"><Link to="/">Home</Link> / <span>Contact</span></div>
          <h1>Get in touch.</h1>
          <div className="meta">
            <p>We're at any of three branches, Mon–Sat 7:30–19:00. WhatsApp for fastest response.</p>
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="contact-grid">

            {/* Form */}
            <div>
              <h2 style={{ fontSize: 'clamp(28px,3vw,40px)', marginBottom: 'var(--s6)' }}>Send us a message.</h2>

              {sent ? (
                <div style={{ background: 'var(--paper)', border: '1.5px solid var(--green)', borderRadius: 'var(--r-lg)', padding: 'var(--s6)', textAlign: 'center' }}>
                  <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--s4)' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <h3 style={{ fontSize: 22, marginBottom: 'var(--s3)' }}>Message received!</h3>
                  <p style={{ color: 'var(--muted)', fontSize: 14 }}>We'll respond within one business hour. For urgent needs, WhatsApp is fastest.</p>
                  <button className="btn btn-secondary" style={{ marginTop: 'var(--s5)' }} onClick={() => { setSent(false); setForm({ name: '', email: '', phone: '', subject: '', message: '' }) }}>
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s4)' }}>
                  {error && (
                    <div style={{ background: '#fefce8', border: '1.5px solid #d97706', borderRadius: 'var(--r)', padding: 'var(--s4)', color: '#92400e', fontSize: 14 }}>
                      {error}
                    </div>
                  )}
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
                    <label>Subject</label>
                    <input type="text" placeholder="What's this about?" value={form.subject} onChange={set('subject')} />
                  </div>
                  <div className="field">
                    <label>Message <span className="req">*</span></label>
                    <textarea rows={5} placeholder="Tell us what you need…" value={form.message} onChange={set('message')} required style={{ minHeight: 140 }} />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }} disabled={sending}>
                    {sending ? 'Sending…' : 'Send message →'}
                  </button>
                </form>
              )}
            </div>

            {/* Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s5)' }}>
              <div>
                <h3 style={{ fontSize: 22, marginBottom: 'var(--s5)' }}>Or reach us directly</h3>

                <a
                  href="https://wa.me/254791899602?text=Hi! I need help with a battery."
                  target="_blank" rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: 'var(--s4)', padding: 'var(--s4) var(--s5)', background: '#25d366', color: '#fff', borderRadius: 'var(--r-lg)', marginBottom: 'var(--s4)', textDecoration: 'none', transition: 'background .15s', fontWeight: 600 }}
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  <div>
                    <div style={{ fontSize: 15 }}>WhatsApp us — fastest response</div>
                    <div style={{ fontSize: 13, opacity: .85 }}>0791 899 602</div>
                  </div>
                </a>
              </div>

              <div>
                <h3 style={{ fontSize: 20, marginBottom: 'var(--s4)' }}>Branches</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s3)' }}>
                  {BRANCHES.map(b => (
                    <div key={b.name} style={{ background: 'var(--white)', border: '1px solid var(--line)', borderRadius: 'var(--r-lg)', padding: 'var(--s5)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--s3)' }}>
                        <div>
                          <h4 style={{ fontFamily: 'var(--sans)', fontSize: 15, fontWeight: 600 }}>{b.name}</h4>
                          <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>{b.address}</p>
                        </div>
                        <span style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--green)', background: 'rgba(15,122,61,.08)', padding: '3px 8px', borderRadius: 'var(--r-pill)' }}>Open</span>
                      </div>
                      <div style={{ display: 'flex', gap: 'var(--s3)', flexWrap: 'wrap' }}>
                        <a href={`tel:${b.tel}`} style={{ fontFamily: 'var(--mono)', fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{b.phone}</a>
                        <span style={{ color: 'var(--line)' }}>·</span>
                        <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)', letterSpacing: '.06em', paddingTop: 2 }}>{b.hours}</span>
                      </div>
                      <div style={{ marginTop: 'var(--s3)' }}>
                        <a href={b.maps} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: 'var(--green)', fontWeight: 500 }}>
                          Get directions →
                        </a>
                      </div>
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
