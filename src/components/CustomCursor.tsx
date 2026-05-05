import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const posRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 })
  const isHoveringRef = useRef(false)

  useEffect(() => {
    // Only on desktop
    if (window.matchMedia('(pointer: coarse)').matches) return
    if (!cursorRef.current) return

    const cursor = cursorRef.current
    cursor.style.display = 'block'

    const onMouseMove = (e: MouseEvent) => {
      posRef.current.targetX = e.clientX
      posRef.current.targetY = e.clientY
    }

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.classList.contains('cursor-pointer')
      ) {
        isHoveringRef.current = true
      }
    }

    const onMouseOut = () => {
      isHoveringRef.current = false
    }

    let rafId: number
    const animate = () => {
      const pos = posRef.current
      pos.x += (pos.targetX - pos.x) * 0
      pos.y += (pos.targetY - pos.y) * 0

      if (cursor) {
        const size = isHoveringRef.current ? 40 : 8
        const border = isHoveringRef.current ? '1px solid var(--neon-cyan)' : 'none'
        const bg = isHoveringRef.current ? 'transparent' : 'var(--neon-cyan)'

        cursor.style.transform = `translate(${pos.x - size / 2}px, ${pos.y - size / 2}px)`
        cursor.style.width = `${size}px`
        cursor.style.height = `${size}px`
        cursor.style.border = border
        cursor.style.background = bg
      }

      rafId = requestAnimationFrame(animate)
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseover', onMouseOver)
    document.addEventListener('mouseout', onMouseOut)
    rafId = requestAnimationFrame(animate)

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseover', onMouseOver)
      document.removeEventListener('mouseout', onMouseOut)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <div
      ref={cursorRef}
      className="hidden lg:block fixed top-0 left-0 pointer-events-none"
      style={{
        zIndex: 10000,
        borderRadius: '50%',
        background: 'var(--neon-cyan)',
        width: 8,
        height: 8,
        mixBlendMode: 'difference',
        transition: 'width 0.3s, height 0.3s, background 0.3s, border 0.3s',
        willChange: 'transform',
      }}
    />
  )
}
