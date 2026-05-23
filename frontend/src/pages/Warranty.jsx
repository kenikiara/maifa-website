import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'

const CITIES = ['Nairobi', 'Mombasa', 'Kiambu', 'Nakuru', 'Eldoret', 'Kisumu', 'Thika', 'Other']
const BATTERY_MODELS = [
  'Amaron Hi Life NS70L (95D26L) — 65Ah',
  'Amaron Hi Life NS40 42B20L — 35Ah',
  'Amaron Hi Life 55B24L — 45Ah',
  'Amaron Flo 600 CCA 95D26L',
  'Amaron Onyx EFB 660 CCA',
  'Amaron N95 (125D31R) — 95Ah',
  'Amaron Pro 900 CCA H8 DIN100L',
  'Amaron N80 Hi-Way 80Ah',
  'Amaron T110 850 CCA 145D31L',
  'Other / not sure',
]
const BRANCHES = [
  'Maifa — Thika Road branch',
  'Maifa — Kiambu Road branch',
  'Maifa — Mombasa branch',
  'Authorised reseller',
  'Online (maifa.ke)',
]
const MAKES = ['Toyota', 'Nissan', 'Honda', 'Mercedes-Benz', 'BMW', 'Subaru', 'Mazda', 'Mitsubishi', 'Volkswagen', 'Isuzu', 'Other']

const STEPS = ['Owner', 'Battery', 'Vehicle', 'Confirm']

const YEARS = Array.from({ length: 30 }, (_, i) => String(2025 - i))

