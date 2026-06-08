import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Hero3D from '../components/Hero3D'

gsap.registerPlugin(ScrollTrigger)

/* ─── Scroll-triggered entrance hook ─── */
function useScrollEntrance() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ctx = gsap.context(() => {
      gsap.from(el.querySelectorAll('.animate-item'), {
        y: 30,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%' },
      })
    }, el)
    return () => ctx.revert()
  }, [])
  return ref
}

/* ─── Animated counter ─── */
function AnimatedCounter({ target, prefix = '', suffix = '' }: { target: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          const duration = 1500
          const start = performance.now()
          const animate = (now: number) => {
            const progress = Math.min((now - start) / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(Math.floor(eased * target))
            if (progress < 1) requestAnimationFrame(animate)
          }
          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [target])

  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  )
}

/* ─── Hero Section ─── */
function HeroSection() {
  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 500)
    return () => clearTimeout(t)
  }, [])

  return (
    <section className="relative w-full overflow-hidden" style={{ height: '92vh' }}>
      <Hero3D />

      {/* Overlay UI */}
      <div
        className="absolute inset-0 flex flex-col justify-between"
        style={{
          zIndex: 1,
          padding: 'clamp(80px, 15vh, 140px) clamp(20px, 5vw, 80px) clamp(40px, 8vh, 80px)',
          opacity: loaded ? 1 : 0,
          transform: loaded ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Top bar — pfp + "I bring..." + socials */}
        <div className="flex justify-between items-center">

          {/* Left: pfp + label */}
          <div className="flex items-center gap-3">
            <img
              src="/images/astropfp.png"
              alt="Astro_Nuel"
              style={{
                width: 'clamp(36px, 5vw, 48px)',
                height: 'clamp(36px, 5vw, 48px)',
                borderRadius: '50%',
                border: '2px solid var(--neon-cyan)',
                objectFit: 'cover',
                boxShadow: '0 0 14px rgba(0, 212, 255, 0.5)',
                flexShrink: 0,
              }}
            />
            <span
              className="font-mono-label"
              style={{
                fontSize: 'clamp(1rem, 2.5vw, 1.8rem)',
                letterSpacing: '0.08em',
                color: 'var(--text-primary)',
                fontWeight: 700,
                fontStyle: 'italic',
              }}
            >
              I bring...
            </span>
          </div>

          {/* Right: socials */}
          <div className="flex gap-4">
            <a
              href="https://x.com/Astro_nuel"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--text-muted)' }}
              className="transition-colors duration-300 hover:text-white"
            >
              <i className="fa-brands fa-x-twitter" style={{ fontSize: 18 }} />
            </a>
            <a
              href="https://t.me/AstroNuel"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--text-muted)' }}
              className="transition-colors duration-300 hover:text-white"
            >
              <i className="fa-brands fa-telegram" style={{ fontSize: 18 }} />
            </a>
            <a
              href="https://linktr.ee/astro_nuel"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--text-muted)' }}
              className="transition-colors duration-300 hover:text-white"
            >
              <i className="fa-solid fa-link" style={{ fontSize: 18 }} />
            </a>
          </div>
        </div>

        {/* Center CTA */}
        <div className="flex flex-col items-center justify-end flex-1 pb-0 mb-[-20px] gap-3">
          <Link
            to="/contact"
            className="btn-ghost"
            style={{
              opacity: loaded ? 1 : 0,
              transform: loaded ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s',
            }}
          >
            Work With Me
          </Link>
          <p
            style={{
              color: 'var(--text-muted)',
              fontSize: '0.75rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              opacity: loaded ? 0.6 : 0,
              transition: 'opacity 0.8s ease 0.5s',
            }}
          >
            Scroll to see what I've built
          </p>
        </div>

        {/* Bottom bar — scroll indicator */}
        <div className="flex justify-between items-end">
          <div className="flex flex-col items-center gap-2">
            <div
              style={{
                width: 1,
                height: 40,
                background: 'var(--text-muted)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: 3,
                  height: 3,
                  borderRadius: '50%',
                  background: 'var(--text-muted)',
                  position: 'absolute',
                  left: -1,
                  animation: 'scroll-dot 2s ease-in-out infinite',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile stats strip — pinned to bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 flex md:hidden justify-between items-center px-5 py-4"
        style={{
          zIndex: 2,
          background: 'linear-gradient(to top, rgba(5,5,5,0.95) 0%, transparent 100%)',
          borderTop: '1px solid rgba(0, 212, 255, 0.12)',
        }}
      >
        {[
          { value: '$8.2K', label: 'Raised' },
          { value: '700+', label: 'Onboarded' },
          { value: '5X', label: 'MC Growth' },
        ].map((s) => (
          <div key={s.label} className="text-center">
            <p
              style={{
                fontSize: '1.1rem',
                fontWeight: 700,
                color: 'var(--neon-cyan)',
                lineHeight: 1,
              }}
            >
              {s.value}
            </p>
            <p
              style={{
                fontSize: '0.6rem',
                color: 'var(--text-muted)',
                letterSpacing: '0.1em',
                marginTop: 2,
              }}
            >
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ─── Introduction Band ─── */
function IntroBand() {
  const ref = useScrollEntrance()
  return (
    <section style={{ background: 'var(--surface)' }} className="section-padding page-padding">
      <div ref={ref} className="content-narrow text-center">
        <p className="mono-label animate-item" style={{ color: 'var(--text-muted)' }}>WEB3 GROWTH STRATEGIST</p>
        <h2 className="text-display-l font-display mt-4 animate-item" style={{ color: 'var(--text-primary)' }}>
          I Turn Attention Into Users, Communities, and Traction.
        </h2>
        <p className="mt-6 animate-item" style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '1.05rem' }}>
          Most push content. I build systems. I understand attention, timing, and psychology — then I engineer conversion loops that turn observers into active community members and investors.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10 animate-item">
          <Link to="/contact" className="btn-primary">Start a Project</Link>
          <Link to="/results" className="btn-secondary">View Results &rarr;</Link>
        </div>
      </div>
    </section>
  )
}

/* ─── Proof Strip ─── */
function ProofStrip() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ctx = gsap.context(() => {
      gsap.from(el.querySelectorAll('.metric-item'), {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%' },
      })
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={ref}
      style={{
        background: 'var(--bg)',
        borderTop: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)',
      }}
      className="py-16 page-padding"
    >
      <div className="content-max grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
        {[
          { value: 8200, prefix: '$', suffix: '+', label: 'Presale Contributions' },
          { value: 700, suffix: '+', label: 'Community Members Onboarded' },
          { value: 150, prefix: '$', suffix: 'K+', label: 'Market Cap Growth' },
          { value: 3000, suffix: '+', label: 'X Followers Gained' },
        ].map((m) => (
          <div key={m.label} className="metric-item">
            <p className="text-display-l font-display" style={{ color: 'var(--neon-cyan)' }}>
              <AnimatedCounter target={m.value} prefix={m.prefix} suffix={m.suffix} />
            </p>
            <p className="mt-2" style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{m.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ─── Services Preview Grid ─── */
function ServicesGrid() {
  const ref = useScrollEntrance()
  const services = [
    { num: '01', title: 'Growth Strategy', desc: 'End-to-end campaign architecture from attention capture to conversion' },
    { num: '02', title: 'Content Systems', desc: 'Thread engineering, narrative crafting, viral positioning' },
    { num: '03', title: 'Community Building', desc: 'Engagement loops, ambassador programs, activation systems' },
    { num: '04', title: 'Pre-Launch Campaigns', desc: 'Presale strategy, whitelisting, hype sequencing' },
    { num: '05', title: 'X Management', desc: 'Account growth, content calendar, Spaces coordination' },
    { num: '06', title: 'Meme Marketing', desc: 'Viral positioning, cultural moment engineering, distribution' },
  ]

  return (
    <section style={{ background: 'var(--surface)' }} className="section-padding page-padding">
      <div ref={ref} className="content-max">
        <p className="mono-label animate-item" style={{ color: 'var(--text-muted)' }}>WHAT I DO</p>
        <h2 className="text-display-l font-display mt-3 animate-item" style={{ color: 'var(--text-primary)' }}>
          Systems That Convert
        </h2>
        <div className="mt-12" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 1 }}>
          {services.map((s) => (
            <div
              key={s.num}
              className="animate-item group cursor-pointer"
              style={{ background: 'var(--surface)', padding: 40 }}
            >
              <span className="font-mono-label" style={{ fontSize: '0.7rem', color: 'var(--neon-cyan)', opacity: 0.5 }}>{s.num}</span>
              <h3 className="mt-4" style={{ fontSize: '1.25rem', fontWeight: 500, color: 'var(--text-primary)' }}>{s.title}</h3>
              <p className="mt-3" style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6 }}>{s.desc}</p>
              <span className="block mt-6 transition-all duration-300 group-hover:translate-x-1" style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>
                &rarr;
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Projects Showcase ─── */
function ProjectsShowcase() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const ref = useScrollEntrance()

  const projects = [
  { name: 'PIXP Token', tagline: '$4K presale raised', image: '/images/project-pixp.jpg' },
  { name: 'HoneyLand', tagline: '250+ gamers converted', image: '/images/project-honeyland.jpg' },
  { name: 'Fooz Token', tagline: '$5K → $150K+ market cap in a week', image: '/images/project-fooz.jpg' },
  { name: 'RACE Protocol', tagline: '700+ onboarding campaign', image: '/images/project-race.jpg' },
  { name: 'FundiLabs', tagline: '20+ investors connected', image: '/images/project-fundylabs.jpg' },
  { name: 'GMC', tagline: 'Community scaling system', image: '/images/project-gmc.jpg' },
  { name: 'GameX Labs', tagline: '100 → 3K+ X account growth in a month', image: '/images/project-gamex.jpg' },
  {name: 'Xpend', tagline: '200+ users onboarded • $200K+ transaction volume', image: '/images/project-xpend.jpg'},
]

  const scroll = (dir: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 424, behavior: 'smooth' })
    }
  }

  return (
    <section style={{ background: 'var(--bg)' }} className="section-padding overflow-hidden">
      <div ref={ref} className="content-max page-padding mb-10">
        <p className="mono-label animate-item" style={{ color: 'var(--text-muted)' }}>SELECTED WORK</p>
        <h2 className="text-display-l font-display mt-3 animate-item" style={{ color: 'var(--text-primary)' }}>
          Projects Backed by Strategy
        </h2>
      </div>

      <div className="relative">
        {/* Arrow buttons */}
        <button
          onClick={() => scroll(-1)}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 hidden md:flex items-center justify-center transition-all duration-300"
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.15)',
            color: 'var(--text-primary)',
            background: 'rgba(5,5,5,0.8)',
          }}
        >
          <i className="fa-solid fa-chevron-left" />
        </button>
        <button
          onClick={() => scroll(1)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 hidden md:flex items-center justify-center transition-all duration-300"
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.15)',
            color: 'var(--text-primary)',
            background: 'rgba(5,5,5,0.8)',
          }}
        >
          <i className="fa-solid fa-chevron-right" />
        </button>

        {/* Scrollable gallery */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto px-6 md:px-20 pb-4"
          style={{ scrollSnapType: 'x mandatory', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {projects.map((p, i) => (
            <div
              key={p.name}
              className="flex-shrink-0 group cursor-pointer"
              style={{
                width: 400,
                maxWidth: '85vw',
                aspectRatio: '16/10',
                borderRadius: 12,
                overflow: 'hidden',
                position: 'relative',
                scrollSnapAlign: 'start',
                animationDelay: `${i * 0.1}s`,
              }}
            >
              <img
                src={p.image}
                alt={p.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(transparent 40%, rgba(5,5,5,0.95) 100%)' }}
              />
              <div className="absolute bottom-0 left-0 p-6">
                <h3 style={{ fontSize: '1.25rem', fontWeight: 500, color: 'var(--text-primary)' }}>{p.name}</h3>
                <p className="mt-1" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.tagline}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── CTA Band ─── */
function CTABand() {
  const ref = useScrollEntrance()
  return (
    <section
      className="section-padding page-padding"
      style={{ background: 'linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 50%, #0a0a1a 100%)' }}
    >
      <div ref={ref} className="content-narrow text-center">
        <h2 className="text-display-l font-display animate-item" style={{ color: 'var(--text-primary)' }}>
          Ready to Scale?
        </h2>
        <p className="mt-6 animate-item" style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>
          Every project is different. Let's architect a growth system tailored to your community, timeline, and goals.
        </p>
        <Link to="/contact" className="btn-ghost mt-10 inline-block animate-item">
          Start a Conversation
        </Link>
      </div>
    </section>
  )
}

/* ─── Home Page ─── */
export default function Home() {
  return (
    <>
      <HeroSection />
      <IntroBand />
      <ProofStrip />
      <ServicesGrid />
      <ProjectsShowcase />
      <CTABand />
    </>
  )
}