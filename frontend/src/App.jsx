import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'

import Navbar         from './components/layout/Navbar'
import Footer         from './components/layout/Footer'
import PageTransition from './components/ui/PageTransition'
import SplashScreen   from './components/ui/SplashScreen'

import Home          from './pages/Home'
import Shop          from './pages/Shop'
import ProductDetail from './pages/ProductDetail'
import Warranty      from './pages/Warranty'
import About         from './pages/About'
import Contact       from './pages/Contact'
import Locations     from './pages/Locations'
import Blog          from './pages/Blog'
import BlogPost      from './pages/BlogPost'
import NotFound      from './pages/NotFound'

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
      <Routes>
        <Route path="/"           element={<PageTransition><Home /></PageTransition>} />
        <Route path="/shop"       element={<PageTransition><Shop /></PageTransition>} />
        <Route path="/shop/:slug" element={<PageTransition><ProductDetail /></PageTransition>} />
        <Route path="/warranty"   element={<PageTransition><Warranty /></PageTransition>} />
        <Route path="/about"      element={<PageTransition><About /></PageTransition>} />
        <Route path="/contact"    element={<PageTransition><Contact /></PageTransition>} />
        <Route path="/locations"  element={<PageTransition><Locations /></PageTransition>} />
        <Route path="/blog"       element={<PageTransition><Blog /></PageTransition>} />
        <Route path="/blog/:slug" element={<PageTransition><BlogPost /></PageTransition>} />
        <Route path="*"           element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
      <Footer />
    </>
  )
}

export default function App() {
  const [splash, setSplash] = useState(true)

  return (
    <>
      {splash && <SplashScreen onDone={() => setSplash(false)} />}
      <BrowserRouter>
        <AppInner />
      </BrowserRouter>
    </>
  )
}
