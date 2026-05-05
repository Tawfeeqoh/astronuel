import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
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

const principles = [
  {
    title: 'Conversion First',
    description: 'Every decision maps to a conversion outcome. No vanity metrics.',
  },
  {
    title: 'Attention Engineering',
    description: 'Understanding where attention flows and how to intercept it.',
  },
  {
    title: 'Community as Asset',
    description: 'Building self-sustaining communities that generate their own growth.',
  },
]

export default function About() {
  const headerRef = useScrollEntrance()
  const bioRef = useScrollEntrance()
  const philosophyRef = useScrollEntrance()

  return (
    <>
      {/* Page Header */}
      <section style={{ background: 'var(--bg)', paddingTop: 160, paddingBottom: 80 }} className="page-padding">
        <div ref={headerRef} className="content-max">
          <p className="mono-label animate-item" style={{ color: 'var(--text-muted)' }}>THE STRATEGIST</p>
          <h1 className="text-display-xl font-display mt-4 animate-item" style={{ color: 'var(--text-primary)' }}>
            AstroNuel
          </h1>
          <p className="mt-6 animate-item" style={{ color: 'var(--text-muted)', maxWidth: 600, lineHeight: 1.7 }}>
            Growth operator. Systems builder. Converting attention into traction since 2021.
          </p>
        </div>
      </section>

      {/* Bio Section */}
      <section style={{ background: 'var(--surface)' }} className="section-padding page-padding">
        <div ref={bioRef} className="content-max">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            {/* Profile Image */}
            <div className="animate-item flex justify-center md:justify-start">
              <div
                style={{
                  maxWidth: 400,
                  width: '100%',
                  aspectRatio: '3/4',
                  borderRadius: 12,
                  overflow: 'hidden',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                }}
              >
                <img
                  src="/images/astro-profile.jpg"
                  alt="Astro - Web3 Growth Strategist"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Bio Text */}
            <div className="animate-item">
              <h2 className="text-heading font-display" style={{ color: 'var(--text-primary)' }}>
                I Focus on Conversion, Not Impressions.
              </h2>
              <div className="mt-6 flex flex-col gap-5" style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>
                <p>
                  Most marketers push content. I build systems. I understand that in Web3, attention is the most scarce resource — and converting that attention into community, investment, and traction requires a completely different approach.
                </p>
                <p>
                  Since 2021, I've architected growth systems for tokens, protocols, and community-driven projects. From presale campaigns that raised $8,200+ to community scaling from 70 to 500+ members — every project gets a custom-built system, not a cookie-cutter playbook.
                </p>
                <p>
                  I understand attention, timing, and psychology. Then I engineer the loops that make conversion inevitable.
                </p>
              </div>
              <Link
                to="/contact"
                className="inline-block mt-8 transition-colors duration-300 hover:underline"
                style={{ color: 'var(--neon-cyan)', textDecoration: 'none' }}
              >
                Work With Me &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section style={{ background: 'var(--bg)' }} className="section-padding page-padding">
        <div ref={philosophyRef} className="content-narrow">
          <h2 className="text-display-l font-display text-center animate-item" style={{ color: 'var(--text-primary)' }}>
            Systems Over Tactics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-16">
            {principles.map((p) => (
              <div key={p.title} className="animate-item text-center md:text-left">
                <p className="font-mono-label" style={{ color: 'var(--neon-cyan)', fontSize: '0.8rem' }}>
                  {p.title}
                </p>
                <p className="mt-4" style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>
                  {p.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What Sets Me Apart */}
      <section style={{ background: 'var(--surface)' }} className="section-padding page-padding">
        <div className="content-narrow">
          <h2 className="text-display-l font-display text-center" style={{ color: 'var(--text-primary)' }}>
            The Difference
          </h2>
          <div className="mt-12 flex flex-col gap-6">
            {[
              { text: 'I focus on conversion, not impressions.', highlight: 'conversion' },
              { text: 'Most push content. I build systems.', highlight: 'systems' },
              { text: 'I understand attention, timing, and psychology.', highlight: 'attention' },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-6 py-6"
                style={{ borderBottom: '1px solid var(--border-subtle)' }}
              >
                <span
                  className="font-mono-label flex-shrink-0"
                  style={{ color: 'var(--neon-cyan)', fontSize: '0.8rem', opacity: 0.6 }}
                >
                  0{i + 1}
                </span>
                <p className="text-heading font-display" style={{ color: 'var(--text-primary)' }}>
                  {item.text.split(item.highlight).map((part, j, arr) => (
                    <span key={j}>
                      {part}
                      {j < arr.length - 1 && (
                        <span style={{ color: 'var(--neon-cyan)' }}>{item.highlight}</span>
                      )}
                    </span>
                  ))}
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
            Let's Build Something
          </h2>
          <p className="mt-6" style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>
            Ready to turn attention into traction? Let's talk.
          </p>
          <Link to="/contact" className="btn-ghost mt-10 inline-block">
            Start a Conversation
          </Link>
        </div>
      </section>
    </>
  )
}
