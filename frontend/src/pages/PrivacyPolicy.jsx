import { useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function PrivacyPolicy() {
  useEffect(() => {
    document.title = 'Privacy Policy | Maifa'
  }, [])

  return (
    <section>
      <div className="container" style={{ maxWidth: 760 }}>
        <div className="crumbs" style={{ marginBottom: 'var(--s5)' }}>
          <Link to="/">Home</Link> / <span>Privacy Policy</span>
        </div>

        <span className="eyebrow">Legal</span>
        <h1 style={{ fontSize: 'clamp(36px,5vw,60px)', marginTop: 'var(--s4)', marginBottom: 'var(--s3)' }}>
          Privacy Policy
        </h1>
        <p style={{ color: 'var(--muted)', fontFamily: 'var(--mono)', fontSize: 12, marginBottom: 'var(--s8)' }}>
          Last updated: May 2025
        </p>

        <div className="policy-body">
          <p>
            Maifa Ltd ("Maifa", "we", "us", or "our") operates <strong>maifa.ke</strong> and the
            associated services. This policy explains what information we collect, how we use it,
            and the choices you have. By using our site you agree to these terms.
          </p>

          <h2>1. Information We Collect</h2>
          <p>
            <strong>Information you give us.</strong> When you place an order, register a warranty,
            or contact us, we may collect your name, phone number, email address, and vehicle
            details (make, model, year).
          </p>
          <p>
            <strong>Information collected automatically.</strong> We collect standard web-server
            logs (IP address, browser type, pages visited) and may use cookies or local storage
            for basic site functionality. We do not run advertising trackers.
          </p>

          <h2>2. How We Use Your Information</h2>
          <ul>
            <li>To process and fulfil battery orders and delivery requests.</li>
            <li>To send warranty registration confirmations via SMS or email.</li>
            <li>To respond to enquiries submitted through WhatsApp or our contact form.</li>
            <li>To improve site performance and diagnose technical issues.</li>
            <li>To send occasional product updates or promotions if you have subscribed — you can unsubscribe at any time.</li>
          </ul>

          <h2>3. Sharing of Information</h2>
          <p>
            We do not sell, rent, or trade your personal information. We may share it with
            delivery partners or service providers solely to fulfil your order, under
            confidentiality obligations. We will disclose information where required by
            Kenyan law or a valid legal process.
          </p>

          <h2>4. WhatsApp & Third-Party Services</h2>
          <p>
            Our site links to WhatsApp for order and support conversations. Any information
            you share via WhatsApp is subject to WhatsApp's own privacy policy. We do not
            store WhatsApp conversation content on our servers.
          </p>

          <h2>5. Data Retention</h2>
          <p>
            We retain order and warranty records for up to 3 years for customer-support and
            warranty-claim purposes. Contact-form submissions are kept for 12 months.
          </p>

          <h2>6. Your Rights</h2>
          <p>
            You may request a copy of the personal data we hold about you, ask us to correct
            inaccurate data, or request deletion. Contact us at{' '}
            <a href="mailto:info@maifa.ke">info@maifa.ke</a> and we will respond within
            14 working days.
          </p>

          <h2>7. Cookies</h2>
          <p>
            We use only functional cookies required for the site to work (e.g., session
            state). No third-party advertising cookies are set. You may clear cookies via
            your browser settings without affecting the site's core functionality.
          </p>

          <h2>8. Security</h2>
          <p>
            We use HTTPS encryption for all data in transit and restrict access to personal
            data to authorised staff only. No online system is 100 % secure; please contact
            us immediately if you suspect misuse of your data.
          </p>

          <h2>9. Changes to This Policy</h2>
          <p>
            We may update this policy from time to time. The "Last updated" date at the top
            will reflect changes. Continued use of the site after an update constitutes
            acceptance of the revised policy.
          </p>

          <h2>10. Contact</h2>
          <p>
            Maifa Ltd, Nairobi, Kenya<br />
            Email: <a href="mailto:info@maifa.ke">info@maifa.ke</a><br />
            Phone: <a href="tel:+254791899602">+254 791 899 602</a>
          </p>
        </div>

        <div style={{ marginTop: 'var(--s8)', paddingTop: 'var(--s5)', borderTop: '1px solid var(--line)', display: 'flex', gap: 'var(--s5)' }}>
          <Link to="/terms" className="btn btn-secondary">Terms of Use →</Link>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', color: 'var(--muted)', fontSize: 14 }}>← Back to home</Link>
        </div>
      </div>
    </section>
  )
}
