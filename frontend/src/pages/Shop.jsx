import { useState, useEffect, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useScrollReveal } from '../hooks/useScrollReveal'
import OrderModal from '../components/ui/OrderModal'

const CATEGORIES = [
  { label: 'Standard',   count: 5 },
  { label: 'Large Car',  count: 3 },
  { label: 'EFB',        count: 3 },
  { label: 'Heavy Duty', count: 3 },
  { label: 'European',   count: 2 },
]

const PER_PAGE = 12

function BatteryPlaceholder({ label = 'M' }) {
  return (
    <div style={{
      width: '48%', aspectRatio: '4/5',
      background: 'linear-gradient(160deg,#1a1a1a,#000)',
      borderRadius: 6, position: 'relative',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#33d930', fontFamily: 'var(--serif)', fontSize: 20, zIndex: 1,
    }}>
      <span style={{ position: 'absolute', top: -8, left: '18%', width: 13, height: 9, background: '#2a2a2a', borderRadius: '1px 1px 0 0' }} />
      <span style={{ position: 'absolute', top: -8, right: '18%', width: 13, height: 9, background: '#2a2a2a', borderRadius: '1px 1px 0 0' }} />
      {label}
    </div>
  )
}

function ProductCard({ product, onOrder }) {
  return (
    <div className="product-card">
      <Link to={`/shop/${product.id}`} style={{ display: 'contents' }}>
        <div className="img">
          <div className="badges">
            {product.badge && (
              <span className={`badge ${product.badge.startsWith('red') ? 'red' : product.badge.startsWith('outline') ? 'outline' : 'green'}`}>
                {product.badge.includes(':') ? product.badge.split(':')[1] : product.badge}
              </span>
            )}
          </div>
          {product.image
            ? <img src={`/products/${product.image}`} alt={product.name} loading="lazy" />
            : <BatteryPlaceholder />
          }
          <span className="quick-view">Quick view</span>
        </div>
        <div className="body">
          <span className="cat">{product.category}</span>
          <h4>{product.name}</h4>
          <div className="specs-mini">
            <span><b>{product.voltage || '12V'} · {product.ah}Ah</b></span>
            {product.cca && <span>{product.cca} CCA</span>}
          </div>
          <div className="footer">
            <div className="price">
              {product.sale_price && <span className="old">KES {Number(product.sale_price).toLocaleString()}</span>}
              KES {product.price_label || Number(product.price_from).toLocaleString()}
            </div>
          </div>
        </div>
      </Link>
      <div style={{ padding: '0 var(--s4) var(--s4)' }}>
        <button
          onClick={() => onOrder(product)}
          className="btn btn-primary"
          style={{ width: '100%', height: 40, fontSize: 13, cursor: 'pointer' }}
        >
          Order Now →
        </button>
      </div>
    </div>
  )
}

