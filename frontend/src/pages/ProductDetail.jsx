import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useScrollReveal } from '../hooks/useScrollReveal'
import OrderModal from '../components/ui/OrderModal'

function BatteryBig({ product }) {
  return (
    <div className="battery-big">
      <div>
        <div className="bm">Maifa</div>
        <div className="lbl" style={{ marginTop: 4 }}>{product.sku || product.category?.toUpperCase()}</div>
      </div>
      <div>
        <div className="v">{product.voltage || '12V'}</div>
        <div className="lbl" style={{ marginTop: 6 }}>{product.ah}Ah · {product.cca} CCA</div>
      </div>
    </div>
  )
}

const TABS = ['Description', 'Specifications', 'Warranty']

export default function ProductDetail() {
  useScrollReveal()
  const { slug } = useParams()
  const [product, setProduct]   = useState(null)
  const [related, setRelated]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [activeTab, setActiveTab]     = useState(0)
  const [activeThumb, setActiveThumb] = useState(0)
  const [showOrder, setShowOrder]     = useState(false)

  useEffect(() => {
    async function load() {
      setLoading(true)
      // slug format: "amaron-hi-life-ns70l-65ah-3" — numeric ID is the last segment
      const productId = slug.split('-').pop()
      try {
        const res = await fetch(`/api/products.php?id=${productId}`)
        const data = await res.json()
        if (data.success && data.product) {
          setProduct(data.product)
          const rel = await fetch(`/api/products.php?category=${encodeURIComponent(data.product.category)}`)
          const relData = await rel.json()
          if (relData.success) {
            setRelated((relData.products || []).filter(p => p.id !== data.product.id).slice(0, 4))
          }
        }
      } catch {
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }
    load()
    window.scrollTo(0, 0)
  }, [slug])

  if (loading) {
    return (
      <div className="container" style={{ padding: 'var(--s9) var(--s5)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 'var(--s8)' }}>
          <div style={{ background: 'var(--paper-2)', borderRadius: 'var(--r)', aspectRatio: '4/5' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s4)' }}>
            {[80, 200, 60, 120, 60].map((h, i) => (
              <div key={i} style={{ height: h, background: 'var(--paper-2)', borderRadius: 'var(--r)' }} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: 'var(--s9) var(--s5)' }}>
        <h2>Product not found</h2>
        <p style={{ color: 'var(--muted)', margin: 'var(--s4) 0 var(--s6)' }}>This battery may no longer be available.</p>
        <Link to="/shop" className="btn btn-primary">Browse all batteries</Link>
      </div>
    )
  }

  const waMsg = product.whatsapp_message || `Hi! I'd like to order the ${product.name} (SKU: ${product.sku || product.id}).`
  const hasDiscount = product.sale_price && Number(product.sale_price) > Number(product.price_from)
  const displayPrice = product.price_label || `KES ${Number(product.price_from).toLocaleString()}`
  const oldPrice = hasDiscount ? `KES ${Number(product.sale_price).toLocaleString()}` : null
  const saving = hasDiscount ? Number(product.sale_price) - Number(product.price_from) : 0

  return (
    <>
      <section style={{ padding: 'var(--s6) 0 var(--s9)' }}>
        <div className="container">
          <div className="crumbs" style={{ marginBottom: 'var(--s5)' }}>
            <Link to="/">Home</Link> / <Link to="/shop">Shop</Link> / <Link to={`/shop?category=${product.category}`}>{product.category}</Link> / <span>{product.name}</span>
          </div>

          <div className="pdp">
            {/* Gallery */}
            <div className="gallery">
              <div className="thumbs">
                {[0, 1, 2, 3].map(i => (
                  <div
                    key={i}
                    className={`thumb${activeThumb === i ? ' active' : ''}`}
                    onClick={() => setActiveThumb(i)}
                  >
                    {product.image && i === 0
                      ? <img src={`/products/${product.image}`} alt={product.name} style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
                      : (
                        <div style={{ width: '60%', height: '70%', background: 'linear-gradient(160deg,#1a1a1a,#000)', borderRadius: 3 }} />
                      )
                    }
                  </div>
                ))}
              </div>
              <div className="main-img">
                <div className="corner-tag">● In stock</div>
                {product.image && activeThumb === 0
                  ? <img src={`/products/${product.image}`} alt={product.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', padding: '5%', zIndex: 1 }} />
                  : <BatteryBig product={product} />
                }
              </div>
            </div>

            {/* Info */}
            <div className="pdp-info">
              <div className="cat-line">
                {product.badge && (
                  <span className={`badge ${product.badge.startsWith('red') ? 'red' : product.badge.startsWith('outline') ? 'outline' : 'green'}`}>
                    {product.badge.includes(':') ? product.badge.split(':')[1] : product.badge}
                  </span>
                )}
                <span className="stars">★★★★★</span>
                <span className="reviews-count">4.9 · Verified Maifa customers</span>
              </div>

              <h1>{product.name}</h1>

              <p className="short-desc">
                {product.short_desc || product.description || 'Maintenance-free 12V battery built for tropical heat. Fits most Japanese-import vehicles.'}
              </p>

              <div className="price-row">
                <div className="price">{displayPrice}</div>
                {oldPrice && (
                  <>
                    <div className="old-price">{oldPrice}</div>
                    <div className="save-tag">Save KES {saving.toLocaleString()}</div>
                  </>
                )}
              </div>

              <button
                onClick={() => setShowOrder(true)}
                className="wa-order-btn"
                style={{ border: 'none', cursor: 'pointer', width: '100%' }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 001.98 1.61h9.72a2 2 0 001.98-1.61L23 6H6"/>
                </svg>
                Order Now — {displayPrice}
              </button>

              <div className="delivery-card">
                <div className="delivery-item">
                  <div className="delivery-ico">⚡</div>
                  <div>
                    <div className="t">Free fitting & delivery</div>
                    <div className="d">Order before 4pm. Same-day in Nairobi.</div>
                  </div>
                </div>
                <div className="delivery-item">
                  <div className="delivery-ico">✓</div>
                  <div>
                    <div className="t">1-year warranty</div>
                    <div className="d">In-person claims at any branch.</div>
                  </div>
                </div>
                <div className="delivery-item">
                  <div className="delivery-ico">↻</div>
                  <div>
                    <div className="t">Old battery trade-in</div>
                    <div className="d">Up to KES 1,500 off.</div>
                  </div>
                </div>
                <div className="delivery-item">
                  <div className="delivery-ico">M</div>
                  <div>
                    <div className="t">M-Pesa, card or COD</div>
                    <div className="d">Pay how it suits you.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="tabs-section">
            <div className="tabs">
              {TABS.map((tab, i) => (
                <button
                  key={tab}
                  className={`tab-btn${activeTab === i ? ' active' : ''}`}
                  onClick={() => setActiveTab(i)}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === 0 && (
              <div className="tab-content-grid">
                <div className="tab-desc">
                  <p>{product.description || 'This Amaron battery is built with SILVEN-X™ alloy and reformulated Advanta™ paste — engineered for tropical climates. Leak-proof BIC vents keep it completely maintenance-free. Comes factory-charged and ready to install.'}</p>
                  <p>Free fitting at any Maifa branch, or we'll come to you anywhere in Nairobi. Every battery is load-tested before delivery.</p>
                </div>
                <div className="specs-table">
                  {product.ah    && <div className="spec-row"><span className="k">Capacity</span><span className="v">{product.ah} Ah</span></div>}
                  <div className="spec-row"><span className="k">Voltage</span><span className="v">{product.voltage || '12 V'}</span></div>
                  {product.cca   && <div className="spec-row"><span className="k">CCA (cold cranking)</span><span className="v">{product.cca} A</span></div>}
                  {product.sku   && <div className="spec-row"><span className="k">SKU / JIS code</span><span className="v">{product.sku}</span></div>}
                  <div className="spec-row"><span className="k">Technology</span><span className="v">SILVEN-X™ alloy</span></div>
                  <div className="spec-row"><span className="k">Maintenance</span><span className="v">Sealed · maintenance-free</span></div>
                  <div className="spec-row"><span className="k">Warranty</span><span className="v">12 months</span></div>
                  <div className="spec-row"><span className="k">Origin</span><span className="v">India (Amaron / Amco)</span></div>
                </div>
              </div>
            )}

            {activeTab === 1 && (
              <div className="specs-table" style={{ maxWidth: 540 }}>
                {product.ah    && <div className="spec-row"><span className="k">Capacity (Ah)</span><span className="v">{product.ah} Ah</span></div>}
                <div className="spec-row"><span className="k">Voltage</span><span className="v">{product.voltage || '12 V'}</span></div>
                {product.cca   && <div className="spec-row"><span className="k">CCA</span><span className="v">{product.cca} A</span></div>}
                {product.sku   && <div className="spec-row"><span className="k">JIS / DIN code</span><span className="v">{product.sku}</span></div>}
                <div className="spec-row"><span className="k">Terminal layout</span><span className="v">Left positive (standard)</span></div>
                <div className="spec-row"><span className="k">Technology</span><span className="v">SILVEN-X™ sealed</span></div>
                <div className="spec-row"><span className="k">Country of origin</span><span className="v">India</span></div>
              </div>
            )}

            {activeTab === 2 && (
              <div style={{ maxWidth: 600 }}>
                <p style={{ marginBottom: 'var(--s4)', fontSize: 15, color: '#333' }}>
                  All Maifa-supplied batteries carry a <strong>12-month warranty</strong> against manufacturing defects. Walk into any branch with your receipt or warranty code — no call centres, no paperwork.
                </p>
                <p style={{ marginBottom: 'var(--s5)', fontSize: 15, color: '#333' }}>
                  Register your battery online in under 3 minutes to activate your warranty and get SMS + email confirmation.
                </p>
                <Link to="/warranty" className="btn btn-secondary">Register warranty →</Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="related-section">
          <div className="container">
            <div className="section-head">
              <div>
                <span className="eyebrow">More in {product.category}</span>
                <h2 style={{ marginTop: 'var(--s4)', fontSize: 40 }}>You might also need.</h2>
              </div>
              <Link to={`/shop?category=${product.category}`} className="btn-ghost">Shop all</Link>
            </div>
            <div className="related-grid">
              {related.map(p => (
                <Link key={p.id} to={`/shop/${p.id}`} className="mini-card">
                  <div className="img">
                    {p.image
                      ? <img src={`/products/${p.image}`} alt={p.name} style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
                      : (
                        <div style={{ width: '50%', aspectRatio: '4/5', background: 'linear-gradient(160deg,#1a1a1a,#000)', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#33d930', fontFamily: 'var(--serif)', fontSize: 18, position: 'relative' }}>
                          <span style={{ position: 'absolute', top: -6, left: '18%', width: 12, height: 7, background: '#2a2a2a', borderRadius: '1px 1px 0 0' }} />
                          <span style={{ position: 'absolute', top: -6, right: '18%', width: 12, height: 7, background: '#2a2a2a', borderRadius: '1px 1px 0 0' }} />
                          M
                        </div>
                      )
                    }
                  </div>
                  <h5>{p.name}</h5>
                  <span className="mini-cat">{p.category} · {p.ah}Ah</span>
                  <div className="mini-price">{p.price_label || `KES ${Number(p.price_from).toLocaleString()}`}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {showOrder && (
        <OrderModal product={product} onClose={() => setShowOrder(false)} />
      )}
    </>
  )
}
