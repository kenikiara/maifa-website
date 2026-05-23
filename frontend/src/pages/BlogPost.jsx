import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useApi } from '../hooks/useApi'

const WA = '254791899602'

export default function BlogPost() {
  const { slug } = useParams()
  const { data, loading } = useApi(`/api/articles.php?slug=${slug}`)
  const article = data?.article || null

  // SEO — update page title + meta description
  useEffect(() => {
    if (!article) return
    document.title = article.meta_title || article.title + ' | Maifa'
    let meta = document.querySelector('meta[name="description"]')
    if (!meta) { meta = document.createElement('meta'); meta.name = 'description'; document.head.appendChild(meta) }
    meta.content = article.meta_desc || article.excerpt
    return () => { document.title = 'Maifa — Car Batteries Kenya' }
  }, [article])

  if (loading) {
    return (
      <div className="container" style={{ maxWidth: 780, padding: 'var(--s9) var(--s4)' }}>
        {[1,2,3].map(i => (
          <div key={i} style={{ background: 'var(--paper-2)', borderRadius: 6, height: i === 1 ? 48 : 20, marginBottom: 16, width: i === 3 ? '60%' : '100%', animation: 'pulse 1.5s ease-in-out infinite' }} />
        ))}
      </div>
    )
  }

  if (!article) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: 'var(--s9) var(--s4)' }}>
        <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(28px,4vw,48px)', marginBottom: 'var(--s4)' }}>Article not found</h2>
        <Link to="/blog" className="btn btn-primary">← Back to Blog</Link>
      </div>
    )
  }

  const date = new Date(article.created_at).toLocaleDateString('en-KE', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  const tags = article.tags ? article.tags.split(',').map(t => t.trim()).filter(Boolean) : []

  return (
    <>
      {/* Hero */}
      {article.cover_image && (
        <div style={{ width: '100%', maxHeight: 420, overflow: 'hidden', background: 'var(--ink)' }}>
          <img src={article.cover_image} alt={article.title}
            style={{ width: '100%', height: 420, objectFit: 'cover', opacity: 0.85 }} />
        </div>
      )}

      <div style={{ maxWidth: 780, margin: '0 auto', padding: 'var(--s8) var(--s4) var(--s9)' }}>
        {/* Breadcrumb */}
        <div className="crumbs" style={{ marginBottom: 'var(--s5)' }}>
          <Link to="/">Home</Link> / <Link to="/blog">Blog</Link> / <span>{article.category}</span>
        </div>

        {/* Category + date */}
        <div style={{ display: 'flex', gap: 'var(--s3)', alignItems: 'center', marginBottom: 'var(--s4)', flexWrap: 'wrap' }}>
          <span className="badge outline" style={{ fontSize: 11 }}>{article.category}</span>
          <span style={{ color: 'var(--muted)', fontSize: 13, fontFamily: 'var(--mono)' }}>{date}</span>
          <span style={{ color: 'var(--muted)', fontSize: 13 }}>By {article.author}</span>
        </div>

        {/* Title */}
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(28px,4vw,46px)', lineHeight: 1.15, marginBottom: 'var(--s5)', color: 'var(--ink)' }}>
          {article.title}
        </h1>

        {/* Excerpt */}
        {article.excerpt && (
          <p style={{ fontSize: 18, color: 'var(--muted)', lineHeight: 1.7, marginBottom: 'var(--s6)', borderLeft: '3px solid var(--green)', paddingLeft: 'var(--s4)' }}>
            {article.excerpt}
          </p>
        )}

        <hr style={{ border: 'none', borderTop: '1px solid var(--line)', marginBottom: 'var(--s7)' }} />

        {/* Article body */}
        <div
          className="article-content"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Tags */}
        {tags.length > 0 && (
          <div style={{ marginTop: 'var(--s7)', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {tags.map(t => (
              <span key={t} style={{ padding: '4px 12px', background: 'var(--paper-2)', borderRadius: 20, fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--muted)' }}>
                {t}
              </span>
            ))}
          </div>
        )}

        <hr style={{ border: 'none', borderTop: '1px solid var(--line)', margin: 'var(--s7) 0' }} />

        {/* CTA */}
        <div style={{ background: 'var(--ink)', borderRadius: 'var(--r)', padding: 'var(--s6)', textAlign: 'center' }}>
          <p style={{ color: '#fff', fontFamily: 'var(--serif)', fontSize: 24, marginBottom: 'var(--s4)' }}>
            Need a battery fitted today?
          </p>
          <p style={{ color: 'rgba(255,255,255,.55)', marginBottom: 'var(--s5)', fontSize: 15 }}>
            Free installation across Nairobi. Same-day delivery. M-Pesa accepted.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href={`https://wa.me/${WA}?text=Hi! I read your article "${article.title}" and need help with my battery.`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              Order on WhatsApp →
            </a>
            <Link to="/shop" className="btn btn-secondary" style={{ '--btn-sec-color': 'rgba(255,255,255,.15)', color: '#fff', borderColor: 'rgba(255,255,255,.2)' }}>
              Browse batteries
            </Link>
          </div>
        </div>

        {/* Back link */}
        <div style={{ marginTop: 'var(--s6)' }}>
          <Link to="/blog" style={{ color: 'var(--muted)', fontSize: 14, fontFamily: 'var(--mono)', textDecoration: 'none' }}>
            ← Back to all articles
          </Link>
        </div>
      </div>
    </>
  )
}
