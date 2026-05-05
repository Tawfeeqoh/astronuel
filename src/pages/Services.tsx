import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ParticleCloud from '../components/ParticleCloud'

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

const services = [
  {
    num: '01',
    title: 'Growth Strategy',
    description: 'End-to-end campaign architecture that maps attention to conversion',
    features: ['Campaign planning', 'Funnel design', 'KPI frameworks', 'Timeline architecture'],
  },
  {
    num: '02',
    title: 'Content Systems',
    description: 'Engineered content that captures attention and drives action',
    features: ['Thread engineering', 'Narrative crafting', 'Viral positioning', 'Distribution strategy'],
  },
  {
    num: '03',
    title: 'Community Building',
    description: 'Engagement systems that turn observers into active participants',
    features: ['Ambassador programs', 'Activation loops', 'Retention systems', 'Moderation frameworks'],
  },
  {
    num: '04',
    title: 'Pre-Launch Campaigns',
    description: 'Presale and launch sequencing that builds momentum before day one',
    features: ['Whitelist strategy', 'Hype sequencing', 'Investor outreach', 'Launch day coordination'],
  },
  {
    num: '05',
    title: 'X Management',
    description: 'Account growth and content systems for maximum reach',
    features: ['Content calendar', 'Engagement tactics', 'Spaces coordination', 'Follower growth'],
  },
  {
    num: '06',
    title: 'Meme Marketing',
    description: 'Cultural moment engineering that makes projects unforgettable',
    features: ['Meme strategy', 'Trend hijacking', 'Community content', 'Viral distribution'],
  },
]

export default function Services() {
  const headerRef = useScrollEntrance()
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = gridRef.current
    if (!el) return
    const ctx = gsap.context(() => {
      gsap.from(el.querySelectorAll('.service-card'), {
        y: 40, opacity: 0, duration: 0.6, stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%' },
      })
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <>
      {/* Page Header */}
      <section style={{ background: 'var(--bg)', paddingTop: 160, paddingBottom: 80 }} className="page-padding">
        <div ref={headerRef} className="content-max">
          <p className="mono-label animate-item" style={{ color: 'var(--text-muted)' }}>THE SYSTEM</p>
          <h1 className="text-display-xl font-display mt-4 animate-item" style={{ color: 'var(--text-primary)' }}>
            What I Build
          </h1>
          <p className="mt-6 animate-item" style={{ color: 'var(--text-muted)', maxWidth: 600, lineHeight: 1.7 }}>
            Not services — growth systems engineered for Web3 communities.
          </p>
        </div>
      </section>

      {/* Services Detail Grid */}
      <section style={{ background: 'var(--surface)' }} className="section-padding page-padding">
        <div ref={gridRef} className="content-max">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 1 }}>
            {services.map((s) => (
              <div
                key={s.num}
                className="service-card"
                style={{ background: 'var(--surface)', padding: '60px 40px', borderBottom: '1px solid var(--border-subtle)' }}
              >
                <span className="font-mono-label" style={{ fontSize: '1rem', color: 'var(--neon-cyan)', opacity: 0.4 }}>
                  {s.num}
                </span>
                <h3 className="text-heading font-display mt-5" style={{ color: 'var(--text-primary)' }}>
                  {s.title}
                </h3>
                <p className="mt-4" style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>
                  {s.description}
                </p>
                <ul className="mt-6 flex flex-col gap-2">
                  {s.features.map((f) => (
                    <li key={f} style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                      <span style={{ color: 'var(--neon-cyan)', marginRight: 8 }}>&bull;</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/contact"
                  className="inline-block mt-8 transition-colors duration-300"
                  style={{ color: 'var(--neon-cyan)', fontSize: '0.875rem', textDecoration: 'none' }}
                >
                  Learn More &rarr;
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Particle Cloud — Strategy Visualization */}
      <section
        className="relative overflow-hidden"
        style={{ height: '80vh', minHeight: 500, background: 'var(--surface)' }}
      >
        <ParticleCloud />
        {/* Overlay gradient for text readability */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 30%, #0a0a0a 80%)',
            zIndex: 1,
          }}
        />
        {/* Content overlay */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center text-center"
          style={{ zIndex: 2, padding: '0 clamp(20px, 5vw, 80px)' }}
        >
          <div className="content-narrow">
            <h2 className="text-display-l font-display" style={{ color: 'var(--text-primary)' }}>
              Attention &rarr; Engagement &rarr; Trust &rarr; Action
            </h2>
            <p className="mt-6" style={{ color: 'rgba(245,245,245,0.7)', lineHeight: 1.7 }}>
              This is the conversion loop. Every system I build maps to this flow. Attention without engagement is noise. Engagement without trust is fleeting. Trust without action is wasted.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="section-padding page-padding"
        style={{ background: 'linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 50%, #0a0a1a 100%)' }}
      >
        <div className="content-narrow text-center">
          <h2 className="text-display-l font-display" style={{ color: 'var(--text-primary)' }}>
            Let's Architect Your Growth
          </h2>
          <p className="mt-6" style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>
            Book a strategy session. No pitch — just a clear assessment of where you are and what system will get you where you want to be.
          </p>
          <Link to="/contact" className="btn-ghost mt-10 inline-block">
            Book a Session
          </Link>
        </div>
      </section>
    </>
  )
}
