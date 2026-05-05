import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const PARTICLE_COUNT = 15000
const VERTEX_SHADER = `
  attribute float size;
  attribute float life;
  varying float vLife;
  varying vec3 vColor;
  uniform float time;

  // Simplex-like noise
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  // Curl noise
  vec3 curlNoise(vec3 p) {
    float e = 0.1;
    vec3 dx = vec3(e, 0.0, 0.0);
    vec3 dy = vec3(0.0, e, 0.0);
    vec3 dz = vec3(0.0, 0.0, e);

    float x = snoise(p + dy) - snoise(p - dy);
    float y = snoise(p + dz) - snoise(p - dz);
    float z = snoise(p + dx) - snoise(p - dx);

    return normalize(vec3(x, y, z) / (2.0 * e));
  }

  void main() {
    vLife = life;

    vec3 pos = position;

    // Curl noise displacement
    vec3 curl = curlNoise(pos * 0.5 + time * 0.1);
    pos += curl * 0.15;

    // Breathing morphing
    float t = time * 0.5;
    float id = float(gl_VertexID);
    float rad = 1.5 + sin(t + id * 0.001) * 0.5;
    vec3 normalized = normalize(position);
    vec3 def = normalized * rad;
    def += normalized * sin(def.x * 10.0 + t) * cos(def.y * 10.0 + t) * 0.05;

    float l = smoothstep(0.0, 0.1, abs(sin(t + id * 0.0001)));
    pos = mix(pos, def, l);

    // Color based on velocity/life
    vColor = mix(vec3(0.0, 0.5, 0.8), vec3(0.8, 0.9, 1.0), l);

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = size * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`

const FRAGMENT_SHADER = `
  varying float vLife;
  varying vec3 vColor;

  void main() {
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;

    float alpha = (1.0 - dist * 2.0) * vLife * 0.8;
    gl_FragColor = vec4(vColor, alpha);
  }
`

export default function ParticleCloud() {
  const containerRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef(0)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const isMobile = window.innerWidth < 768
    const count = isMobile ? 5000 : PARTICLE_COUNT

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, container.offsetWidth / container.offsetHeight, 0.1, 100)
    camera.position.z = 4

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true })
    renderer.setSize(container.offsetWidth, container.offsetHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.0
    container.appendChild(renderer.domElement)

    // Particle positions - spherical distribution
    const positions = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    const lives = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      const radius = Math.random() * 2
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = radius * Math.cos(phi)

      sizes[i] = 0.15 + Math.random() * 0.1
      lives[i] = Math.random()
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
    geometry.setAttribute('life', new THREE.BufferAttribute(lives, 1))

    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      uniforms: {
        time: { value: 0 },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })

    const points = new THREE.Points(geometry, material)
    scene.add(points)

    // Mouse interaction
    const mouse = { x: 0, y: 0 }
    const onMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 0.2
      mouse.y = -(e.clientY / window.innerHeight - 0.5) * 0.2
    }
    window.addEventListener('mousemove', onMouseMove)

    // Animation loop
    let disposed = false
    const clock = new THREE.Clock()

    const animate = () => {
      if (disposed) return
      frameRef.current = requestAnimationFrame(animate)

      const elapsed = clock.getElapsedTime()
      material.uniforms.time.value = elapsed

      // Auto-rotation
      points.rotation.y += 0.001
      points.rotation.x = Math.sin(elapsed * 0.1) * 0.05

      // Mouse parallax
      camera.position.x += (mouse.x - camera.position.x) * 0.05
      camera.position.y += (mouse.y - camera.position.y) * 0.05
      camera.lookAt(0, 0, 0)

      renderer.render(scene, camera)
    }

    // IntersectionObserver - only animate when visible
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          animate()
        } else {
          disposed = true
          cancelAnimationFrame(frameRef.current)
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(container)

    // Initial start
    animate()

    // Resize
    const onResize = () => {
      const w = container.offsetWidth
      const h = container.offsetHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    return () => {
      disposed = true
      cancelAnimationFrame(frameRef.current)
      observer.disconnect()
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      geometry.dispose()
      material.dispose()
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
        mixBlendMode: 'screen',
      }}
    />
  )
}
