import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useApi } from '../hooks/useApi'

const WA = '254791899602'
const CATS = ['Buying Guide', 'Brand Comparison', 'Car Tips', 'Service']

function readingTime(html) {
  const text = (html || '').replace(/<[^>]+>/g, '')
  return Math.max(1, Math.ceil(text.trim().split(/\s+/).length / 200))
}

function SidebarArticleCard({ article }) {
  const date = new Date(article.created_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })
  return (
    <Link to={`/blog/${article.slug}`} style={{ display: 'flex', gap: 'var(--s3)', textDecoration: 'none', color: 'inherit', padding: 'var(--s3) 0', borderTop: '1px solid var(--line)' }}>
      {article.cover_image
        ? <img src={article.cover_image} alt={article.title} style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 'var(--r-sm)', flexShrink: 0 }} />
        : <div style={{ width: 64, height: 64, borderRadius: 'var(--r-sm)', background: 'var(--paper-2)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          </div>
      }
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--green)', marginBottom: 3 }}>{article.category}</div>
        <div style={{ fontFamily: 'var(--serif)', fontSize: 14, lineHeight: 1.3, color: 'var(--ink)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{article.title}</div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)', marginTop: 4 }}>{date}</div>
      </div>
    </Link>
  )
}

export default function BlogPost() {
  const { slug } = useParams()
  const { data, loading } = useApi(`/api/articles.php?slug=${slug}`)
  const { data: allData }  = useApi('/api/articles.php?limit=10')

  const article  = data?.article || null
  const allList  = allData?.articles || []
  const others   = allList.filter(a => a.slug !== slug)
  const related  = others.slice(0, 5)

  // find prev / next in list
  const currentIdx = allList.findIndex(a => a.slug === slug)
  const prevArt = currentIdx > 0 ? allList[currentIdx - 1] : null
  const nextArt = currentIdx !== -1 && currentIdx < allList.length - 1 ? allList[currentIdx + 1] : null

  // SEO
  useEffect(() => {
    if (!article) return
    document.title = article.meta_title || article.title + ' | Maifa'
    let meta = document.querySelector('meta[name="description"]')
    if (!meta) { meta = document.createElement('meta'); meta.name = 'description'; document.head.appendChild(meta) }
    meta.content = article.meta_desc || article.excerpt
    return () => { document.title = 'Maifa — Car Batteries Kenya' }
  }, [article])

  /* ── Loading skeleton ── */
  if (loading) return (
    <div className="container" style={{ padding: 'var(--s9) var(--s4)' }}>
      {[100, 60, 100, 100, 80, 40].map((w, i) => (
        <div key={i} style={{ background: 'var(--paper-2)', borderRadius: 6, height: i === 0 ? 40 : 16, marginBottom: 16, width: `${w}%`, opacity: 1 - i * 0.1 }} />
      ))}
    </div>
  )

  if (!article) return (
    <div className="container" style={{ textAlign: 'center', padding: 'var(--s9) var(--s4)' }}>
      <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(28px,4vw,48px)', marginBottom: 'var(--s4)' }}>Article not found</h2>
      <Link to="/blog" className="btn btn-primary">← Back to Blog</Link>
    </div>
  )

  const date = new Date(article.created_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' })
  const mins = readingTime(article.content)
  const tags = article.tags ? article.tags.split(',').map(t => t.trim()).filter(Boolean) : []

  return (
    <>
      {/* ── Cover hero ── */}
      <div style={{ position: 'relative', background: 'var(--ink)', overflow: 'hidden' }}>
        {article.cover_image
          ? <>
              <img src={article.cover_image} alt={article.title}
                style={{ width: '100%', height: 'clamp(280px,40vh,500px)', objectFit: 'cover', display: 'block', opacity: .55 }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,10,.85) 0%, rgba(10,10,10,.3) 60%, transparent 100%)' }} />
            </>
          : <div style={{ height: 180, background: 'linear-gradient(135deg, var(--green-deep), var(--ink))' }} />
        }
        <div style={{ position: article.cover_image ? 'absolute' : 'relative', bottom: 0, left: 0, right: 0, padding: 'var(--s7) 0 var(--s6)' }}>
          <div className="container">
            <div className="crumbs" style={{ marginBottom: 'var(--s4)', color: 'rgba(255,255,255,.55)' }}>
              <Link to="/" style={{ color: 'rgba(255,255,255,.55)' }}>Home</Link>
              {' '}/<Link to="/blog" style={{ color: 'rgba(255,255,255,.55)' }}> Blog</Link>
              {' '}/ <span style={{ color: '#fff' }}>{article.category}</span>
            </div>
            <div style={{ display: 'flex', gap: 'var(--s3)', alignItems: 'center', marginBottom: 'var(--s4)', flexWrap: 'wrap' }}>
              <span style={{ background: 'var(--green)', color: '#fff', fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', padding: '4px 10px', borderRadius: 'var(--r-pill)' }}>{article.category}</span>
              <span style={{ color: 'rgba(255,255,255,.55)', fontSize: 12, fontFamily: 'var(--mono)' }}>{mins} min read</span>
              <span style={{ color: 'rgba(255,255,255,.55)', fontSize: 12, fontFamily: 'var(--mono)' }}>{date}</span>
            </div>
            <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(26px,4vw,52px)', lineHeight: 1.1, color: '#fff', maxWidth: 800, textShadow: '0 2px 12px rgba(0,0,0,.3)' }}>
              {article.title}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s3)', marginTop: 'var(--s4)' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--serif)', fontSize: 14, color: '#fff', flexShrink: 0 }}>
                {(article.author || 'M')[0]}
              </div>
              <span style={{ color: 'rgba(255,255,255,.75)', fontSize: 13, fontWeight: 500 }}>{article.author || 'Maifa Team'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main layout ── */}
      <div className="blog-post-layout">

        {/* ── Article body ── */}
        <article className="blog-post-main">

          {/* Excerpt / lead */}
          {article.excerpt && (
            <p style={{ fontSize: 18, color: '#333', lineHeight: 1.75, marginBottom: 'var(--s7)', borderLeft: '4px solid var(--green)', paddingLeft: 'var(--s5)', fontStyle: 'italic' }}>
              {article.excerpt}
            </p>
          )}

          {/* Content */}
          <div className="article-content" dangerouslySetInnerHTML={{ __html: article.content }} />

          {/* Tags */}
          {tags.length > 0 && (
            <div style={{ marginTop: 'var(--s7)', paddingTop: 'var(--s5)', borderTop: '1px solid var(--line)', display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--muted)', marginRight: 4 }}>Tags:</span>
              {tags.map(t => (
                <span key={t} style={{ padding: '5px 13px', background: 'var(--paper-2)', border: '1px solid var(--line)', borderRadius: 20, fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--muted)' }}>
                  {t}
                </span>
              ))}
            </div>
          )}

          {/* ── WhatsApp CTA ── */}
          <div style={{ marginTop: 'var(--s7)', background: 'var(--ink)', borderRadius: 'var(--r-lg)', padding: 'var(--s6)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(45deg,transparent 0 18px,rgba(255,255,255,.02) 18px 19px)', pointerEvents: 'none' }} />
            <div style={{ position: 'relative' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--green-bright)', marginBottom: 'var(--s3)' }}>Ready to act?</div>
              <p style={{ color: '#fff', fontFamily: 'var(--serif)', fontSize: 'clamp(20px,3vw,28px)', marginBottom: 'var(--s3)', lineHeight: 1.2 }}>
                Need a battery fitted today?
              </p>
              <p style={{ color: 'rgba(255,255,255,.5)', marginBottom: 'var(--s5)', fontSize: 14 }}>
                Free installation across Nairobi. Same-day delivery. M-Pesa accepted.
              </p>
              <div style={{ display: 'flex', gap: 'var(--s3)', flexWrap: 'wrap' }}>
                <a
                  href={`https://wa.me/${WA}?text=${encodeURIComponent(`Hi! I read your article "${article.title}" and need help with my battery.`)}`}
                  target="_blank" rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#25d366', color: '#fff', padding: '12px 22px', borderRadius: 'var(--r)', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                  Order on WhatsApp
                </a>
                <Link to="/shop" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,.1)', color: '#fff', padding: '12px 22px', borderRadius: 'var(--r)', fontSize: 14, fontWeight: 600, textDecoration: 'none', border: '1px solid rgba(255,255,255,.15)' }}>
                  Browse batteries →
                </Link>
              </div>
            </div>
          </div>

          {/* ── Prev / Next navigation ── */}
          {(prevArt || nextArt) && (
            <div style={{ marginTop: 'var(--s7)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--s4)' }}>
              {prevArt ? (
                <Link to={`/blog/${prevArt.slug}`} style={{ display: 'flex', flexDirection: 'column', padding: 'var(--s4)', background: 'var(--white)', border: '1px solid var(--line)', borderRadius: 'var(--r)', textDecoration: 'none', transition: 'border-color .15s, box-shadow .15s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--ink)'; e.currentTarget.style.boxShadow = 'var(--shadow-1)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--line)'; e.currentTarget.style.boxShadow = 'none' }}
                >
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 'var(--s2)' }}>← Previous</span>
                  <span style={{ fontFamily: 'var(--serif)', fontSize: 15, color: 'var(--ink)', lineHeight: 1.3 }}>{prevArt.title}</span>
                </Link>
              ) : <div />}
              {nextArt ? (
                <Link to={`/blog/${nextArt.slug}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', textAlign: 'right', padding: 'var(--s4)', background: 'var(--white)', border: '1px solid var(--line)', borderRadius: 'var(--r)', textDecoration: 'none', transition: 'border-color .15s, box-shadow .15s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--ink)'; e.currentTarget.style.boxShadow = 'var(--shadow-1)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--line)'; e.currentTarget.style.boxShadow = 'none' }}
                >
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 'var(--s2)' }}>Next →</span>
                  <span style={{ fontFamily: 'var(--serif)', fontSize: 15, color: 'var(--ink)', lineHeight: 1.3 }}>{nextArt.title}</span>
                </Link>
              ) : <div />}
            </div>
          )}

          {/* ── More articles (mobile only, shown via CSS) ── */}
          <div className="blog-more-mobile" style={{ marginTop: 'var(--s7)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--s4)' }}>
              <h3 style={{ fontFamily: 'var(--serif)', fontSize: 22 }}>More articles</h3>
              <Link to="/blog" style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--green)', letterSpacing: '.06em' }}>View all →</Link>
            </div>
            {related.slice(0, 3).map(a => <SidebarArticleCard key={a.id} article={a} />)}
          </div>

          <div style={{ marginTop: 'var(--s6)', paddingTop: 'var(--s4)', borderTop: '1px solid var(--line)' }}>
            <Link to="/blog" style={{ color: 'var(--muted)', fontSize: 13, fontFamily: 'var(--mono)', letterSpacing: '.06em' }}>← All articles</Link>
          </div>
        </article>

        {/* ── Sidebar ── */}
        <aside className="blog-post-sidebar">

          {/* Article meta card */}
          <div style={{ background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 'var(--r-lg)', padding: 'var(--s5)' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 'var(--s4)' }}>About this article</div>
            {[
              { label: 'Category', value: article.category },
              { label: 'Published', value: date },
              { label: 'Author', value: article.author || 'Maifa Team' },
              { label: 'Read time', value: `${mins} min` },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--s2) 0', borderTop: '1px solid var(--line)', fontSize: 13 }}>
                <span style={{ color: 'var(--muted)', fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.06em', textTransform: 'uppercase' }}>{row.label}</span>
                <span style={{ fontWeight: 600, color: 'var(--ink)', textAlign: 'right', maxWidth: '55%' }}>{row.value}</span>
              </div>
            ))}
          </div>

          {/* More articles */}
          {related.length > 0 && (
            <div style={{ background: 'var(--white)', border: '1px solid var(--line)', borderRadius: 'var(--r-lg)', padding: 'var(--s5)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--s2)' }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--muted)' }}>More articles</div>
                <Link to="/blog" style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--green)', letterSpacing: '.06em' }}>All →</Link>
              </div>
              {related.map(a => <SidebarArticleCard key={a.id} article={a} />)}
            </div>
          )}

          {/* Browse by category */}
          <div style={{ background: 'var(--white)', border: '1px solid var(--line)', borderRadius: 'var(--r-lg)', padding: 'var(--s5)' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 'var(--s4)' }}>Browse by topic</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s1)' }}>
              {CATS.map(c => (
                <Link key={c} to={`/blog?category=${encodeURIComponent(c)}`}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--s3) var(--s3)', borderRadius: 'var(--r-sm)', fontSize: 14, textDecoration: 'none', color: article.category === c ? 'var(--green)' : 'var(--ink)', background: article.category === c ? 'var(--green-light)' : 'transparent', fontWeight: article.category === c ? 600 : 400, transition: 'background .15s' }}
                  onMouseEnter={e => { if (article.category !== c) e.currentTarget.style.background = 'var(--paper)' }}
                  onMouseLeave={e => { if (article.category !== c) e.currentTarget.style.background = 'transparent' }}
                >
                  {c}
                  <span style={{ fontSize: 12, color: 'var(--muted)' }}>→</span>
                </Link>
              ))}
            </div>
          </div>

          {/* WhatsApp CTA */}
          <a
            href={`https://wa.me/${WA}?text=${encodeURIComponent('Hi! I need help finding the right battery for my car.')}`}
            target="_blank" rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--s3)', background: 'var(--green)', color: '#fff', borderRadius: 'var(--r-lg)', padding: 'var(--s5)', textDecoration: 'none' }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0, marginTop: 2 }}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 3 }}>Need battery advice?</div>
              <div style={{ fontSize: 13, opacity: .85, lineHeight: 1.5 }}>Chat with our team on WhatsApp — free, fast, expert help.</div>
            </div>
          </a>

        </aside>
      </div>
    </>
  )
}
