import { useEffect, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'

import Navbar         from './components/layout/Navbar'
import Footer         from './components/layout/Footer'
import PageTransition from './components/ui/PageTransition'
import ChatBot        from './components/ui/ChatBot'

// ── Eagerly load Home (first paint) ──
import Home from './pages/Home'

// ── Lazy-load every other page ──
const Shop          = lazy(() => import('./pages/Shop'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const Warranty      = lazy(() => import('./pages/Warranty'))
const About         = lazy(() => import('./pages/About'))
const Contact       = lazy(() => import('./pages/Contact'))
const Locations     = lazy(() => import('./pages/Locations'))
const Blog          = lazy(() => import('./pages/Blog'))
const BlogPost      = lazy(() => import('./pages/BlogPost'))
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'))
const Terms         = lazy(() => import('./pages/Terms'))
const NotFound      = lazy(() => import('./pages/NotFound'))

// Minimal fallback — matches paper background so there's no flash
function PageFallback() {
  return <div style={{ minHeight: '60vh', background: 'var(--paper)' }} />
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function AppInner() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <ChatBot />
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/"            element={<PageTransition><Home /></PageTransition>} />
          <Route path="/shop"        element={<PageTransition><Shop /></PageTransition>} />
          <Route path="/shop/:slug"  element={<PageTransition><ProductDetail /></PageTransition>} />
          <Route path="/warranty"    element={<PageTransition><Warranty /></PageTransition>} />
          <Route path="/about"       element={<PageTransition><About /></PageTransition>} />
          <Route path="/contact"     element={<PageTransition><Contact /></PageTransition>} />
          <Route path="/locations"   element={<PageTransition><Locations /></PageTransition>} />
          <Route path="/blog"        element={<PageTransition><Blog /></PageTransition>} />
          <Route path="/blog/:slug"  element={<PageTransition><BlogPost /></PageTransition>} />
          <Route path="/privacy-policy" element={<PageTransition><PrivacyPolicy /></PageTransition>} />
          <Route path="/terms"       element={<PageTransition><Terms /></PageTransition>} />
          <Route path="*"            element={<PageTransition><NotFound /></PageTransition>} />
        </Routes>
      </Suspense>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AppInner />
      </BrowserRouter>
    </HelmetProvider>
  )
}
