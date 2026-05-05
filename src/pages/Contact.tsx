import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

function useScrollEntrance() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ctx = gsap.context(() => {
      gsap.from(el.querySelectorAll('.animate-item'), {
        y: 30, opacity: 0, duration: 0.7, stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%' },
      })
    }, el)
    return () => ctx.revert()
  }, [])
  return ref
}

const contactMethods = [
  { icon: 'fa-brands fa-x-twitter', label: 'X (Twitter)', value: '@Astro_nuel', href: 'https://x.com/Astro_nuel' },
  { icon: 'fa-brands fa-telegram', label: 'Telegram', value: '@AstroNuel', href: 'https://t.me/AstroNuel' },
  { icon: 'fa-brands fa-discord', label: 'Discord', value: 'AstroNuel', href: '#' },
]

export default function Contact() {
  const headerRef = useScrollEntrance()
  const formRef = useScrollEntrance()
  const directRef = useScrollEntrance()

  const [formData, setFormData] = useState({ name: '', email: '', project: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setFormData({ name: '', email: '', project: '', message: '' })
      setSubmitted(false)
    }, 3000)
  }

  return (
    <>
      {/* Page Header */}
      <section style={{ background: 'var(--bg)', paddingTop: 160, paddingBottom: 80 }} className="page-padding">
        <div ref={headerRef} className="content-max">
          <p className="mono-label animate-item" style={{ color: 'var(--text-muted)' }}>GET IN TOUCH</p>
          <h1 className="text-display-xl font-display mt-4 animate-item" style={{ color: 'var(--text-primary)' }}>
            Let's Build
          </h1>
          <p className="mt-6 animate-item" style={{ color: 'var(--text-muted)', maxWidth: 600, lineHeight: 1.7 }}>
            Have a project in mind? Let's talk strategy.
          </p>
        </div>
      </section>

      {/* Contact Form */}
      <section style={{ background: 'var(--surface)' }} className="section-padding page-padding">
        <div ref={formRef} className="content-narrow">
          {submitted ? (
            <div className="text-center py-20 animate-item">
              <div
                className="inline-flex items-center justify-center mb-6"
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  border: '2px solid var(--neon-cyan)',
                }}
              >
                <i className="fa-solid fa-check" style={{ color: 'var(--neon-cyan)', fontSize: 24 }} />
              </div>
              <h3 className="text-heading font-display" style={{ color: 'var(--text-primary)' }}>
                Message Sent
              </h3>
              <p className="mt-3" style={{ color: 'var(--text-muted)' }}>
                I'll get back to you within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
              {[
                { name: 'name', placeholder: 'Your name', type: 'text' },
                { name: 'email', placeholder: 'your@email.com', type: 'email' },
                { name: 'project', placeholder: 'Project or company name', type: 'text' },
              ].map((field) => (
                <div key={field.name} className="animate-item">
                  <input
                    type={field.type}
                    name={field.name}
                    placeholder={field.placeholder}
                    value={formData[field.name as keyof typeof formData]}
                    onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                    required
                    className="w-full bg-transparent outline-none transition-colors duration-300"
                    style={{
                      border: 'none',
                      borderBottom: '1px solid rgba(255,255,255,0.15)',
                      color: 'var(--text-primary)',
                      padding: '16px 0',
                      fontSize: '1rem',
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderBottomColor = 'var(--neon-cyan)')}
                    onBlur={(e) => (e.currentTarget.style.borderBottomColor = 'rgba(255,255,255,0.15)')}
                  />
                </div>
              ))}
              <div className="animate-item">
                <textarea
                  name="message"
                  placeholder="Tell me about your project, timeline, and goals..."
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  className="w-full bg-transparent outline-none transition-colors duration-300 resize-none"
                  style={{
                    border: 'none',
                    borderBottom: '1px solid rgba(255,255,255,0.15)',
                    color: 'var(--text-primary)',
                    padding: '16px 0',
                    fontSize: '1rem',
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderBottomColor = 'var(--neon-cyan)')}
                  onBlur={(e) => (e.currentTarget.style.borderBottomColor = 'rgba(255,255,255,0.15)')}
                />
              </div>
              <div className="animate-item mt-4">
                <button
                  type="submit"
                  className="btn-primary w-full sm:w-auto transition-all duration-400"
                  style={{ padding: '16px 48px', fontSize: '1rem' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#33ddff'
                    e.currentTarget.style.boxShadow = '0 0 40px rgba(0,212,255,0.2)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'var(--neon-cyan)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  Send Message
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* Direct Contact */}
      <section style={{ background: 'var(--bg)' }} className="py-20 page-padding">
        <div ref={directRef} className="content-narrow">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
            {contactMethods.map((c) => (
              <a
                key={c.label}
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                className="animate-item flex flex-col items-center text-center group"
                style={{ textDecoration: 'none' }}
              >
                <i
                  className={c.icon}
                  style={{
                    fontSize: 24,
                    color: 'var(--neon-cyan)',
                    transition: 'transform 0.3s ease',
                  }}
                />
                <p className="mt-4" style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  {c.label}
                </p>
                <p
                  className="mt-1 transition-colors duration-300 group-hover:text-cyan-400"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {c.value}
                </p>
              </a>
            ))}
          </div>

          {/* Linktree */}
          <div className="animate-item mt-12 text-center">
            <a
              href="https://linktr.ee/astro_nuel"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 transition-all duration-300"
              style={{
                color: 'var(--neon-cyan)',
                textDecoration: 'none',
                border: '1px solid rgba(0, 212, 255, 0.3)',
                borderRadius: 100,
                padding: '12px 32px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(0, 212, 255, 0.1)'
                e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 212, 255, 0.15)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <i className="fa-solid fa-link" />
              <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>All Links — Linktree</span>
            </a>
          </div>
        </div>
      </section>

      {/* Social Links Band */}
      <section
        className="py-16 page-padding"
        style={{ background: 'var(--surface)', borderTop: '1px solid var(--border-subtle)' }}
      >
        <div className="content-narrow text-center">
          <p className="mono-label mb-8" style={{ color: 'var(--text-muted)' }}>FOLLOW THE JOURNEY</p>
          <div className="flex justify-center gap-8">
            {[
              { icon: 'fa-brands fa-x-twitter', href: 'https://x.com/Astro_nuel', label: 'X' },
              { icon: 'fa-brands fa-telegram', href: 'https://t.me/AstroNuel', label: 'Telegram' },
              { icon: 'fa-brands fa-discord', href: '#', label: 'Discord' },
              { icon: 'fa-solid fa-link', href: 'https://linktr.ee/astro_nuel', label: 'Linktree' },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-all duration-300"
                style={{
                  color: 'var(--text-muted)',
                  fontSize: '1.5rem',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--neon-cyan)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                aria-label={s.label}
              >
                <i className={s.icon} />
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
