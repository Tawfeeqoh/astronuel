import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Navigation from './components/Navigation'
import Footer from './components/Footer'
import Home from './pages/Home'
import Results from './pages/Results'
import Services from './pages/Services'
import About from './pages/About'
import Contact from './pages/Contact'

function App() {
  const location = useLocation()
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    setIsTransitioning(true)
    const timer = setTimeout(() => setIsTransitioning(false), 500)
    return () => clearTimeout(timer)
  }, [location.pathname])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <div className="relative min-h-screen" style={{ background: 'var(--bg)' }}>
      
      <Navigation />

      {/* Page transition overlay */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'var(--bg)',
          zIndex: 9999,
          opacity: isTransitioning ? 1 : 0,
          transition: 'opacity 0.3s ease-in',
        }}
      />

      <main
        className="transition-all duration-500"
        style={{
          opacity: isTransitioning ? 0 : 1,
          transform: isTransitioning ? 'translateY(20px)' : 'translateY(0)',
          transitionTimingFunction: isTransitioning
            ? 'cubic-bezier(0.55, 0, 1, 0.45)'
            : 'cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/results" element={<Results />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>

      <Footer />
    </div>
  )
}

export default App
