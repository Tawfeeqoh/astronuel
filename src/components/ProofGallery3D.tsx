import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const CARDS = [
  { image: '/images/proof5dex.jpeg', caption: 'DexScreener — $127K MC', color: 0x00d4ff },
  { image: '/images/proof4engage.jpeg', caption: 'Engagement Boosted in 2 Weeks', color: 0xb967ff },
  { image: '/images/proof2inv.jpeg', caption: '$4.6K Raised — Best KOL', color: 0x00ffb3 },
  { image: '/images/proof1.jpeg', caption: '91 Confirmed Referrals', color: 0xff6ec7 },
  { image: '/images/proof3gamex.jpeg', caption: 'GameXLabs Public Recommendation', color: 0xffe066 },
]

export default function ProofGallery3D() {
  const containerRef = useRef<HTMLDivElement>(null)
  const captionRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef(0)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const w = container.offsetWidth
    const h = container.offsetHeight

    // Scene
    const scene = new THREE.Scene()

    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100)
    camera.position.set(0, 0, 7)

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    })

    renderer.setSize(w, h)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.1

    container.appendChild(renderer.domElement)

    // ── Particle field ──
    const particleCount = 1200

    const particlePositions = new Float32Array(particleCount * 3)
    const particleColors = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 3.5 + Math.random() * 4

      particlePositions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      particlePositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      particlePositions[i * 3 + 2] = r * Math.cos(phi)

      const c = new THREE.Color(CARDS[i % 5].color)

      particleColors[i * 3] = c.r
      particleColors[i * 3 + 1] = c.g
      particleColors[i * 3 + 2] = c.b
    }

    const particleGeo = new THREE.BufferGeometry()

    particleGeo.setAttribute(
      'position',
      new THREE.BufferAttribute(particlePositions, 3)
    )

    particleGeo.setAttribute(
      'color',
      new THREE.BufferAttribute(particleColors, 3)
    )

    const particleMat = new THREE.PointsMaterial({
      size: 0.04,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })

    const particles = new THREE.Points(particleGeo, particleMat)

    scene.add(particles)

    // ── Orb group ──
    const orbGroup = new THREE.Group()
    scene.add(orbGroup)

    const faceGroup = new THREE.Group()
    orbGroup.add(faceGroup)

    const textureLoader = new THREE.TextureLoader()

    const RADIUS = 2.2
    const FACE_W = 2.6
    const FACE_H = 3.4
    const ANGLE_STEP = (Math.PI * 2) / 5

    CARDS.forEach((card, i) => {
      const angle = i * ANGLE_STEP - Math.PI / 2
      const faceColor = new THREE.Color(card.color)

      // Border
      const borderGeo = new THREE.PlaneGeometry(
        FACE_W + 0.12,
        FACE_H + 0.12
      )

      const borderMat = new THREE.MeshBasicMaterial({
        color: faceColor,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })

      const borderMesh = new THREE.Mesh(borderGeo, borderMat)

      borderMesh.position.set(
        Math.cos(angle) * RADIUS,
        0,
        Math.sin(angle) * RADIUS
      )

      borderMesh.rotation.y = -angle + Math.PI / 2
      borderMesh.position.z += 0.001

      faceGroup.add(borderMesh)

      // Image plane
      const geo = new THREE.PlaneGeometry(FACE_W, FACE_H)

      const mat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        roughness: 0.3,
        metalness: 0.1,
        transparent: true,
        opacity: 0,
      })

      const mesh = new THREE.Mesh(geo, mat)

      mesh.position.set(
        Math.cos(angle) * RADIUS,
        0,
        Math.sin(angle) * RADIUS
      )

      mesh.rotation.y = -angle + Math.PI / 2

      faceGroup.add(mesh)

      // Texture load
      textureLoader.load(card.image, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace
        tex.minFilter = THREE.LinearFilter

        mat.map = tex
        mat.needsUpdate = true

        const start = performance.now()

        const fadeIn = () => {
          const t = Math.min((performance.now() - start) / 800, 1)

          mat.opacity = t * 0.95

          if (t < 1) {
            requestAnimationFrame(fadeIn)
          }
        }

        setTimeout(() => fadeIn(), i * 150 + 400)
      })

      // Caps
      const capGeo = new THREE.PlaneGeometry(FACE_W, 0.08)

      const capMat = new THREE.MeshBasicMaterial({
        color: faceColor,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending,
      })

      const topCap = new THREE.Mesh(capGeo, capMat)

      topCap.position.set(
        Math.cos(angle) * RADIUS,
        FACE_H / 2 + 0.04,
        Math.sin(angle) * RADIUS
      )

      topCap.rotation.y = -angle + Math.PI / 2

      faceGroup.add(topCap)

      const botCap = new THREE.Mesh(capGeo, capMat.clone())

      botCap.position.set(
        Math.cos(angle) * RADIUS,
        -(FACE_H / 2 + 0.04),
        Math.sin(angle) * RADIUS
      )

      botCap.rotation.y = -angle + Math.PI / 2

      faceGroup.add(botCap)
    })

    // ── Inner glow ──
    const glowGeo = new THREE.SphereGeometry(1.4, 32, 32)

    const glowMat = new THREE.MeshBasicMaterial({
      color: 0x00d4ff,
      transparent: true,
      opacity: 0.04,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.BackSide,
    })

    const glowOrb = new THREE.Mesh(glowGeo, glowMat)

    orbGroup.add(glowOrb)

    // ── Lighting ──
    scene.add(new THREE.AmbientLight(0xffffff, 0.5))

    const lights = CARDS.map((card, i) => {
      const angle = i * ANGLE_STEP

      const light = new THREE.PointLight(card.color, 2.5, 10)

      light.position.set(
        Math.cos(angle) * 5,
        Math.sin(i) * 2,
        Math.sin(angle) * 5
      )

      scene.add(light)

      return light
    })

    const rimLight = new THREE.DirectionalLight(0xffffff, 0.8)

    rimLight.position.set(0, 5, 3)

    scene.add(rimLight)

    // ── Drag interaction ──
    let isDragging = false
    let lastX = 0
    let autoRotateSpeed = 0.004
    let dragVelocity = 0

    // ── Caption tracking ──
    let captionTimer: ReturnType<typeof setTimeout>

    const updateCaption = () => {
      const normalized =
        ((faceGroup.rotation.y % (Math.PI * 2)) + Math.PI * 2) %
        (Math.PI * 2)

      const faceIndex = Math.round(normalized / ANGLE_STEP) % 5

      const caption = captionRef.current

      if (caption) {
        caption.style.opacity = '0'

        clearTimeout(captionTimer)

        captionTimer = setTimeout(() => {
          caption.textContent = CARDS[faceIndex].caption

          const color =
            '#' +
            new THREE.Color(CARDS[faceIndex].color).getHexString()

          caption.style.color = color
          caption.style.opacity = '1'
        }, 200)
      }
    }

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true
      lastX = e.clientX
      dragVelocity = 0
      autoRotateSpeed = 0
    }

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return

      const dx = e.clientX - lastX

      dragVelocity = dx * 0.01

      faceGroup.rotation.y += dragVelocity

      updateCaption()

      lastX = e.clientX
    }

    const onPointerUp = () => {
      isDragging = false

      setTimeout(() => {
        autoRotateSpeed = 0.004
      }, 1200)
    }

    container.addEventListener('pointerdown', onPointerDown)

    window.addEventListener('pointermove', onPointerMove)

    window.addEventListener('pointerup', onPointerUp)

    // ── Resize ──
    const onResize = () => {
      const nw = container.offsetWidth
      const nh = container.offsetHeight

      camera.aspect = nw / nh
      camera.updateProjectionMatrix()

      renderer.setSize(nw, nh)
    }

    window.addEventListener('resize', onResize)

    // ── Animate ──
    let disposed = false

    const clock = new THREE.Clock()

    const animate = () => {
      if (disposed) return

      frameRef.current = requestAnimationFrame(animate)

      const t = clock.getElapsedTime()

      // Rotation
      if (!isDragging) {
        if (Math.abs(dragVelocity) > 0.0001) {
          faceGroup.rotation.y += dragVelocity
          dragVelocity *= 0.94
        } else {
          faceGroup.rotation.y += autoRotateSpeed
        }

        if (Math.floor(t * 10) % 3 === 0) {
          updateCaption()
        }
      }

      // Floating
      orbGroup.position.y = Math.sin(t * 0.6) * 0.12
      orbGroup.rotation.x = Math.sin(t * 0.3) * 0.06

      // Glow shift
      const hue = (t * 0.05) % 1
      glowMat.color.setHSL(hue, 1, 0.5)

      // Particle movement
      particles.rotation.y = t * 0.03
      particles.rotation.x = Math.sin(t * 0.02) * 0.1

      // Orbit lights
      lights.forEach((light, i) => {
        const la = i * ANGLE_STEP + t * 0.3

        light.position.x = Math.cos(la) * 5
        light.position.z = Math.sin(la) * 5
        light.intensity = 2 + Math.sin(t * 2 + i) * 0.8
      })

      renderer.render(scene, camera)
    }

    animate()

    // Initial caption
    updateCaption()

    // Cleanup
    return () => {
      disposed = true

      cancelAnimationFrame(frameRef.current)

      clearTimeout(captionTimer)

      container.removeEventListener('pointerdown', onPointerDown)

      window.removeEventListener('pointermove', onPointerMove)

      window.removeEventListener('pointerup', onPointerUp)

      window.removeEventListener('resize', onResize)

      renderer.dispose()

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div
      className="relative"
      style={{
        height: '85vh',
        minHeight: 560,
        background: 'transparent',
      }}
    >
      <div
        ref={containerRef}
        style={{
          position: 'absolute',
          inset: 0,
        }}
      />

      {/* Drag hint */}
      <div
        className="absolute top-6 left-1/2 -translate-x-1/2"
        style={{
          zIndex: 2,
          pointerEvents: 'none',
        }}
      >
        <span
          style={{
            fontSize: '0.6rem',
            letterSpacing: '0.2em',
            color: 'rgba(255,255,255,0.3)',
            textTransform: 'uppercase',
            fontFamily: 'monospace',
          }}
        >
          ← drag to rotate →
        </span>
      </div>

      {/* Caption */}
      <div
        ref={captionRef}
        style={{
          position: 'absolute',
          bottom: 40,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 2,
          fontSize: '0.75rem',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          fontFamily: 'monospace',
          color: '#00d4ff',
          opacity: 0,
          transition: 'opacity 0.4s ease, color 0.4s ease',
          textAlign: 'center',
          whiteSpace: 'nowrap',
          textShadow: '0 0 20px currentColor',
          pointerEvents: 'none',
        }}
      />

      {/* Edge vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at center, transparent 50%, rgba(5,5,5,0.7) 100%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />
    </div>
  )
}