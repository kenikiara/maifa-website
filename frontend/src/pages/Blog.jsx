import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApi } from '../hooks/useApi'
import { useScrollReveal } from '../hooks/useScrollReveal'

const CATS = ['All', 'Buying Guide', 'Brand Comparison', 'Car Tips', 'Service']

function ArticleCard({ article }) {
  const date = new Date(article.created_at).toLocaleDateString('en-KE', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
  return (
    <Link to={`/blog/${article.slug}`} className="article-card">
      <div className="article-cover">
        {article.cover_image
          ? <img src={article.cover_image} alt={article.title} loading="lazy" />
          : <div className="article-cover-placeholder">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
            </div>
        }
        <span className="article-cat">{article.category}</span>
      </div>
      <div className="article-body">
        <h3>{article.title}</h3>
        <p>{article.excerpt}</p>
        <div className="article-meta">
          <span>{article.author}</span>
          <span>{date}</span>
        </div>
      </div>
    </Link>
  )
}

export default function Blog() {
  useScrollReveal()
  const [cat, setCat] = useState('All')

  const url = cat === 'All'
    ? '/api/articles.php?limit=20'
    : `/api/articles.php?limit=20&category=${encodeURIComponent(cat)}`

  const { data, loading } = useApi(url)
  const articles = data?.articles || []
  const total    = data?.total || 0

  return (
    <>
      {/* Page header */}
      <section className="page-head" style={{ padding: 'var(--s8) 0 var(--s6)', borderBottom: '1px solid var(--line)' }}>
        <div className="container">
          <div className="crumbs"><Link to="/">Home</Link> / <span>Blog</span></div>
          <h1>Battery &amp; Car Tips</h1>
          <p style={{ color: 'var(--muted)', maxWidth: 520, marginTop: 'var(--s3)' }}>
            Expert guides on car batteries, maintenance, and getting the best value in Kenya.
          </p>
        </div>
      </section>

      <div className="container" style={{ padding: 'var(--s7) var(--s4)' }}>
        {/* Category filter */}
        <div style={{ display: 'flex', gap: 'var(--s3)', flexWrap: 'wrap', marginBottom: 'var(--s6)' }}>
          {CATS.map(c => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`btn ${cat === c ? 'btn-primary' : 'btn-secondary'}`}
              style={{ height: 36, padding: '0 16px', fontSize: 13 }}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Results count */}
        {!loading && (
          <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 'var(--s5)', fontFamily: 'var(--mono)' }}>
            {total} {total === 1 ? 'article' : 'articles'}
          </p>
        )}

        {/* Grid */}
        {loading ? (
          <div className="article-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} style={{ background: 'var(--paper-2)', borderRadius: 'var(--r)', height: 340, animation: 'pulse 1.5s ease-in-out infinite' }} />
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 'var(--s9) 0', color: 'var(--muted)' }}>
            <p style={{ fontSize: 18 }}>No articles in this category yet.</p>
          </div>
        ) : (
          <div className="article-grid">
            {articles.map(a => <ArticleCard key={a.id} article={a} />)}
          </div>
        )}
      </div>
    </>
  )
}