export default function Warranty() {
  const fileInputRef = useRef(null)

  const [form, setForm] = useState({
    full_name: '', national_id: '', phone: '', email: '',
    city: 'Nairobi', area: '',
    battery_model: BATTERY_MODELS[0], serial_number: '',
    purchase_date: '', purchased_at: BRANCHES[0], invoice_number: '',
    fitted_by_maifa: 'yes', old_battery_returned: 'yes',
    vehicle_make: 'Toyota', vehicle_model: '', vehicle_year: '2018',
    number_plate: '', mileage: '', primary_use: 'personal',
    consent_accuracy: false, consent_marketing: false, consent_terms: false,
  })
  const [file, setFile]       = useState(null)
  const [drag, setDrag]       = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted]   = useState(false)
  const [warrantyCode, setWarrantyCode] = useState('')
  const [error, setError]     = useState('')

  const [lookupCode, setLookupCode] = useState('')
  const [lookupResult, setLookupResult] = useState(null)
  const [lookupError, setLookupError]   = useState('')

  function set(field) {
    return e => setForm(prev => ({ ...prev, [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))
  }

  function radioSet(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function onFileDrop(e) {
    e.preventDefault()
    setDrag(false)
    const f = e.dataTransfer?.files[0] || e.target.files[0]
    if (f) setFile(f)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.consent_terms) { setError('Please agree to the warranty terms to continue.'); return }
    if (!form.full_name || !form.phone || !form.email) { setError('Please fill in all required fields.'); return }
    setError('')
    setSubmitting(true)
    try {
      const payload = {
        full_name:       form.full_name,
        national_id:     form.national_id,
        phone:           form.phone,
        email:           form.email,
        city:            form.city,
        area:            form.area,
        battery_model:   form.battery_model,
        serial_number:   form.serial_number,
        purchase_date:   form.purchase_date,
        purchased_at:    form.purchased_at,
        invoice_number:  form.invoice_number,
        fitted_by_maifa: form.fitted_by_maifa === 'yes' ? 1 : 0,
        trade_in:        form.old_battery_returned === 'yes' ? 1 : 0,
        vehicle_make:    form.vehicle_make,
        vehicle_model:   form.vehicle_model,
        vehicle_year:    form.vehicle_year,
        number_plate:    form.number_plate,
        mileage:         form.mileage,
        primary_use:     form.primary_use,
      }

      /* Use multipart when a file is attached (so PHP can read $_FILES),
         plain JSON otherwise — backend handles both. */
      let res
      if (file) {
        const fd = new FormData()
        Object.entries(payload).forEach(([k, v]) => fd.append(k, String(v)))
        fd.append('receipt_file', file)
        res = await fetch('/api/warranty.php', { method: 'POST', body: fd })
      } else {
        res = await fetch('/api/warranty.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      }
      const data = await res.json()
      if (data.success) {
        setWarrantyCode(data.warranty_code || '')
        setSubmitted(true)
      } else {
        setError(data.error || 'Submission failed. Please try again.')
      }
    } catch {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleLookup(e) {
    e.preventDefault()
    if (!lookupCode.trim()) return
    setLookupError('')
    setLookupResult(null)
    try {
      const res = await fetch(`/api/warranty.php?code=${encodeURIComponent(lookupCode.trim())}`)
      const data = await res.json()
      if (data.success && data.warranty) setLookupResult(data.warranty)
      else setLookupError(data.error || 'Code not found.')
    } catch {
      setLookupError('Network error.')
    }
  }

  const activeStep = submitted ? 4 : 1

  if (submitted) {
    return (
      <section style={{ padding: 'var(--s9) 0' }}>
        <div className="container" style={{ maxWidth: 680, textAlign: 'center' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--s5)' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <h1 style={{ fontSize: 'clamp(36px,5vw,64px)' }}>Warranty activated.</h1>
          <p style={{ color: 'var(--muted)', fontSize: 17, margin: 'var(--s4) 0 var(--s5)', lineHeight: 1.6 }}>
            Your 12-month warranty is now active from your purchase date. A confirmation will arrive by email and SMS within 60 seconds.
          </p>
          {warrantyCode && (
            <div style={{ background: 'var(--ink)', color: '#fff', borderRadius: 'var(--r-lg)', padding: 'var(--s5)', marginBottom: 'var(--s6)' }}>
              <p style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,.5)', marginBottom: 'var(--s2)' }}>Your warranty code</p>
              <p style={{ fontFamily: 'var(--serif)', fontSize: 36, color: '#33d930', letterSpacing: 2 }}>{warrantyCode}</p>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,.6)', marginTop: 'var(--s2)' }}>Save this code. Use it at any branch to claim your warranty.</p>
            </div>
          )}
          <div style={{ display: 'flex', gap: 'var(--s3)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/" className="btn btn-dark">Back to home</Link>
            <Link to="/shop" className="btn btn-secondary">Shop batteries</Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <>
      <section className="page-head">
        <div className="container">
          <div className="crumbs"><Link to="/">Home</Link> / Help / <span>Warranty Registration</span></div>
          <div className="head-row">
            <div>
              <span className="eyebrow">Warranty · Free · 12-month cover</span>
              <h1 style={{ marginTop: 'var(--s2)' }}>Register your <em style={{ fontStyle: 'italic', color: 'var(--green)' }}>battery.</em></h1>
              <p style={{ color: '#444', fontSize: 16, maxWidth: 580, marginTop: 'var(--s4)', lineHeight: 1.65 }}>
                Activate your one-year warranty in under three minutes. Once registered, walk into any branch with your code — no paperwork hunting, no call centres.
              </p>
            </div>
            <div className="badge-row">
              <span className="badge green">● Avg. activation: 2m 14s</span>
              <span className="badge outline">All Maifa branches</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        <div className="warranty-layout">

          {/* Form */}
          <form className="warranty-form" onSubmit={handleSubmit}>

            {/* Stepper */}
            <div className="stepper">
              {STEPS.map((s, i) => (
                <div key={s} className={`step${i < activeStep ? ' done' : i === 0 ? ' active' : ''}`}>
                  <div className="num">Step 0{i + 1}</div>
                  <h5>{s}</h5>
                </div>
              ))}
            </div>

            {error && (
              <div style={{ background: '#fefce8', border: '1.5px solid #d97706', borderRadius: 'var(--r)', padding: 'var(--s4)', color: '#92400e', fontSize: 14 }}>
                {error}
              </div>
            )}

            {/* Step 1 — Owner */}
            <div className="fieldset">
              <div className="fhead">
                <div className="stamp">01</div>
                <div>
                  <h3>Owner details</h3>
                  <p>Who's the warranty registered to? We'll send confirmation by email and SMS.</p>
                </div>
              </div>
              <div className="row-2">
                <div className="field">
                  <label>Full name <span className="req">*</span></label>
                  <input type="text" placeholder="As it appears on your ID" value={form.full_name} onChange={set('full_name')} required />
                </div>
                <div className="field">
                  <label>National ID / Passport <span className="opt">— optional</span></label>
                  <input type="text" placeholder="e.g. 28456012" value={form.national_id} onChange={set('national_id')} />
                </div>
              </div>
              <div className="row-2" style={{ marginTop: 'var(--s4)' }}>
                <div className="field">
                  <label>Phone number <span className="req">*</span></label>
                  <div className="input-prefix">
                    <span className="pfx">🇰🇪 +254</span>
                    <input type="tel" placeholder="7XX XXX XXX" value={form.phone} onChange={set('phone')} required />
                  </div>
                  <span className="help mono">SMS confirmation arrives in &lt; 60 seconds.</span>
                </div>
                <div className="field">
                  <label>Email <span className="req">*</span></label>
                  <input type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} required />
                </div>
              </div>
              <div className="row-2" style={{ marginTop: 'var(--s4)' }}>
                <div className="field">
                  <label>City / town <span className="req">*</span></label>
                  <select value={form.city} onChange={set('city')}>
                    {CITIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label>Estate / area <span className="opt">— optional</span></label>
                  <input type="text" placeholder="e.g. Karen, Westlands" value={form.area} onChange={set('area')} />
                </div>
              </div>
            </div>

            {/* Step 2 — Battery */}
            <div className="fieldset">
              <div className="fhead">
                <div className="stamp">02</div>
                <div>
                  <h3>Battery details</h3>
                  <p>Find these on the receipt or stamped on the battery casing.</p>
                </div>
              </div>
              <div className="row-2">
                <div className="field">
                  <label>Battery model <span className="req">*</span></label>
                  <select value={form.battery_model} onChange={set('battery_model')}>
                    {BATTERY_MODELS.map(m => <option key={m}>{m}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label>Serial number <span className="req">*</span></label>
                  <div className="input-prefix">
                    <span className="pfx">MFA-</span>
                    <input type="text" placeholder="6-digit batch + 4-digit unit" value={form.serial_number} onChange={set('serial_number')} required />
                  </div>
                  <span className="help mono">Stamped on top-left corner of the casing.</span>
                </div>
              </div>
              <div className="row-3" style={{ marginTop: 'var(--s4)' }}>
                <div className="field">
                  <label>Purchase date <span className="req">*</span></label>
                  <input type="date" value={form.purchase_date} onChange={set('purchase_date')} required />
                </div>
                <div className="field">
                  <label>Purchased at <span className="req">*</span></label>
                  <select value={form.purchased_at} onChange={set('purchased_at')}>
                    {BRANCHES.map(b => <option key={b}>{b}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label>Receipt / invoice no. <span className="req">*</span></label>
                  <input type="text" placeholder="e.g. INV-082341" value={form.invoice_number} onChange={set('invoice_number')} required />
                </div>
              </div>
              <div className="row-2" style={{ marginTop: 'var(--s4)' }}>
                <div className="field">
                  <label>Fitted by Maifa?</label>
                  <div className="radio-group cols-2">
                    {[
                      { val: 'yes', label: 'Yes — in-store', sub: 'Auto-validates warranty' },
                      { val: 'no',  label: 'No — elsewhere', sub: 'Photo upload required' },
                    ].map(opt => (
                      <label key={opt.val} className={`radio-card${form.fitted_by_maifa === opt.val ? ' selected' : ''}`} onClick={() => radioSet('fitted_by_maifa', opt.val)}>
                        <input type="radio" name="fitted_by_maifa" value={opt.val} readOnly checked={form.fitted_by_maifa === opt.val} />
                        <span className="rc-t">{opt.label}</span>
                        <span className="rc-d">{opt.sub}</span>
                        {form.fitted_by_maifa === opt.val && <span className="rc-check">✓</span>}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="field">
                  <label>Old battery returned?</label>
                  <div className="radio-group cols-2">
                    {[
                      { val: 'yes', label: 'Yes — traded in', sub: 'KES 1,500 credit applied' },
                      { val: 'no',  label: 'No / kept it',    sub: 'No credit' },
                    ].map(opt => (
                      <label key={opt.val} className={`radio-card${form.old_battery_returned === opt.val ? ' selected' : ''}`} onClick={() => radioSet('old_battery_returned', opt.val)}>
                        <input type="radio" name="old_battery_returned" value={opt.val} readOnly checked={form.old_battery_returned === opt.val} />
                        <span className="rc-t">{opt.label}</span>
                        <span className="rc-d">{opt.sub}</span>
                        {form.old_battery_returned === opt.val && <span className="rc-check">✓</span>}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 — Vehicle */}
            <div className="fieldset">
              <div className="fhead">
                <div className="stamp">03</div>
                <div>
                  <h3>Vehicle the battery is fitted to</h3>
                  <p>Used for the warranty register and to flag mismatched fitments early.</p>
                </div>
              </div>
              <div className="row-3">
                <div className="field">
                  <label>Make <span className="req">*</span></label>
                  <select value={form.vehicle_make} onChange={set('vehicle_make')}>
                    {MAKES.map(m => <option key={m}>{m}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label>Model <span className="req">*</span></label>
                  <input type="text" placeholder="e.g. Premio, Fielder, Vitz" value={form.vehicle_model} onChange={set('vehicle_model')} required />
                </div>
                <div className="field">
                  <label>Year <span className="req">*</span></label>
                  <select value={form.vehicle_year} onChange={set('vehicle_year')}>
                    {YEARS.map(y => <option key={y}>{y}</option>)}
                  </select>
                </div>
              </div>
              <div className="row-2" style={{ marginTop: 'var(--s4)' }}>
                <div className="field">
                  <label>Number plate <span className="req">*</span></label>
                  <input type="text" placeholder="e.g. KDA 123A" value={form.number_plate} onChange={e => setForm(p => ({ ...p, number_plate: e.target.value.toUpperCase() }))} required style={{ textTransform: 'uppercase' }} />
                  <span className="help mono">Locked to this warranty for ownership verification.</span>
                </div>
                <div className="field">
                  <label>Approx. mileage (km) <span className="opt">— optional</span></label>
                  <input type="number" placeholder="e.g. 145000" value={form.mileage} onChange={set('mileage')} />
                </div>
              </div>
              <div className="field" style={{ marginTop: 'var(--s4)' }}>
                <label>Primary use</label>
                <div className="radio-group cols-3">
                  {[
                    { val: 'personal',   label: 'Personal',    sub: 'Daily commute' },
                    { val: 'commercial', label: 'Commercial',  sub: 'PSV · taxi · matatu' },
                    { val: 'heavy-duty', label: 'Heavy-duty',  sub: 'Lorry · plant' },
                  ].map(opt => (
                    <label key={opt.val} className={`radio-card${form.primary_use === opt.val ? ' selected' : ''}`} onClick={() => radioSet('primary_use', opt.val)}>
                      <input type="radio" name="primary_use" value={opt.val} readOnly checked={form.primary_use === opt.val} />
                      <span className="rc-t">{opt.label}</span>
                      <span className="rc-d">{opt.sub}</span>
                      {form.primary_use === opt.val && <span className="rc-check">✓</span>}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 4 — Proof */}
            <div className="fieldset">
              <div className="fhead">
                <div className="stamp">04</div>
                <div>
                  <h3>Proof of purchase &amp; consent</h3>
                  <p>Upload your receipt photo. Optional but speeds up future claims.</p>
                </div>
              </div>

              <div
                className={`upload-area${drag ? ' drag-over' : ''}`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={e => { e.preventDefault(); setDrag(true) }}
                onDragLeave={() => setDrag(false)}
                onDrop={onFileDrop}
              >
                <input ref={fileInputRef} type="file" accept="image/*,application/pdf" hidden onChange={onFileDrop} />
                <div className="upload-ico">↑</div>
                {file
                  ? <h5>{file.name}</h5>
                  : <h5>Upload receipt or invoice</h5>
                }
                <p>Drag a file here, or click to browse.</p>
                <div className="upload-formats">JPG · PNG · PDF · MAX 8 MB</div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s2)', marginTop: 'var(--s5)' }}>
                <label className="checkbox-row">
                  <input type="checkbox" checked={form.consent_accuracy} onChange={set('consent_accuracy')} />
                  <span className="cr-text">I confirm the details above are accurate, and I understand that the warranty is voided if the battery is tampered with, recharged improperly, or used outside its rated specifications.</span>
                </label>
                <label className="checkbox-row">
                  <input type="checkbox" checked={form.consent_marketing} onChange={set('consent_marketing')} />
                  <span className="cr-text">Send me service reminders, warranty expiry alerts, and trade-in offers via SMS &amp; email. (You can opt out anytime.)</span>
                </label>
                <label className="checkbox-row">
                  <input type="checkbox" checked={form.consent_terms} onChange={set('consent_terms')} />
                  <span className="cr-text">I agree to Maifa's warranty terms and privacy policy.</span>
                </label>
              </div>

              <div className="submit-row">
                <p className="note">By submitting, your battery's 12-month warranty becomes active from the purchase date above. Confirmation will arrive by email + SMS.</p>
                <div className="actions">
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? 'Activating…' : 'Activate warranty →'}
                  </button>
                </div>
              </div>
            </div>

          </form>

          {/* Sidebar */}
          <aside className="warranty-side">
            <div className="side-card">
              <span className="eyebrow no-rule" style={{ color: 'var(--green-bright)' }}>What's covered</span>
              <h3 style={{ marginTop: 'var(--s4)' }}>12 months. <em>No fine-print mazes.</em></h3>
              <p>Every Maifa-supplied battery comes with a one-year warranty against manufacturing defects. Walk in, swap out, drive off.</p>
              <ul className="checklist">
                {[
                  ['01', 'Manufacturing defects', 'Internal short, electrolyte loss, casing failure.'],
                  ['02', 'Premature capacity loss', "If it can't hold rated CCA in our load test."],
                  ['03', 'Free in-branch diagnostic', 'Usually under 15 minutes.'],
                  ['04', 'Pro-rata replacement', 'After the first 90 days.'],
                ].map(([n, title, desc]) => (
                  <li key={n}>
                    <span className="cnum">{n}</span>
                    <span><b style={{ color: '#fff' }}>{title}</b> — {desc}</span>
                  </li>
                ))}
                <li>
                  <span className="cnum">05</span>
                  <span style={{ color: 'rgba(255,255,255,.5)' }}><b style={{ color: 'rgba(255,255,255,.65)' }}>Not covered:</b> tampering, deep discharge, accident damage.</span>
                </li>
              </ul>
            </div>

            <div className="lookup-card">
              <h4>Already registered?</h4>
              <p>Enter your warranty code to check status or download a certificate.</p>
              <form onSubmit={handleLookup} style={{ display: 'contents' }}>
                <div className="lookup-input-row">
                  <input
                    type="text"
                    placeholder="MFA-XXXX-XXXX"
                    value={lookupCode}
                    onChange={e => setLookupCode(e.target.value.toUpperCase())}
                  />
                  <button type="submit">Look up</button>
                </div>
              </form>
              {lookupError && <p style={{ color: 'rgba(255,255,255,.7)', fontSize: 12, marginTop: 8 }}>{lookupError}</p>}
              {lookupResult && (
                <div style={{ marginTop: 'var(--s3)', background: 'rgba(255,255,255,.1)', borderRadius: 'var(--r)', padding: 'var(--s3)', fontSize: 13, color: '#fff', display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <p><b>{lookupResult.battery_model}</b></p>
                  <p style={{ color: 'rgba(255,255,255,.7)' }}>Purchased: {lookupResult.purchase_date}</p>
                  <p style={{ color: lookupResult.status === 'active' ? '#33d930' : 'rgba(255,255,255,.5)', fontFamily: 'var(--mono)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '.1em' }}>● {lookupResult.status}</p>
                </div>
              )}
            </div>

            <div className="help-card">
              <h4>Need help?</h4>
              <p>Our service desk handles warranty questions from 7:30 to 19:00 daily.</p>
              <div className="help-row"><span className="k">Thika Road</span><span className="v">0791 899 602</span></div>
              <div className="help-row"><span className="k">Kiambu Road</span><span className="v">0700 777 698</span></div>
              <div className="help-row"><span className="k">Mombasa</span><span className="v">0701 880 955</span></div>
              <div className="help-row"><span className="k">WhatsApp</span>
                <a href="https://wa.me/254791899602?text=Hi! I have a warranty question." target="_blank" rel="noopener noreferrer" className="v" style={{ color: '#25d366' }}>Chat →</a>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </>
  )
}
