import { useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function Terms() {
  useEffect(() => {
    document.title = 'Terms of Use | Maifa'
  }, [])

  return (
    <section>
      <div className="container" style={{ maxWidth: 760 }}>
        <div className="crumbs" style={{ marginBottom: 'var(--s5)' }}>
          <Link to="/">Home</Link> / <span>Terms of Use</span>
        </div>

        <span className="eyebrow">Legal</span>
        <h1 style={{ fontSize: 'clamp(36px,5vw,60px)', marginTop: 'var(--s4)', marginBottom: 'var(--s3)' }}>
          Terms of Use
        </h1>
        <p style={{ color: 'var(--muted)', fontFamily: 'var(--mono)', fontSize: 12, marginBottom: 'var(--s8)' }}>
          Last updated: May 2025
        </p>

        <div className="policy-body">
          <p>
            These Terms of Use govern your access to and use of the Maifa website
            (<strong>maifa.ke</strong>) and any related services operated by Maifa Ltd,
            a company incorporated in Kenya. Please read them carefully before using our site.
          </p>

          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using maifa.ke you agree to be bound by these Terms. If you do not
            agree, please do not use the site. We may update these Terms periodically; continued
            use after an update means you accept the revised Terms.
          </p>

          <h2>2. Use of the Site</h2>
          <p>You agree to use the site only for lawful purposes. You must not:</p>
          <ul>
            <li>Attempt to gain unauthorised access to any part of our systems.</li>
            <li>Scrape, crawl, or data-mine the site without prior written permission.</li>
            <li>Submit false, misleading, or fraudulent information in orders or forms.</li>
            <li>Use the site in any way that disrupts, damages, or impairs its operation.</li>
          </ul>

          <h2>3. Products and Pricing</h2>
          <p>
            All prices displayed on maifa.ke are in Kenyan Shillings (KES) and include
            applicable taxes unless otherwise stated. Prices are subject to change without
            notice. We reserve the right to refuse or cancel any order if a pricing error
            occurs, and we will notify you immediately and offer a full refund if payment
            was made.
          </p>

          <h2>4. Orders and Payment</h2>
          <p>
            Placing an order (via WhatsApp, the website, or in-branch) constitutes an offer
            to purchase. The contract is formed when we confirm your order. We accept M-Pesa,
            debit/credit card, and cash on delivery. Payment must be received in full before
            goods are dispatched unless a COD arrangement is agreed.
          </p>

          <h2>5. Delivery</h2>
          <p>
            We aim to deliver same-day within Nairobi for orders placed before 4 pm on
            working days. Delivery timelines are estimates and not guarantees. Maifa is not
            liable for delays caused by circumstances outside our reasonable control
            (e.g., traffic, weather, public holidays).
          </p>

          <h2>6. Warranty</h2>
          <p>
            All batteries supplied by Maifa carry a <strong>12-month manufacturer's warranty</strong>
            against defects in materials and workmanship, subject to the conditions on our{' '}
            <Link to="/warranty">Warranty page</Link>. The warranty does not cover damage caused by
            misuse, improper installation (other than by Maifa technicians), deep discharge, or
            physical damage.
          </p>

          <h2>7. Returns and Refunds</h2>
          <p>
            If a battery is found to be defective within the warranty period, we will replace
            it or issue a refund at our discretion after inspection. Claims must be made
            in-branch with proof of purchase. No refunds are given for change-of-mind
            purchases once a battery has been installed.
          </p>

          <h2>8. Intellectual Property</h2>
          <p>
            All content on maifa.ke — including text, images, logos, and design — is owned
            by or licensed to Maifa Ltd. You may not reproduce, distribute, or create
            derivative works without our express written consent.
          </p>

          <h2>9. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by Kenyan law, Maifa Ltd shall not be liable for
            any indirect, incidental, or consequential loss arising from your use of the site
            or our products, including but not limited to loss of vehicle use or data.
            Our total liability for any claim shall not exceed the amount paid for the
            specific product or service giving rise to that claim.
          </p>

          <h2>10. Third-Party Links</h2>
          <p>
            The site may contain links to third-party websites (including WhatsApp and
            social media). We are not responsible for the content or privacy practices
            of those sites and recommend you review their own policies.
          </p>

          <h2>11. Governing Law</h2>
          <p>
            These Terms are governed by the laws of Kenya. Any disputes shall be subject to
            the exclusive jurisdiction of the courts of Nairobi, Kenya.
          </p>

          <h2>12. Contact</h2>
          <p>
            Maifa Ltd, Nairobi, Kenya<br />
            Email: <a href="mailto:info@maifa.ke">info@maifa.ke</a><br />
            Phone: <a href="tel:+254791899602">+254 791 899 602</a>
          </p>
        </div>

        <div style={{ marginTop: 'var(--s8)', paddingTop: 'var(--s5)', borderTop: '1px solid var(--line)', display: 'flex', gap: 'var(--s5)' }}>
          <Link to="/privacy-policy" className="btn btn-secondary">Privacy Policy →</Link>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', color: 'var(--muted)', fontSize: 14 }}>← Back to home</Link>
        </div>
      </div>
    </section>
  )
}
