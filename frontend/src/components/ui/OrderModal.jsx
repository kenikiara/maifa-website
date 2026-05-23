import { useState, useEffect } from 'react'

const WA = '254791899602'

export default function OrderModal({ product, onClose }) {
  const [name, setName]       = useState('')
  const [phone, setPhone]     = useState('')
  const [area, setArea]       = useState('')
  const [notes, setNotes]     = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone]       = useState(null)  // { orderId }
  const [error, setError]     = useState('')

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  // Close on Escape
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  if (!product) return null

  const displayPrice = product.price_label || `KES ${Number(product.price_from).toLocaleString()}`
  const productUrl   = `https://maifa.ke/shop/${product.id}`

  function validate() {
    if (!name.trim())  return 'Please enter your name.'
    if (!phone.trim()) return 'Please enter your phone number.'
    if (!area.trim())  return 'Please enter your location / area.'
    return ''
  }

  // ── WhatsApp order ────────────────────────────────────
  function handleWhatsApp() {
    const err = validate()
    if (err) { setError(err); return }
    setError('')

    const msg = [
      `Hi Maifa! 🔋 I'd like to order a battery.`,
      ``,
      `*Battery Details:*`,
      `• Product: ${product.name}`,
      product.sku ? `• SKU: ${product.sku}` : '',
      `• Price: ${displayPrice}`,
      `• Link: ${productUrl}`,
      ``,
      `*My Details:*`,
      `• Name: ${name.trim()}`,
      `• Phone: ${phone.trim()}`,
      `• Location: ${area.trim()}`,
      notes.trim() ? `• Notes: ${notes.trim()}` : '',
      ``,
      `Please confirm availability and arrange delivery. Thank you!`,
    ].filter(l => l !== '').join('\n')

    window.open(`https://wa.me/${WA}?text=${encodeURIComponent(msg)}`, '_blank')
    onClose()
  }

  // ── Online order ──────────────────────────────────────
  async function handleOnline() {
    const err = validate()
    if (err) { setError(err); return }
    setError('')
    setSubmitting(true)

    try {
      const res = await fetch('/api/orders.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id:     product.id,
          customer_name:  name.trim(),
          customer_phone: phone.trim(),
          customer_area:  area.trim(),
          notes:          notes.trim(),
        }),
      })
      const data = await res.json()
      if (data.success) {
        setDone({ orderId: data.data?.order_id })
      } else {
        setError(data.error || 'Something went wrong. Please try again.')
      }
    } catch {
      setError('Network error. Please check your connection.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">

        {/* Header */}
        <div className="modal-header">
          <div>
            <p style={{ fontSize: 11, fontFamily: 'var(--mono)', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 4 }}>
              Ordering
            </p>
            <h3 style={{ fontFamily: 'var(--serif)', fontSize: 20, lineHeight: 1.2 }}>{product.name}</h3>
            <p style={{ color: 'var(--green)', fontFamily: 'var(--serif)', fontSize: 18, marginTop: 4 }}>{displayPrice}</p>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {done ? (
          /* ── Success state ── */
          <div className="modal-body" style={{ textAlign: 'center', padding: 'var(--s7) var(--s5)' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(15,122,61,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--s5)' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <h3 style={{ fontFamily: 'var(--serif)', fontSize: 24, marginBottom: 'var(--s3)' }}>Order Received!</h3>
            <p style={{ color: 'var(--muted)', marginBottom: 'var(--s5)', lineHeight: 1.7 }}>
              Order <strong>#{done.orderId}</strong> is confirmed. Our team will call you on <strong>{phone}</strong> to arrange delivery to <strong>{area}</strong>.
            </p>
            <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 'var(--s6)' }}>
              You can also reach us on WhatsApp if you have questions.
            </p>
            <div style={{ display: 'flex', gap: 'var(--s3)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a
                href={`https://wa.me/${WA}?text=${encodeURIComponent(`Hi Maifa! I just placed order #${done.orderId} for ${product.name}. Can you confirm?`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{ background: '#25d366', borderColor: '#25d366' }}
              >
                Follow up on WhatsApp
              </a>
              <button className="btn btn-secondary" onClick={onClose}>Close</button>
            </div>
          </div>
        ) : (
          /* ── Form ── */
          <div className="modal-body">
            <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 'var(--s5)' }}>
              Fill in your details — then choose how you'd like to order.
            </p>

            <div className="modal-form">
              <div className="modal-field">
                <label>Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. John Kamau"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  autoComplete="name"
                />
              </div>

              <div className="modal-field">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  placeholder="e.g. 0712 345 678"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  autoComplete="tel"
                />
              </div>

              <div className="modal-field" style={{ gridColumn: '1 / -1' }}>
                <label>Your Location / Area *</label>
                <input
                  type="text"
                  placeholder="e.g. Westlands, Karen, Thika Road..."
                  value={area}
                  onChange={e => setArea(e.target.value)}
                />
              </div>

              <div className="modal-field" style={{ gridColumn: '1 / -1' }}>
                <label>Notes <span style={{ color: 'var(--muted)', fontWeight: 400 }}>(optional)</span></label>
                <textarea
                  rows={2}
                  placeholder="e.g. Preferred delivery time, car model, gate instructions..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <p style={{ color: '#92400e', fontSize: 13, marginTop: 'var(--s3)', fontFamily: 'var(--mono)', background: '#fefce8', border: '1px solid #d97706', borderRadius: 'var(--r)', padding: 'var(--s3) var(--s4)' }}>
                ⚠ {error}
              </p>
            )}

            {/* Action buttons */}
            <div className="modal-actions">
              <button
                className="modal-btn-wa"
                onClick={handleWhatsApp}
                disabled={submitting}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                Order via WhatsApp
              </button>

              <button
                className="modal-btn-online"
                onClick={handleOnline}
                disabled={submitting}
              >
                {submitting ? 'Placing order…' : 'Place Order Online'}
              </button>
            </div>

            <p style={{ fontSize: 12, color: 'var(--muted)', textAlign: 'center', marginTop: 'var(--s4)', lineHeight: 1.6 }}>
              No payment required now — our team will contact you to confirm and arrange delivery.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
