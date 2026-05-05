import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Results', path: '/results' },
  { label: 'Services', path: '/services' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
]

export default function Navigation() {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname === path
  }

  return (
    <>
      {/* ── Mobile Header ── */}
      <header
        className="fixed top-0 left-0 right-0 flex md:hidden items-center justify-between px-5"
        style={{ zIndex: 1000, height: 64 }}
      >
        {/* Wordmark — left aligned */}
        <Link
          to="/"
          className="font-mono-label"
          style={{
            fontSize: '0.8rem',
            letterSpacing: '0.15em',
            color: 'var(--text-primary)',
            textDecoration: 'none',
          }}
        >
          ASTRONUEL
        </Link>

        {/* Hamburger — bare, outside any pill */}
        <button
          className="flex flex-col gap-1.5 p-2"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <span className="block w-6 h-px bg-white" />
          <span className="block w-6 h-px bg-white" />
          <span className="block w-4 h-px bg-white" />
        </button>
      </header>

      {/* ── Desktop Header ── */}
      <header
        className="fixed top-0 left-0 right-0 hidden md:flex justify-center"
        style={{ zIndex: 1000, height: 64 }}
      >
        <nav
          className="flex items-center gap-6 mt-5 px-6"
          style={{
            background: 'var(--glass-bg)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 100,
            height: 48,
            width: 'fit-content',
          }}
        >
          {/* Wordmark */}
          <Link
            to="/"
            className="font-mono-label"
            style={{
              fontSize: '0.8rem',
              letterSpacing: '0.15em',
              color: 'var(--text-primary)',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            ASTRONUEL
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="relative transition-colors duration-300"
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  color: isActive(link.path) ? 'var(--text-primary)' : 'var(--text-muted)',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                onMouseLeave={(e) => {
                  if (!isActive(link.path)) {
                    e.currentTarget.style.color = 'var(--text-muted)'
                  }
                }}
              >
                {link.label}
                {isActive(link.path) && (
                  <span
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2"
                    style={{
                      width: 4,
                      height: 4,
                      borderRadius: '50%',
                      background: 'var(--neon-cyan)',
                    }}
                  />
                )}
              </Link>
            ))}
          </div>

          
        </nav>
      </header>

      {/* ── Mobile Menu Overlay ── */}
      <div
        className="fixed inset-0 flex flex-col items-center justify-center gap-8 md:hidden"
        style={{
          background: 'rgba(5, 5, 5, 0.98)',
          backdropFilter: 'blur(30px)',
          zIndex: 1001,
          opacity: mobileOpen ? 1 : 0,
          pointerEvents: mobileOpen ? 'all' : 'none',
          transition: 'opacity 0.3s ease',
          overflowY: 'auto',
          padding: '80px 24px 40px',
        }}
      >
        {/* Close */}
        <button
          className="absolute top-6 right-6 p-2"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
        >
          <i className="fa-solid fa-xmark text-2xl" style={{ color: 'var(--text-primary)' }} />
        </button>

        {/* Nav links */}
        {navLinks.map((link, i) => (
          <Link
            key={link.path}
            to={link.path}
            className="font-display transition-colors duration-300"
            style={{
              fontSize: 'clamp(2rem, 8vw, 3.5rem)',
              fontWeight: 700,
              color: isActive(link.path) ? 'var(--neon-cyan)' : 'var(--text-primary)',
              textDecoration: 'none',
              opacity: mobileOpen ? 1 : 0,
              transform: mobileOpen ? 'translateY(0)' : 'translateY(20px)',
              transition: `opacity 0.4s ease ${i * 0.06}s, transform 0.4s ease ${i * 0.06}s`,
            }}
            onClick={() => setMobileOpen(false)}
          >
            {link.label}
          </Link>
        ))}

        

        {/* Socials */}
        <div
          className="flex gap-6 mt-4"
          style={{
            opacity: mobileOpen ? 1 : 0,
            transition: 'opacity 0.4s ease 0.42s',
          }}
        >
          <a href="https://x.com/Astro_nuel" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)' }}>
            <i className="fa-brands fa-x-twitter text-xl" />
          </a>
          <a href="https://t.me/AstroNuel" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)' }}>
            <i className="fa-brands fa-telegram text-xl" />
          </a>
          <a href="https://linktr.ee/astro_nuel" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)' }}>
            <i className="fa-solid fa-link text-xl" />
          </a>
        </div>
      </div>
    </>
  )
}