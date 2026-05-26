import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'

const WA = '254791899602'

const MAKES = ['Toyota', 'Nissan', 'Honda', 'Mercedes', 'BMW', 'Subaru', 'Mazda', 'Mitsubishi', 'Volkswagen', 'Isuzu', 'Other']
const MODELS = {
  Toyota:      ['Axio', 'Premio', 'Fielder', 'Land Cruiser', 'Vitz', 'Harrier', 'RAV4', 'Hilux', 'Prius'],
  Nissan:      ['Note', 'March', 'X-Trail', 'Navara', 'Patrol', 'Juke'],
  Honda:       ['Fit', 'CR-V', 'Accord', 'Civic'],
  Mercedes:    ['C-Class', 'E-Class', 'GLE', 'GLC', 'A-Class'],
  BMW:         ['3 Series', '5 Series', 'X5', 'X3', '1 Series'],
  Subaru:      ['Forester', 'Outback', 'Impreza', 'XV'],
  Mazda:       ['Demio', 'CX-5', 'Atenza', 'CX-3'],
  Mitsubishi:  ['Pajero', 'Outlander', 'L200', 'Eclipse Cross'],
  Volkswagen:  ['Golf', 'Touareg', 'Polo', 'Tiguan'],
  Isuzu:       ['D-Max', 'MU-X'],
  Other:       ['Other model'],
}

const NEEDS = [
  { value: 'battery_replacement', label: "Replace my battery — it's dead or weak" },
  { value: 'battery_test',        label: 'Test if my battery is failing' },
  { value: 'advice',              label: 'Not sure — I need advice' },
]

export default function BatteryQuickModal({ onClose }) {
  const [make, setMake]   = useState('')
  const [model, setModel] = useState('')
  const [need, setNeed]   = useState('')
  const [name, setName]   = useState('')

  const models = make ? (MODELS[make] || []) : []

  // Close on Escape
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  function handleSubmit(e) {
    e.preventDefault()
    const vehicle = [make, model !== 'Other model' ? model : ''].filter(Boolean).join(' ') || 'my vehicle'
    const needLabel = NEEDS.find(n => n.value === need)?.label || need
    const greeting = name.trim() ? `Hi, my name is ${name.trim()}. ` : 'Hi! '
    const msg = `${greeting}I drive a ${vehicle} and I need help with: ${needLabel}. Can you assist me?`
    window.open(`https://wa.me/${WA}?text=${encodeURIComponent(msg)}`, '_blank')
    onClose()
  }

  const canSubmit = make && need

  return createPortal(
    <div
      className="modal-overlay"
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{ alignItems: 'center' }}
    >
      <div className="modal-box" style={{ maxWidth: 480, width: '100%' }}>

        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
              </svg>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--serif)', fontSize: 20, lineHeight: 1.1 }}>Find the right battery</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--mono)', marginTop: 2 }}>Takes about 30 seconds</div>
            </div>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="modal-body modal-form" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s4)' }}>

          {/* Vehicle */}
          <div>
            <label style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: 8 }}>
              Your vehicle
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--s3)' }}>
              <div className="field" style={{ margin: 0 }}>
                <select value={make} onChange={e => { setMake(e.target.value); setModel('') }} required>
                  <option value="">Make</option>
                  {MAKES.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div className="field" style={{ margin: 0 }}>
                <select value={model} onChange={e => setModel(e.target.value)} disabled={!make}>
                  <option value="">Model</option>
                  {models.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* What they need */}
          <div>
            <label style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: 8 }}>
              What do you need?
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {NEEDS.map(n => (
                <label
                  key={n.value}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '12px 16px',
                    border: `1.5px solid ${need === n.value ? 'var(--green)' : 'var(--line)'}`,
                    borderRadius: 'var(--r)',
                    cursor: 'pointer',
                    background: need === n.value ? 'rgba(15,122,61,.06)' : 'var(--white)',
                    transition: 'border-color .15s, background .15s',
                    fontSize: 14,
                    lineHeight: 1.4,
                  }}
                >
                  <input
                    type="radio"
                    name="need"
                    value={n.value}
                    checked={need === n.value}
                    onChange={() => setNeed(n.value)}
                    style={{ accentColor: 'var(--green)', flexShrink: 0 }}
                  />
                  {n.label}
                </label>
              ))}
            </div>
          </div>

          {/* Name — optional */}
          <div className="field" style={{ margin: 0 }}>
            <label>
              Your name <span style={{ color: 'var(--muted)', fontWeight: 400, fontSize: 12 }}>(optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. James"
              value={name}
              onChange={e => setName(e.target.value)}
              maxLength={40}
            />
          </div>

          {/* Submit */}
          <div style={{ paddingTop: 'var(--s2)' }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!canSubmit}
              style={{ width: '100%', justifyContent: 'center', height: 50, fontSize: 15, opacity: canSubmit ? 1 : .45, cursor: canSubmit ? 'pointer' : 'not-allowed' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: 8 }}>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              Send enquiry on WhatsApp
            </button>
            <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--mono)', marginTop: 10, letterSpacing: '.04em' }}>
              Free advice · No commitment · We reply within minutes
            </p>
          </div>

        </form>
      </div>
    </div>,
    document.body
  )
}
