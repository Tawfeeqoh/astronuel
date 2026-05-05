import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'

const WORDS = ['ATTENTION', 'ENGAGEMENT', 'TRUST', 'ACTION', 'RESULTS']

function createAnimatedTexture(
  canvas: HTMLCanvasElement,
  type: 'particles' | 'grid' | 'ribbons' | 'glitch' | 'burst'
) {
  const ctx = canvas.getContext('2d')!
  const w = canvas.width
  const h = canvas.height
  let time = 0

  const drawParticles = () => {
    ctx.fillStyle = '#020202'
    ctx.fillRect(0, 0, w, h)
    for (let i = 0; i < 80; i++) {
      const x = (Math.sin(i * 0.7 + time * 0.02) * 0.5 + 0.5) * w
      const y = (Math.cos(i * 1.3 + time * 0.015) * 0.5 + 0.5) * h
      const r = 2 + Math.sin(i + time * 0.05) * 1.5
      const hue = i % 2 === 0 ? 195 : 270
      const alpha = 0.4 + Math.sin(time * 0.03 + i) * 0.3
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fillStyle = `hsla(${hue}, 100%, 60%, ${alpha})`
      ctx.fill()
      const tx = x - Math.cos(i * 0.7 + time * 0.02) * 20
      const ty = y + Math.sin(i * 1.3 + time * 0.015) * 20
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(tx, ty)
      ctx.strokeStyle = `hsla(${hue}, 100%, 60%, ${alpha * 0.3})`
      ctx.lineWidth = 1
      ctx.stroke()
    }
  }

  const drawGrid = () => {
    ctx.fillStyle = '#020202'
    ctx.fillRect(0, 0, w, h)
    const gridSize = 40
    for (let x = 0; x < w; x += gridSize) {
      for (let y = 0; y < h; y += gridSize) {
        const pulse = Math.sin(x * 0.05 + y * 0.03 + time * 0.04) * 0.5 + 0.5
        const alpha = pulse * 0.6
        ctx.fillStyle = `rgba(0, 212, 255, ${alpha * 0.3})`
        ctx.fillRect(x, y, 1, 1)
        if (pulse > 0.8) {
          ctx.fillStyle = `rgba(0, 212, 255, ${(pulse - 0.8) * 2})`
          ctx.fillRect(x - 1, y - 1, 3, 3)
        }
      }
    }
    const flashX = (time * 3) % w
    ctx.strokeStyle = 'rgba(0, 212, 255, 0.4)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(flashX, 0)
    ctx.lineTo(flashX, h)
    ctx.stroke()
  }

  const drawRibbons = () => {
    ctx.fillStyle = '#020202'
    ctx.fillRect(0, 0, w, h)
    for (let i = 0; i < 5; i++) {
      ctx.beginPath()
      for (let x = 0; x < w; x += 5) {
        const y = h / 2 + Math.sin(x * 0.01 + time * 0.02 + i * 1.2) * 80 * (i + 1) * 0.4
          + Math.cos(x * 0.005 + time * 0.01) * 40
        if (x === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      const alpha = 0.15 + i * 0.05
      ctx.strokeStyle = `rgba(0, 212, 255, ${alpha})`
      ctx.lineWidth = 3 - i * 0.4
      ctx.stroke()
    }
  }

  const drawGlitch = () => {
    ctx.fillStyle = '#020202'
    ctx.fillRect(0, 0, w, h)
    for (let y = 0; y < h; y += 4) {
      ctx.fillStyle = `rgba(0, 212, 255, ${0.02 + Math.sin(y + time) * 0.01})`
      ctx.fillRect(0, y, w, 1)
    }
    for (let i = 0; i < 8; i++) {
      const gy = Math.random() * h
      const gh = 2 + Math.random() * 20
      const alpha = Math.random() * 0.3
      ctx.fillStyle = `rgba(0, 212, 255, ${alpha})`
      ctx.fillRect(0, gy, w, gh)
    }
    const shapePulse = Math.sin(time * 0.08) * 0.5 + 0.5
    ctx.strokeStyle = `rgba(185, 103, 255, ${0.3 * shapePulse})`
    ctx.lineWidth = 1
    ctx.strokeRect(w * 0.2, h * 0.2, w * 0.6, h * 0.6)
  }

  const drawBurst = () => {
    ctx.fillStyle = '#020202'
    ctx.fillRect(0, 0, w, h)
    const cx = w / 2
    const cy = h / 2
    for (let i = 0; i < 100; i++) {
      const angle = (i / 100) * Math.PI * 2 + time * 0.01
      const dist = 50 + Math.sin(time * 0.03 + i * 0.2) * 100
      const x = cx + Math.cos(angle) * dist
      const y = cy + Math.sin(angle) * dist
      const r = Math.max(0.1, 1 + Math.sin(time * 0.05 + i) * 2)
      const hue = i < 50 ? 195 : 270
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fillStyle = `hsla(${hue}, 100%, 60%, 0.5)`
      ctx.fill()
    }
    const glowR = 30 + Math.sin(time * 0.06) * 15
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowR)
    grad.addColorStop(0, 'rgba(0, 212, 255, 0.3)')
    grad.addColorStop(1, 'rgba(0, 212, 255, 0)')
    ctx.fillStyle = grad
    ctx.fillRect(cx - glowR, cy - glowR, glowR * 2, glowR * 2)
  }

  const drawers: Record<string, () => void> = {
    particles: drawParticles,
    grid: drawGrid,
    ribbons: drawRibbons,
    glitch: drawGlitch,
    burst: drawBurst,
  }

  return {
    update: () => {
      time++
      drawers[type]()
    },
  }
}

// Fallback particle background that renders immediately
function createFallbackBackground(scene: THREE.Scene) {
  const count = 2000
  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20
    positions[i * 3 + 1] = (Math.random() - 0.5) * 15
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  const mat = new THREE.PointsMaterial({
    color: 0x00d4ff,
    size: 0.05,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  })
  const points = new THREE.Points(geo, mat)
  scene.add(points)
  return points
}

export default function Hero3D() {
  const containerRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef(0)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const isMobile = window.innerWidth < 768

    // Scene setup
    const scene = new THREE.Scene()
    const bgColor = new THREE.Color('#080810')
    scene.background = bgColor
    scene.fog = new THREE.Fog('#080810', 10, 30)

    const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 100)
    camera.position.set(0, 0, 13)

    const renderer = new THREE.WebGLRenderer({ antialias: !isMobile, alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 0.7
    container.appendChild(renderer.domElement)

    // Fallback background particles (always visible)
    const fallbackParticles = createFallbackBackground(scene)

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
    scene.add(ambientLight)

    const spot1 = new THREE.SpotLight(0xffffff, 1, 20, 0.8, 0.5)
    spot1.position.set(-5, 8, 5)
    spot1.castShadow = true
    scene.add(spot1)

    const spot2 = new THREE.SpotLight(0x00d4ff, 0.5, 20, 0.6, 0.5)
    spot2.position.set(5, 3, 5)
    scene.add(spot2)

    // Word groups storage
    interface WordGroup {
      group: THREE.Group
      letters: THREE.Mesh[]
      texture: THREE.CanvasTexture
      animator: { update: () => void }
    }
    const wordGroups: WordGroup[] = []
    let currentWordIndex = 0
    let wordTimer = 0
    const WORD_DURATION = 180
    const PHASE_ZOOM_IN = WORD_DURATION * 0.6
    const PHASE_HOLD = WORD_DURATION * 0.8
    let fontLoaded = false

    const textureTypes: Array<'particles' | 'grid' | 'ribbons' | 'glitch' | 'burst'> = [
      'particles', 'grid', 'ribbons', 'glitch', 'burst'
    ]

    // Load font and create text
    const loader = new FontLoader()
    loader.load(
      'https://threejs.org/examples/fonts/helvetiker_bold.typeface.json',
      (font) => {
        fontLoaded = true
        // Reduce fallback particles when text loads
        fallbackParticles.material.opacity = 0.2

        WORDS.forEach((word, wordIdx) => {
          const group = new THREE.Group()
          group.rotation.y = -0.3
          group.visible = false

          const canvas = document.createElement('canvas')
          canvas.width = 512
          canvas.height = 512
          const animator = createAnimatedTexture(canvas, textureTypes[wordIdx])
          animator.update()
          const texture = new THREE.CanvasTexture(canvas)
          texture.minFilter = THREE.LinearFilter
          texture.magFilter = THREE.LinearFilter

          const textSize = isMobile ? 0.5 : 0.8
          const tempGeo = new TextGeometry(word, {
            font,
            size: textSize,
            depth: isMobile ? 0.2 : 0.4,
            bevelEnabled: true,
            bevelSize: 0.02,
            bevelThickness: 0.02,
            curveSegments: isMobile ? 3 : 6,
          })
          tempGeo.computeBoundingBox()
          const totalWidth = tempGeo.boundingBox!.max.x - tempGeo.boundingBox!.min.x

          group.position.x = -totalWidth / 2

          const letters: THREE.Mesh[] = []
          let xOffset = 0

          for (let i = 0; i < word.length; i++) {
            const letterGeo = new TextGeometry(word[i], {
              font,
              size: textSize,
              depth: isMobile ? 0.2 : 0.4,
              bevelEnabled: true,
              bevelSize: 0.02,
              bevelThickness: 0.02,
              curveSegments: isMobile ? 3 : 6,
            })

            const mat = new THREE.MeshPhongMaterial({
              color: 0x00d4ff,
              emissive: new THREE.Color(0x00aaff),  // self-glow, doesn't need light
              emissiveIntensity: 0.8,
              shininess: 120,
              specular: new THREE.Color(0x00ffff),
              map: texture,
              transparent: true,
              opacity: 0,
            })

            const mesh = new THREE.Mesh(letterGeo, mat)
            mesh.position.x = xOffset
            mesh.userData = {
              finalX: xOffset,
              finalY: 0,
              finalZ: 0,
              index: i,
              scatterX: (Math.random() - 0.5) * 10,
              scatterY: (Math.random() - 0.5) * 10,
              scatterZ: (Math.random() - 0.5) * 10,
              rotX: (Math.random() - 0.5) * Math.PI * 2,
              rotY: (Math.random() - 0.5) * Math.PI * 2,
              rotZ: (Math.random() - 0.5) * Math.PI * 2,
            }

            mesh.position.set(mesh.userData.scatterX, mesh.userData.scatterY, mesh.userData.scatterZ)
            mesh.rotation.set(mesh.userData.rotX, mesh.userData.rotY, mesh.userData.rotZ)

            group.add(mesh)
            letters.push(mesh)

            letterGeo.computeBoundingBox()
            xOffset += (letterGeo.boundingBox!.max.x - letterGeo.boundingBox!.min.x) + textSize * 0.05
          }

          scene.add(group)
          wordGroups.push({ group, letters, texture, animator })
        })

        if (wordGroups.length > 0) {
          wordGroups[0].group.visible = true
          wordGroups[0].group.scale.setScalar(0.1)
        }
      },
      undefined,
      (err) => {
        console.warn('Font load failed, showing fallback particles only:', err)
      }
    )

    // Animation loop
    let disposed = false
    let time = 0

    const animate = () => {
      if (disposed) return
      frameRef.current = requestAnimationFrame(animate)
      time++

      // Animate fallback particles
      fallbackParticles.rotation.y += 0.0003
      fallbackParticles.rotation.x = Math.sin(time * 0.001) * 0.02

      // Update text animation
      if (fontLoaded && wordGroups.length > 0 && wordGroups[currentWordIndex]) {
        const wg = wordGroups[currentWordIndex]
        wordTimer++

        wg.animator.update()
        wg.texture.needsUpdate = true

        const t = wordTimer

        if (t < PHASE_ZOOM_IN) {
          const progress = t / PHASE_ZOOM_IN
          const eased = 1 - Math.pow(1 - progress, 3)

          wg.group.scale.setScalar(0.1 + eased * 1.4)

          wg.letters.forEach((mesh, i) => {
            const delay = i * 3
            const letterProgress = Math.max(0, Math.min(1, (t - delay) / (PHASE_ZOOM_IN * 0.7)))
            const letterEased = 1 - Math.pow(1 - letterProgress, 2)

            mesh.position.x = mesh.userData.scatterX + (mesh.userData.finalX - mesh.userData.scatterX) * letterEased
            mesh.position.y = mesh.userData.scatterY + (mesh.userData.finalY - mesh.userData.scatterY) * letterEased
            mesh.position.z = mesh.userData.scatterZ + (mesh.userData.finalZ - mesh.userData.scatterZ) * letterEased

            mesh.rotation.x = mesh.userData.rotX * (1 - letterEased)
            mesh.rotation.y = mesh.userData.rotY * (1 - letterEased)
            mesh.rotation.z = mesh.userData.rotZ * (1 - letterEased)

            const mat = mesh.material as THREE.MeshPhongMaterial
            mat.opacity = letterEased * 0.9
          })
        } else if (t < PHASE_HOLD) {
          wg.group.scale.setScalar(1.5)
          wg.group.rotation.y = -0.3 + Math.sin(t * 0.002) * 0.05

          wg.letters.forEach((mesh) => {
            const mat = mesh.material as THREE.MeshPhongMaterial
            mat.opacity = 0.9
          })
        } else if (t < WORD_DURATION) {
          const progress = (t - PHASE_HOLD) / (WORD_DURATION - PHASE_HOLD)
          const eased = progress * progress

          wg.group.scale.setScalar(1.5 + eased * 1.5)

          wg.letters.forEach((mesh) => {
            const mat = mesh.material as THREE.MeshPhongMaterial
            mat.opacity = 0.9 * (1 - eased)
          })
        } else {
          wg.group.visible = false
          wg.group.scale.setScalar(0.1)
          wg.group.rotation.y = -0.3

          wg.letters.forEach((mesh) => {
            mesh.position.set(mesh.userData.scatterX, mesh.userData.scatterY, mesh.userData.scatterZ)
            mesh.rotation.set(mesh.userData.rotX, mesh.userData.rotY, mesh.userData.rotZ)
            const mat = mesh.material as THREE.MeshPhongMaterial
            mat.opacity = 0
          })

          currentWordIndex = (currentWordIndex + 1) % wordGroups.length
          wordTimer = 0

          const nextWg = wordGroups[currentWordIndex]
          nextWg.group.visible = true
          nextWg.group.scale.setScalar(0.1)
        }
      }

      renderer.render(scene, camera)
    }

    animate()

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', onResize)

    return () => {
      disposed = true
      cancelAnimationFrame(frameRef.current)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
      }}
    />
  )
}
