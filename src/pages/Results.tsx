import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ProofGallery3D from '../components/ProofGallery3D'

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

const results = [
  { metric: '$4K', detail: 'PIXP Token presale raised through campaign execution' },
  { metric: '$8,200', detail: 'DOOKIE presale raised' },
  { metric: '$5K → $150K+', detail: 'FOOZ Token market cap growth in one week' },
  { metric: '250+', detail: 'HoneyLand Gamers converted within launch window' },
  { metric: '700+', detail: 'RACE Protocol onboarding campaign' },
  { metric: '100 → 3,000+', detail: 'GameX Labs X account growth in a month' },
  { metric: '2–5X', detail: 'Overall market cap growth multiplier' },
  { metric: '200+', detail: 'Xpend users onboarded and activated within the first month' },
  { metric: '$200K+', detail: 'Transaction volume generated on the platform within the first month' },
]
const testimonials = [
  {
    quote: "Astro didn't just run a campaign, he architected a full growth system. Our community went from 70 to 500+ members in under a month. The engagement loops he built are still driving organic growth.",
    author: 'Project Lead, GameX Labs',
  },
  {
    quote: "The presale campaign exceeded our targets by 40%. Astro understands Web3 psychology at a level most marketers don't. Every piece of content had a strategic purpose.",
    author: 'Founder, PIXP Token',
  },
  {
    quote: "Astro just gets it. Didn't need much back and forth, he understood what we were building and started opening the right doors almost immediately. A lot of people promise exposure, he actually brought conversations that mattered.",
    author: 'Founder, FundiLabs',
  },
  {
    quote: "What I liked about working with Astro is he didn't treat this like another promo job. He actually cared about getting people into the game and trying it. We saw real activity, real players coming in, not just empty traffic.",
    author: 'Founder, HoneyLand',
  },
  {
  quote: "Within less than a month, Astro helped onboard over 200 users and contributed significantly to platform activity. The growth execution was consistent, measurable, and delivered real transaction volume.",
  author: 'Core Team, Xpend',
},
]

export default function Results() {
  const headerRef = useScrollEntrance()
  const listRef = useRef<HTMLDivElement>(null)
  const testimonialsRef = useScrollEntrance()

  useEffect(() => {
    const el = listRef.current
    if (!el) return
    const ctx = gsap.context(() => {
      gsap.from(el.querySelectorAll('.result-row'), {
        x: -40, opacity: 0, duration: 0.6, stagger: 0.1,
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
          <p className="mono-label animate-item" style={{ color: 'var(--text-muted)' }}>THE EVIDENCE</p>
          <h1 className="text-display-xl font-display mt-4 animate-item" style={{ color: 'var(--text-primary)' }}>
            Results, Not Promises
          </h1>
          <p className="mt-6 animate-item" style={{ color: 'var(--text-muted)', maxWidth: 600, lineHeight: 1.7 }}>
            Real campaigns. Real communities. Real growth.
          </p>
        </div>
      </section>

      {/* 3D Proof Gallery */}
      <section style={{ background: 'var(--bg)' }}>
        <ProofGallery3D />
      </section>

      {/* Results List */}
      <section style={{ background: 'var(--surface)' }} className="section-padding page-padding">
        <div ref={listRef} className="content-narrow">
          {results.map((r, i) => (
            <div
              key={i}
              className="result-row flex items-center justify-between py-10"
              style={{ borderBottom: '1px solid var(--border-subtle)' }}
            >
              <div>
                <p className="text-display-l font-display" style={{ color: 'var(--neon-cyan)' }}>{r.metric}</p>
                <p className="mt-2" style={{ color: 'var(--text-muted)' }}>{r.detail}</p>
              </div>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: 'var(--neon-cyan)',
                  flexShrink: 0,
                  marginLeft: 20,
                }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ background: 'var(--bg)' }} className="section-padding page-padding">
        <div ref={testimonialsRef} className="content-max">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="animate-item"
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 12,
                  padding: 40,
                }}
              >
                <p style={{ color: 'var(--text-primary)', fontStyle: 'italic', lineHeight: 1.7 }}>
                  "{t.quote}"
                </p>
                <p className="mt-6" style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  — {t.author}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="section-padding page-padding"
        style={{ background: 'linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 50%, #0a0a1a 100%)' }}
      >
        <div className="content-narrow text-center">
          <h2 className="text-display-l font-display" style={{ color: 'var(--text-primary)' }}>
            Want Results Like These?
          </h2>
          <p className="mt-6" style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>
            Let's build a growth system tailored to your project.
          </p>
          <Link to="/contact" className="btn-ghost mt-10 inline-block">
            Let's Talk Strategy
          </Link>
        </div>
      </section>
    </>
  )
}