/* ── Shared filter controls (used in both sidebar & drawer) ── */
function FilterControls({ selectedCats, toggleCat, minPrice, setMinPrice, maxPrice, setMaxPrice, setPage, onClear }) {
  const hasFilters = selectedCats.length > 0 || minPrice || maxPrice
  return (
    <>
      <div className="filter-block">
        <h5>Category <span style={{ color: 'var(--muted)' }}>{CATEGORIES.length}</span></h5>
        <ul>
          {CATEGORIES.map(cat => (
            <li key={cat.label}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedCats.includes(cat.label)}
                  onChange={() => toggleCat(cat.label)}
                />
                {cat.label}
                <span className="count">{cat.count}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div className="filter-block">
        <h5>Price (KES)</h5>
        <div className="price-range">
          <input
            type="text" placeholder="Min"
            value={minPrice}
            onChange={e => { setMinPrice(e.target.value); setPage(1) }}
          />
          <span style={{ color: 'var(--muted)', flexShrink: 0 }}>—</span>
          <input
            type="text" placeholder="Max"
            value={maxPrice}
            onChange={e => { setMaxPrice(e.target.value); setPage(1) }}
          />
        </div>
      </div>

      {hasFilters && (
        <div className="filter-block" style={{ border: 'none', paddingTop: 0 }}>
          <button
            onClick={onClear}
            style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--muted)', cursor: 'pointer', textDecoration: 'underline' }}
          >
            Clear filters
          </button>
        </div>
      )}
    </>
  )
}

export default function Shop() {
  useScrollReveal()
  const [searchParams, setSearchParams] = useSearchParams()

  const [products, setProducts]         = useState([])
  const [loading, setLoading]           = useState(true)
  const [total, setTotal]               = useState(0)
  const [page, setPage]                 = useState(1)
  const [sort, setSort]                 = useState('featured')
  const [orderProduct, setOrderProduct] = useState(null)
  const [filterOpen, setFilterOpen]     = useState(false)

  const [selectedCats, setSelectedCats] = useState(() => {
    const cat = searchParams.get('category')
    return cat ? [cat] : []
  })
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

  const activeCount = selectedCats.length + (minPrice ? 1 : 0) + (maxPrice ? 1 : 0)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (selectedCats.length === 1) params.set('category', selectedCats[0])
      if (minPrice) params.set('min_price', minPrice)
      if (maxPrice) params.set('max_price', maxPrice)
      params.set('sort', sort)
      params.set('page', page)
      params.set('per_page', PER_PAGE)

      const res = await fetch(`/api/products.php?${params}`)
      const data = await res.json()
      if (data.success) {
        setProducts(data.products || [])
        setTotal(data.products?.length || 0)
      }
    } catch {
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [selectedCats, minPrice, maxPrice, sort, page])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  useEffect(() => {
    const cat = searchParams.get('category')
    if (cat) setSelectedCats([cat])
  }, [searchParams])

  function toggleCat(cat) {
    setPage(1)
    setSelectedCats(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    )
    setSearchParams(prev => {
      if (selectedCats.includes(cat)) prev.delete('category')
      else prev.set('category', cat)
      return prev
    })
  }

  function clearAll() {
    setSelectedCats([])
    setMinPrice('')
    setMaxPrice('')
    setPage(1)
    setSearchParams({})
  }

  const totalPages = Math.ceil(total / PER_PAGE)

  return (
    <>
      <section className="page-head" style={{ padding: 'var(--s8) 0 var(--s6)' }}>
        <div className="container">
          <div className="crumbs">
            <Link to="/">Home</Link> / <span>Shop</span>
            {selectedCats.length === 1 ? <> / <span>{selectedCats[0]}</span></> : null}
          </div>
          <h1>{selectedCats.length === 1 ? `${selectedCats[0]} Batteries` : 'All Batteries'}</h1>
          <div className="meta">
            <p>Maintenance-free, factory-charged batteries — ready to fit.</p>
            <span className="badge outline">{total} products in stock</span>
          </div>
        </div>
      </section>

      <div className="container">
        <div className="shop-layout">

          {/* ── Desktop sidebar ── */}
          <aside className="shop-sidebar">
            <FilterControls
              selectedCats={selectedCats} toggleCat={toggleCat}
              minPrice={minPrice} setMinPrice={setMinPrice}
              maxPrice={maxPrice} setMaxPrice={setMaxPrice}
              setPage={setPage} onClear={clearAll}
            />
          </aside>

          {/* ── Main ── */}
          <main>
            <div className="results-bar">
              <span className="count-text">
                <b>{total}</b> {total === 1 ? 'result' : 'results'}
                {selectedCats.length === 1 ? ` in ${selectedCats[0]}` : ''}
              </span>

              <div style={{ display: 'flex', gap: 'var(--s3)', alignItems: 'center' }}>
                {/* Mobile filter button — hidden on desktop via CSS */}
                <button
                  className="filter-toggle-btn"
                  onClick={() => setFilterOpen(true)}
                  aria-label="Open filters"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
                  </svg>
                  Filter
                  {activeCount > 0 && (
                    <span className="filter-badge">{activeCount}</span>
                  )}
                </button>

                <select value={sort} onChange={e => { setSort(e.target.value); setPage(1) }}>
                  <option value="featured">Sort: Featured</option>
                  <option value="price_asc">Price: low → high</option>
                  <option value="price_desc">Price: high → low</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
            </div>

            {/* Active filter pills (mobile) */}
            {activeCount > 0 && (
              <div className="active-filter-pills">
                {selectedCats.map(c => (
                  <button key={c} className="filter-pill-active" onClick={() => toggleCat(c)}>
                    {c} ×
                  </button>
                ))}
                {(minPrice || maxPrice) && (
                  <button className="filter-pill-active" onClick={() => { setMinPrice(''); setMaxPrice(''); }}>
                    KES {minPrice || '0'} – {maxPrice || '∞'} ×
                  </button>
                )}
                <button className="filter-pill-clear" onClick={clearAll}>Clear all</button>
              </div>
            )}

            {loading ? (
              <div className="product-grid-shop">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} style={{ background: 'var(--paper-2)', borderRadius: 'var(--r)', aspectRatio: '3/4', animation: 'pulse 1.5s ease-in-out infinite' }} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 'var(--s9) 0', color: 'var(--muted)' }}>
                <p style={{ fontSize: 18, marginBottom: 'var(--s4)' }}>No batteries found.</p>
                <button className="btn btn-secondary" onClick={clearAll}>Clear filters</button>
              </div>
            ) : (
              <div className="product-grid-shop">
                {products.map(p => <ProductCard key={p.id} product={p} onOrder={setOrderProduct} />)}
              </div>
            )}

            {totalPages > 1 && (
              <div className="pagination">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>‹</button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                  <button key={n} className={page === n ? 'active' : ''} onClick={() => setPage(n)}>{n}</button>
                ))}
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>›</button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ── Mobile filter drawer (bottom sheet) ── */}
      <div className={`filter-drawer-backdrop${filterOpen ? ' open' : ''}`} onClick={() => setFilterOpen(false)} />
      <div className={`filter-drawer${filterOpen ? ' open' : ''}`} aria-label="Filters">
        <div className="filter-drawer-handle" />
        <div className="filter-drawer-head">
          <span style={{ fontFamily: 'var(--serif)', fontSize: 20 }}>Filters</span>
          <button
            onClick={() => setFilterOpen(false)}
            style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div className="filter-drawer-body">
          <FilterControls
            selectedCats={selectedCats} toggleCat={toggleCat}
            minPrice={minPrice} setMinPrice={setMinPrice}
            maxPrice={maxPrice} setMaxPrice={setMaxPrice}
            setPage={setPage} onClear={clearAll}
          />
        </div>
        <div className="filter-drawer-foot">
          <button className="btn btn-primary" style={{ flex: 1, height: 48, fontSize: 15 }} onClick={() => setFilterOpen(false)}>
            Show {total} result{total !== 1 ? 's' : ''}
          </button>
        </div>
      </div>

      {orderProduct && (
        <OrderModal product={orderProduct} onClose={() => setOrderProduct(null)} />
      )}
    </>
  )
}
