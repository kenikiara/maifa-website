import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section style={{ padding: 'var(--s9) 0', textAlign: 'center', minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
      <div className="container">
        <div style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(80px,15vw,180px)', lineHeight: 1, color: 'var(--line)', marginBottom: 'var(--s4)', userSelect: 'none' }}>
          404
        </div>
        <h1 style={{ fontSize: 'clamp(28px,4vw,52px)', marginBottom: 'var(--s4)' }}>
          Page not found.
        </h1>
        <p style={{ fontSize: 17, color: 'var(--muted)', maxWidth: 440, margin: '0 auto var(--s7)', lineHeight: 1.65 }}>
          This page doesn't exist or has moved. Let's get you back on the road.
        </p>
        <div style={{ display: 'flex', gap: 'var(--s3)', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/" className="btn btn-primary">Back to home</Link>
          <Link to="/shop" className="btn btn-secondary">Browse batteries</Link>
          <a
            href="https://wa.me/254791899602?text=Hi! I need help finding something on your website."
            target="_blank" rel="noopener noreferrer"
            className="btn btn-secondary"
          >
            WhatsApp us
          </a>
        </div>
      </div>
    </section>
  )
}
