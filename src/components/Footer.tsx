import { Link } from 'react-router-dom'

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Results', path: '/results' },
  { label: 'Services', path: '/services' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
]

const socialLinks = [
  { icon: 'fa-brands fa-x-twitter', label: 'X (Twitter)', href: 'https://x.com/Astro_nuel' },
  { icon: 'fa-brands fa-telegram', label: 'Telegram', href: 'https://t.me/AstroNuel' },
  { icon: 'fa-brands fa-discord', label: 'Discord', href: '#' },
  { icon: 'fa-solid fa-link', label: 'Linktree', href: 'https://linktr.ee/astro_nuel' },
]

export default function Footer() {
  return (
    <footer style={{ background: 'var(--bg)', borderTop: '1px solid var(--border-subtle)' }}>
      <div className="content-max page-padding py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Column 1 - Brand */}
          <div>
            <Link to="/" className="font-mono-label block mb-3" style={{ fontSize: '0.8rem', letterSpacing: '0.15em', color: 'var(--text-primary)', textDecoration: 'none' }}>
              ASTRO
            </Link>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              Web3 Growth Strategist
            </p>
            <div className="mt-4 flex items-center gap-3">
              <img
                src="/images/astro-profile.jpg"
                alt="Astro"
                className="rounded-full"
                style={{ width: 36, height: 36, objectFit: 'cover' }}
              />
              <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                Growth Operator & Systems Builder
              </span>
            </div>
          </div>

          {/* Column 2 - Navigation */}
          <div>
            <p className="mono-label mb-4" style={{ color: 'var(--text-muted)' }}>Navigation</p>
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="transition-colors duration-300"
                  style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textDecoration: 'none' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 3 - Social */}
          <div>
            <p className="mono-label mb-4" style={{ color: 'var(--text-muted)' }}>Connect</p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors duration-300"
                  style={{ color: 'var(--text-muted)', fontSize: '1.25rem', textDecoration: 'none' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--neon-cyan)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                  aria-label={social.label}
                >
                  <i className={social.icon} />
                </a>
              ))}
            </div>
            <p className="mt-6" style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
              <i className="fa-solid fa-envelope mr-2" />
              astronuel904@gmailcom
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className="mt-10 pt-5 flex flex-col sm:flex-row justify-between items-center gap-4"
          style={{ borderTop: '1px solid var(--border-subtle)' }}
        >
          <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
            &copy; 2026 Astro. All rights reserved.
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
            Built with intention.
          </p>
        </div>
      </div>
    </footer>
  )
}
