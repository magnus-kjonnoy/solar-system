import React, { useState, useEffect, useRef, useMemo } from 'react'

import { Bodies } from '../Components/Bodies'
import SimDropdown from '../Components/SimDropdown'

import bg_Space from '/image/space.jpg'

// ∞, ×, ·, °, π, Ω, ω, ρ, ☉, 

function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi ?? Infinity, v)) }

export default function Simulation() {
  const [showLabels, setShowLabels] = useState(true)
  const [showLabelsStars, setShowLabelsStars] = useState(true)
  const [showLabelsPlanets, setShowLabelsPlanets] = useState(true)
  const [showLabelsDwarfplanets, setShowLabelsDwarfplanets] = useState(true)
  const [showLabelsMoons, setShowLabelsMoons] = useState(false)
  const [showLabelsAsteroids, setShowLabelsAsteroids] = useState(false)
  const [showOrbits, setShowOrbits] = useState(true)
  const [showOrbitsStars, setShowOrbitsStars] = useState(false)
  const [showOrbitsPlanets, setShowOrbitsPlanets] = useState(true)
  const [showOrbitsDwarfplanets, setShowOrbitsDwarfplanets] = useState(true)
  const [showOrbitsMoons, setShowOrbitsMoons] = useState(true)
  const [showOrbitsAsteroids, setShowOrbitsAsteroids] = useState(true)
  const [showStars, setShowStars] = useState(true)
  const [showPlanets, setShowPlanets] = useState(true)
  const [showDwarfs, setShowDwarfs] = useState(false)
  const [showMoons, setShowMoons] = useState(true)
  const [showRegular, setShowRegular] = useState(true)
  const [showIrregular, setShowIrregular] = useState(false)
  const [showSatellitesOnlyOfLocked, setShowSatellitesOnlyOfLocked] = useState(true)
  const [showAsteroids, setShowAsteroids] = useState(false)
  const [showAsteroidBelt, setShowAsteroidBelt] = useState(false)
  const [showKuiperBelt, setShowKuiperBelt] = useState(false)
  const [showRings, setShowRings] = useState(true)
  const [orbitColorMode, setOrbitColorMode] = useState('default')
  const [pause, setPause] = useState(false)
  const [timeUnit, setTimeUnit] = useState('days')
  const [timeScale, setTimeScale] = useState(1) // Days per real-time second
  const [radiusScale, setRadiusScale] = useState(1)
  const [moveScale, setMoveScale] = useState(1)
  const [zoomScale, setZoomScale] = useState(1)
  const [fov, setFov] = useState(60)
  const [lockTarget, setLockTarget] = useState(' ')

  const [panelActive, setPanelActive] = useState(true)
  const [panelWidth, setPanelWidth] = useState(250)
  const resDrag = useRef({ active: false, startX: 0, startW: 250 })

  const canvasRef = useRef(null)
  const labelsRef = useRef(null)

  const camInitYaw = 0 // radians (around Y)
  const camInitPitch = 0 // radians (up/down)
  const camInitRoll = 0
  const camInitDist = 100 // world units from target
  const camInitX = 0
  const camInitY = 0
  const camInitZ = 0

  const cam = useRef({
    yaw: camInitYaw,
    pitch: camInitPitch,
    roll: camInitRoll,
    dist: camInitDist,
    target: { x: camInitX, y: camInitY, z: camInitZ },
  })
  const camTarget = useRef({ ...cam.current })
  const lockRef = useRef(lockTarget)
  useEffect(() => { lockRef.current = lockTarget }, [lockTarget])

  const drag = useRef({
    active: false,
    x: 0,
    y: 0,
    yaw0: 0,
    pitch0: 0,
    move: false,
  })
  const keys = useRef(new Set())
  useEffect(() => {
    const kd = (e) => {
      const tag = e.target && e.target.tagName
      if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return
      keys.current.add(e.code)
    }
    const ku = (e) => { keys.current.delete(e.code) }
    window.addEventListener('keydown', kd)
    window.addEventListener('keyup', ku)
    return () => {
      window.removeEventListener('keydown', kd)
      window.removeEventListener('keyup', ku)
    }
  }, [])

  // Constants
  const AU_units = 64 // World units per AU
  const AU_km = 149_597_870.7
  const kmToAU = (km) => km / AU_km
  const auToUnits = (au) => au * AU_units
  const kmToUnits = (km) => auToUnits(kmToAU(km))
  const radiusUnitsOf = (b, rScale) => {
    const scale = b.type === 'star' ? 1 : rScale
    return kmToUnits(b.radius) * scale
  }
  const NEAR = 0.1
  const FAR = Infinity
  const DEG = Math.PI / 180

  const bodies = useMemo(() => {
    const B = Bodies
    return B.map((o) => ({
      ...o,
      theta0: Math.random() * Math.PI * 2, 
    }))
  }, [Bodies])

  const elements = useMemo(() => bodies.map((b) => {
    const hasSign = typeof b.period === 'number' && b.period < 0
    const derivedDir = hasSign ? 'retrograde' : undefined

    return {
      name: b.name,
      type: b.type,
      category: b.category ?? undefined,
      sub_category: b.sub_category ?? undefined,
      group: b.group ?? undefined,
      sub_group: b.sub_group ?? undefined,
      orbit_target: b.orbit_target ?? 'Sun',
      orbit_type: b.orbit_type ?? 'regular',
      orbit_direction: b.orbit_direction ?? derivedDir,
      distance: b.distance ?? 0,
      period_days: Math.abs(b.period ?? 1),
      orbit_speed: b.orbit_speed ?? 0,
      tilt_inclination: b.inclination ?? 0,
      e: b.eccentricity ?? 0,
      Omega_deg: b.Omega_deg ?? 0,
      omega_deg: b.omega_deg ?? 0,
      axial_tilt: b.axial_tilt ?? 0,
      rotation_period: b.rotation_period ?? 'synchronous',
      rotation_speed: b.rotation_speed ?? 0,
      flattening: b.flattening ?? 0,
      radius: b.radius ?? 0,
      mass: b.mass ?? 0,
      density: b.density ?? 0,
      volume: b.volume ?? 0,
      color: b.color ?? '#dddddd',
      M0_deg: (b.theta0 ?? 0) * 180 / Math.PI,
    }
  }), [bodies])

  function orbitDir(el) {
    if (el.orbit_direction === 'retrograde') return -1
    if (el.orbit_direction ===   'prograde') return +1
    const inc = el.tilt_inclination ?? 0
    return inc > 90 ? -1 : +1
  }

  const GROUP_COLORS = {
    // general
    'Inner':     '#ffffff80',
    'Major':     '#a0a0ff', // '#a0a0ff' // '#ccccff'
    'Ungrouped': '#aaaaaa',
    // JUPITER
    'Galilean':  '#ccccff',
    'Themisto':  '#ffe0fc',
    'Himalia':   '#fdd5b1',
    'Carpo':     '#d5fbff',
    'Valetudo':  '#d0f0d0',
    'Ananke':    '#f0f0b0',
    'Pasiphae':  '#d3d3d3',
    'Carme':     '#f4c2c2',
    // SATURN
    'Inuit':     '#f4c2c2',
    'Gallic':    '#fdd5b1',
    'Norse':     '#9fdaff', // '#80ceff' // '#d3d3d3'
    // URANUS
    'Caliban':   '#f0f0b0',
    // NEPTUNE
    'Sao':       '#f0f0b0',
    'Neso':      '#f4c2c2',
  }
  // Prograde   '#2294ff'
  // Retrograde '#ff2222'
  // Regular    '#b6b391'
  // Irregular  '#af7847'
  // other      '#6ec8ff' '#ff6ec8'

  function getOrbitColor(b, el) {
    if (orbitColorMode === 'default') {
      if (b.type === 'star') return '#fff'
      if (b.type === 'planet') return '#ddd'
      if (b.type === 'dwarf-planet') return '#bbb'
      if (b.type === 'moon') return '#999'
      if (b.type === 'asteroid') return '#dddddd99'
      return '#aaa'
    }
    if (b.type !== 'moon') {
      return (
        b.type === 'star' ? '#fff' :
        b.type === 'planet' ? '#ddd' :
        b.type === 'dwarf-planet' ? '#bbb' :
        '#aaa'
      )
    }
    if (orbitColorMode === 'class') {
      const cls = el?.orbit_type ?? b.orbit_type ?? 'regular'
      if (cls === 'regular') return '#b6b391'
      if (cls === 'irregular') return '#af7847'
    }
    if (orbitColorMode === 'group') {
      const g = el?.group ?? b.group
      return GROUP_COLORS[g] ?? '#aaa'
    }
    if (orbitColorMode === 'proretro') {
      const dir = orbitDir(el)
      return dir < 0 ? '#ff2222' : '#2294ff'
    }
    return '#aaa'
  }

  // Kepler: M = E - e * sin(E)
  function solveE(M, e, iters = 8) {
    M = ((M + Math.PI) % (2 * Math.PI)) - Math.PI
    let E = e < 0.8 ? M : Math.PI
    for (let i = 0; i < iters; i++) {
      const f = E - e * Math.sin(E) - M
      const fp = 1 - e * Math.cos(E)
      E = E - f / fp
    }
    return E
  }
  function keplerToPosition(days, el) {
    const {
      distance,
      e = 0,
      tilt_inclination = 0,
      Omega_deg = 0,
      omega_deg = 0,
      period_days,
      M0_deg = 0
    } = el
    if (!period_days || !distance) return { x: 0, y: 0, z: 0 }

    const dir = orbitDir(el)
    const n = (2 * Math.PI / Math.abs(period_days)) * dir
    const M = (M0_deg * DEG) + n * days
    const E = solveE(M, e)
    const cosE = Math.cos(E)
    const sinE = Math.sin(E)

    const xPrime = distance * (cosE - e)
    const yPrime = distance * Math.sqrt(1 - e * e) * sinE
    const zPrime = 0

    const cosΩ = Math.cos(Omega_deg * DEG)
    const sinΩ = Math.sin(Omega_deg * DEG)
    const cosω = Math.cos(omega_deg * DEG)
    const sinω = Math.sin(omega_deg * DEG)
    const cosi = Math.cos(tilt_inclination * DEG)
    const sini = Math.sin(tilt_inclination * DEG)

    let x1 = xPrime * cosω - yPrime * sinω
    let y1 = xPrime * sinω + yPrime * cosω
    let z1 = zPrime

    let x2 = x1
    let y2 = y1 * cosi - z1 * sini
    let z2 = y1 * sini + z1 * cosi

    const x = x2 * cosΩ - y2 * sinΩ
    const y = x2 * sinΩ + y2 * cosΩ
    const z = z2

    return { x, y, z }
  }
  function positionFromTrueAnomaly(el, nu_deg) {
    const {
      distance: a,
      e = 0,
      tilt_inclination = 0,
      Omega_deg = 0,
      omega_deg = 0,
    } = el

    const nu = nu_deg * DEG
    const r = a * (1 - e * e) / (1 + e * Math.cos(nu))
    const xP = r * Math.cos(nu)
    const yP = r * Math.sin(nu)
    const zP = 0

    const cosi = Math.cos(tilt_inclination * DEG)
    const cosΩ = Math.cos(Omega_deg * DEG)
    const cosω = Math.cos(omega_deg * DEG)

    const sini = Math.sin(tilt_inclination * DEG)
    const sinΩ = Math.sin(Omega_deg * DEG)
    const sinω = Math.sin(omega_deg * DEG)

    // ω
    const x1 = xP * cosω - yP * sinω
    const y1 = xP * sinω + yP * cosω
    const z1 = 0

    // i
    const x2 = x1
    const y2 = y1 * cosi - z1 * sini
    const z2 = y1 * sini + z1 * cosi

    // Ω
    const x = x2 * cosΩ - y2 * sinΩ
    const y = x2 * sinΩ + y2 * cosΩ
    const z = z2

    return { x, y, z }
  }

  const nameToIndex = useMemo(() => {
    const m = new Map()
    bodies.forEach((b, i) => m.set(b.name, i))
    return m
  }, [bodies])

  const idxByName = useMemo(() => {
    const m = new Map()
    bodies.forEach((b, i) => m.set(b.name, i))
    return m
  }, [bodies])

  const ORBIT_SEGMENTS = 384
  const relOrbitPts = useMemo(() => elements.map((el, i) => {
    if (bodies[i].name === 'Sun') return []
    const e = Math.min(Math.max(el.e ?? 0, 0), 0.99999)
    const SEG = Math.floor(ORBIT_SEGMENTS * (1 + 4 * e))
    const pts = []
    for (let k = 0; k <= SEG; k++) {
      const nu_deg = (k / SEG) * 360
      // const rel = keplerToPosition(0, { ...el, nu_deg })
      const p = positionFromTrueAnomaly(el, nu_deg)
      // pts.push({ x: rel.x, y: rel.y, z: rel.z })
      pts.push(p)
    }
    return pts
  }), [elements, bodies])

  const lockableTargets = useMemo(() => [' ', ...bodies.map((b) => b.name)], [bodies])

  const raf = useRef(null)
  const lastT = useRef(performance.now())
  const simDays = useRef(0)

  function wrapIdx(i, n) { return (i % n + n) % n }

  function parentIndexOf(i) {
    const pn = elements[i]?.orbit_target || 'Sun'
    return idxByName.get(pn) ?? null
  }
  function makePositionResolver(elements) {
    const memo = new Array(elements.length).fill(null)
    const visiting = new Array(elements.length).fill(false)

    function compute(i, days) {
      if (memo[i]) return memo[i]
      if (visiting[i]) {
        memo[i] = { x: 0, y: 0, z: 0 }
        return memo[i]
      }
      visiting[i] = true

      const b = bodies[i]
      if (b.type === 'star') {
        memo[i] = { x: 0, y: 0, z: 0 }
        visiting[i] = false
        return memo[i]
      }

      const el = elements[i]
      const pIdx = parentIndexOf(i)
      const pPos = (pIdx != null) ? compute(pIdx, days) : { x: 0, y: 0, z: 0 }
      const rel = keplerToPosition(days, el)
      memo[i] = { x: pPos.x + rel.x, y: pPos.y + rel.y, z: pPos.z + rel.z }
      visiting[i] = false
      return memo[i]
    }

    return (days) => {
      for (let i = 0; i < elements.length; i++) compute(i, days)
      return memo
    }
  }
  function parentNameOf(i) {
    const el = elements[i]
    return (el?.orbit_target) || 'Sun'
  }
  function typeOf(i) {
    return bodies[i]?.type
  }
  function isPrimaryVisibleByType(i) {
    const t = typeOf(i)
    if (t === 'star') return showStars
    if (t === 'planet') return showPlanets
    if (t === 'dwarf-planet') return showDwarfs
    if (t === 'asteroid') return showAsteroids
    return true
  }
  function lockedPrimaryName() {
    if (!lockRef.current || lockRef.current === ' ') return null
    const li = nameToIndex.get(lockRef.current)
    if (li == null) return null
    const lt = typeOf(li)
    if (lt === 'planet' || lt === 'dwarf-planet' || lt === 'asteroid') return bodies[li].name
    if (lt === 'moon') return parentNameOf(li)
    return null
  }
  function shouldShowMoon(i) {
    const b = bodies[i]
    if (b.type !== 'moon') return true
    if (!showMoons) return false

    const cls = b.orbit_type || 'regular'
    if (cls === 'regular' && !showRegular) return false
    if (cls === 'irregular' && !showIrregular) return false

    const pName = parentNameOf(i)

    if (showSatellitesOnlyOfLocked) {
      const L = lockedPrimaryName()
      if (!L) return false
      return pName === L
    }

    const pi = nameToIndex.get(pName)
    if (pi != null && !isPrimaryVisibleByType(pi)) return false

    return true
  }

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const labelsLayer = labelsRef.current

    const labelEls = new Map()
    bodies.forEach((b) => {
      const el = document.createElement('div')
      el.className = 'sim-label'
      el.textContent = b.name
      el.style.cursor = 'pointer'
      el.addEventListener('click', () => {
        setLockTarget(b.name)
      })
      labelsLayer.appendChild(el)
      labelEls.set(b.name, el)
    })

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      const { clientWidth, clientHeight } = canvas
      canvas.width = Math.floor(clientWidth * dpr)
      canvas.height = Math.floor(clientHeight * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    let NEAR_D = 0.1

    // Background
    function loadImage(src) {
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve(img)
        img.onerror = reject
        img.src = src
      })
    }
    let bgImg = null
    let bgFar = null
    // let bgNear = null
    const bgImage = bg_Space;
    (async () => {
      bgImg = await loadImage(bgImage)
      bgFar = ctx.createPattern(bgImg, 'repeat')
      // bgNear = ctx.createPattern(bgImg, 'repeat')
    })()
    function drawImageTiled(ctx, img, ox, oy, scale = 1) {
      const { width, height } = ctx.canvas
      const w = img.width * scale
      const h = img.height * scale

      const x0 = ((ox % w) + w) % w
      const y0 = ((oy % h) + h) % h

      for (let y = -y0; y < height; y += h) {
        for (let x = -x0; x < width; x += w) {
          ctx.drawImage(img, x, y, w, h)
        }
      }
    }
    function drawBackground() {
      if (!bgImg) return

      const { right, up } = getCameraBasis()

      const kFar = 0.05
      const kNear = 0.075

      const roll = cam.current.roll || 0
      const yaw = cam.current.yaw || 0
      const pitch = cam.current.pitch || 0

      const yawFar = 0.05
      const yawNear = 0.02
      const pitchFar = 0.05
      const pitchNear = 0.02
      const rotFar = roll + yaw * yawFar + pitch * pitchFar
      const rotNear = roll + yaw * yawNear + pitch * pitchNear

      const txFar = (cam.current.target.x * right.x + cam.current.target.y * right.y + cam.current.target.z * right.z) * kFar
      const tyFar = (cam.current.target.x * up.x + cam.current.target.y * up.y + cam.current.target.z * up.z) * kFar
      const txNear = (cam.current.target.x * right.x + cam.current.target.y * right.y + cam.current.target.z * right.z) * kNear
      const tyNear = (cam.current.target.x * up.x + cam.current.target.y * up.y + cam.current.target.z * up.z) * kNear

      const { width, height } = canvas

      ctx.fillStyle = '#000'
      ctx.fillRect(0, 0, width, height)

      const canTransform = bgFar && bgFar.setTransform /*&& bgNear && bgNear.setTransform*/

      if (canTransform) {
        // Far
        {
          const m = new DOMMatrix()
            .translateSelf(width / 2, height / 2)
            .rotateSelf((rotFar * 180) / Math.PI)
            .translateSelf(-width / 2, -height / 2)
            .translateSelf(txFar, tyFar)
          bgFar.setTransform(m)
          ctx.save()
          ctx.fillStyle = bgFar
          ctx.globalAlpha = 1
          ctx.fillRect(0, 0, width, height)
          ctx.restore()
        }

        // Near
        // {
        //   const m = new DOMMatrix()
        //     .translateSelf(width / 2, height / 2)
        //     .rotateSelf((rotNear * 180) / Math.PI)
        //     .translateSelf(-width / 2, -height / 2)
        //     .translateSelf(txNear, tyNear)
        //   bgNear.setTransform(m)
        //   ctx.save()
        //   ctx.fillStyle = bgNear
        //   ctx.globalAlpha = 0.7
        //   ctx.fillRect(0, 0, width, height)
        //   ctx.restore()
        // }
      } else {
        // Fallback
        ctx.save()
        ctx.translate(width / 2, height / 2)
        ctx.rotate(rotFar)
        ctx.translate(-width / 2, -height / 2)
        ctx.globalAlpha = 1
        drawImageTiled(ctx, bgImg, txFar, tyFar, 1)
        ctx.restore()

        // ctx.save()
        // ctx.translate(width / 2, height / 2)
        // ctx.rotate(rotNear)
        // ctx.translate(-width / 2, -height / 2)
        // ctx.globalAlpha = 0.7
        // drawImageTiled(ctx, bgImg, txNear, tyNear, 1)
        // ctx.restore()
      }
    }

    // Camera
    const getCameraBasis = () => {
      const { yaw, pitch, dist, target, roll } = cam.current

      const eye = {
        x: target.x + dist * Math.cos(pitch) * Math.sin(yaw),
        y: target.y + dist * Math.sin(pitch),
        z: target.z + dist * Math.cos(pitch) * Math.cos(yaw),
      }

      const fx = target.x - eye.x
      const fy = target.y - eye.y
      const fz = target.z - eye.z
      const fl = Math.hypot(fx, fy, fz) || 1
      const fvx = fx / fl
      const fvy = fy / fl
      const fvz = fz / fl

      let rx = -fvz
      let ry = 0
      let rz = fvx
      const rl = Math.hypot(rx, ry, rz) || 1
      rx /= rl
      ry /= rl
      rz /= rl

      const ux = ry * fvz - rz * fvy
      const uy = rz * fvx - rx * fvz
      const uz = rx * fvy - ry * fvx

      const cosR = Math.cos(roll || 0)
      const sinR = Math.sin(roll || 0)
      const r2 = { x: rx * cosR + ux * sinR, y: ry * cosR + uy * sinR, z: rz * cosR + uz * sinR }
      const u2 = { x: ux * cosR - rx * sinR, y: uy * cosR - ry * sinR, z: uz * cosR - rz * sinR }

      return {
        eye,
        right: r2,
        up: u2,
        forward: { x: fvx, y: fvy, z: fvz},
      }
    }

    const project = (p, basis) => {
      const { eye, right, up, forward } = basis
      const px = p.x - eye.x
      const py = p.y - eye.y
      const pz = p.z - eye.z

      const cx = px * right.x + py * right.y + pz * right.z
      const cy = px * up.x + py * up.y + pz * up.z
      const cz = -(px * forward.x + py * forward.y + pz * forward.z)
      if (Math.abs(cz) < 1e-6) return {visible: false, depth: Infinity }

      const z = -cz
      const farCap = Number.isFinite(FAR) ? FAR : 1e12
      const zProj = Math.max(z, NEAR_D)

      const { width, height } = canvas
      const aspect = width / height
      const f = 1 / Math.tan((fov * Math.PI) / 360)
      const sx = (cx * f / aspect) / (-zProj)
      const sy = (cy * f) / (-zProj)
      const x = width / 2 + (width / 2) * sx
      const y = height / 2 - (height / 2) * sy
      const visible = x >= -50 && x <= width + 50 && y >= -50 && y <= height + 50

      return { x, y, visible, depth: z, zProj }
    }

    function zoom(amount) {
      const locked = lockRef.current !== ' '
      const basis = getCameraBasis()
      if (locked) {
        camTarget.current.dist = clamp(camTarget.current.dist + amount, 1e-4, 4000)
        // camTarget.current.dist = camTarget.current.dist + amount
      } else {
        camTarget.current.target.x += amount * basis.forward.x
        camTarget.current.target.y += amount * basis.forward.y
        camTarget.current.target.z += amount * basis.forward.z
      }
    }

    function drawFrame(now) {
      const dt = (now - lastT.current) / 1000
      lastT.current = now
      // if (!pause) simDays.current += dt * timeScale
      if (!pause) {
        const daysPerSecond = timeUnit === 'days' ? timeScale : (timeScale / 24)
        simDays.current += dt * daysPerSecond
      }
      const days = simDays.current
      NEAR_D = Math.max(0.0004 * cam.current.dist, 1e-6)

      // Keyboard
      const basisForKeys = getCameraBasis()
      const rotRate = 0.8
      const rollRate = 1.2
      const pitchRate = 0.5
      const moveRate = cam.current.dist * moveScale * dt
      const zoomStep = cam.current.dist * zoomScale * dt
      const locked = lockRef.current !== ' '
      const kKeys = 2 * dt
      const factorIn = Math.exp(-kKeys)
      const factorOut = Math.exp(+kKeys)

      if (keys.current.has('KeyA')) {
        camTarget.current.yaw += rotRate * dt
      }
      if (keys.current.has('KeyD')) {
        camTarget.current.yaw -= rotRate * dt
      }
      if (keys.current.has('KeyS')) {
        camTarget.current.pitch = clamp(camTarget.current.pitch + pitchRate * dt, -1.4, 1.4)
      }
      if (keys.current.has('KeyW')) {
        camTarget.current.pitch = clamp(camTarget.current.pitch - pitchRate * dt, -1.4, 1.4)
      }
      if (keys.current.has('KeyQ')) {
        camTarget.current.roll += rollRate * dt
      }
      if (keys.current.has('KeyE')) {
        camTarget.current.roll -= rollRate * dt
      }
      if (keys.current.has('KeyR')) {
        if (locked) {zoom(-zoomStep)} else {zoom(+zoomStep)}
        // camTarget.current.dist = clamp(camTarget.current.dist * factorIn, 1e-6, 4e3)
      }
      if (keys.current.has('KeyF')) {
        if (locked) {zoom(+zoomStep)} else {zoom(-zoomStep)}
        // camTarget.current.dist = clamp(camTarget.current.dist * factorOut, 1e-6, 4e3)
      }
      if (!locked) {
        if (keys.current.has('ArrowRight')) {
          camTarget.current.target.x -= moveRate * basisForKeys.right.x
          camTarget.current.target.y -= moveRate * basisForKeys.right.y
          camTarget.current.target.z -= moveRate * basisForKeys.right.z
        }
        if (keys.current.has('ArrowLeft')) {
          camTarget.current.target.x += moveRate * basisForKeys.right.x
          camTarget.current.target.y += moveRate * basisForKeys.right.y
          camTarget.current.target.z += moveRate * basisForKeys.right.z
        }
        if (keys.current.has('ArrowUp')) {
          camTarget.current.target.x -= moveRate * basisForKeys.up.x
          camTarget.current.target.y -= moveRate * basisForKeys.up.y
          camTarget.current.target.z -= moveRate * basisForKeys.up.z
        }
        if (keys.current.has('ArrowDown')) {
          camTarget.current.target.x += moveRate * basisForKeys.up.x
          camTarget.current.target.y += moveRate * basisForKeys.up.y
          camTarget.current.target.z += moveRate * basisForKeys.up.z
        }
      }

      // Background
      // ctx.fillStyle = '#000'
      // ctx.fillRect(0, 0, canvas.width, canvas.height)
      drawBackground()

      const resolvePositionsAU = makePositionResolver(elements)
      const positions_AU = resolvePositionsAU(days)

      // const positions_AU = new Array(bodies.length).fill(null)
      // for (let i = 0; i < bodies.length; i++) {
      //   const b = bodies[i]
      //   if (b.type === 'star') {
      //     positions_AU[i] = { x: 0, y: 0, z: 0 }
      //     continue
      //   }
      //   const el = elements[i]
      //   const rel = keplerToPosition(days, el)
      //   const parentName = el.orbit_target || 'Sun'
      //   const parentIdx = idxByName.get(parentName)
      //   const parentPos = parentIdx != null ? positions_AU[parentIdx] : { x: 0, y: 0, z: 0 }
      //   positions_AU[i] = {
      //     x: rel.x + parentPos.x,
      //     y: rel.y + parentPos.y,
      //     z: rel.z + parentPos.z,
      //   }
      // }

      const positions = positions_AU.map((p) => ({
        x: p.x * AU_units,
        y: p.y * AU_units,
        z: p.z * AU_units
      }))

      // Lock follows target position
      if (lockRef.current !== ' ') {
        const idx = nameToIndex.get(lockRef.current)
        if (idx != null) {
          const p = positions[idx]
          camTarget.current.target.x = p.x
          camTarget.current.target.y = p.y
          camTarget.current.target.z = p.z
        }
      }

      const s = 1 - Math.exp(-dt * 8)
      cam.current.yaw += (camTarget.current.yaw - cam.current.yaw) * s
      cam.current.pitch += (camTarget.current.pitch - cam.current.pitch) * s
      cam.current.roll += (camTarget.current.roll - cam.current.roll) * s
      cam.current.dist += (camTarget.current.dist - cam.current.dist) * s
      cam.current.target.x += (camTarget.current.target.x - cam.current.target.x) * s
      cam.current.target.y += (camTarget.current.target.y - cam.current.target.y) * s
      cam.current.target.z += (camTarget.current.target.z - cam.current.target.z) * s

      cam.current.dist = Math.max(1e-6, cam.current.dist)

      const basis = getCameraBasis()

      if (showOrbits) {
        ctx.lineWidth = 1
        for (let i = 0; i < bodies.length; i++) {
          const b = bodies[i]
          if (b.type === 'star' && (!showStars || !showOrbitsStars)) continue
          if (b.type === 'planet' && (!showPlanets || !showOrbitsPlanets)) continue
          if (b.type === 'dwarf-planet' && (!showDwarfs || !showOrbitsDwarfplanets)) continue
          if (b.type === 'moon') {
            if (!showOrbitsMoons) continue
            if (!shouldShowMoon(i)) continue
          }
          if (b.type === 'asteroid' && (!showAsteroids || !showOrbitsAsteroids)) continue

          const el = elements[i]
          const parentName = (el && el.orbit_target) || 'Sun'
          const parentIdx = idxByName.get(parentName)
          const parentPos = parentIdx != null ? positions_AU[parentIdx] : { x: 0, y: 0, z: 0 }

          const pts = relOrbitPts[i]
          if (!pts || pts.length < 2) continue
          const nPts = pts.length

          const dir = orbitDir(el)

          const e = Math.max(0, Math.min(0.99999, el?.e || 0))
          const n = (2 * Math.PI / Math.abs(el?.period_days || 1)) * dir
          const M0 = ((el?.M0_deg || 0) * DEG)
          const M = (M0 + n * days) % (2 * Math.PI)
          const E = solveE(M < 0 ? M + 2 * Math.PI : M, e)
          const tanNuOver2 = Math.sqrt((1 + e) / (1 - e)) * Math.tan(E / 2)
          let nu = 2 * Math.atan(tanNuOver2)
          if (nu < 0) nu += 2 * Math.PI

          const head = Math.floor((nu / (2 * Math.PI)) * nPts) % nPts

          const baseLW = 1 + Math.log10(1 + cam.current.dist / 200) * 0.5
          const aUnits = (el?.distance || 0) * AU_units
          const ecc = e

          for (let sIdx = 0; sIdx < nPts; sIdx++) {
            const i0 = wrapIdx(head - dir * sIdx, nPts)
            const i1 = wrapIdx(head - dir * (sIdx + 1), nPts)

            const p0r = pts[i0]
            const p1r = pts[i1]
            
            const p0 = {
              x: (p0r.x + parentPos.x) * AU_units,
              y: (p0r.y + parentPos.y) * AU_units,
              z: (p0r.z + parentPos.z) * AU_units
            }
            const p1 = {
              x: (p1r.x + parentPos.x) * AU_units,
              y: (p1r.y + parentPos.y) * AU_units,
              z: (p1r.z + parentPos.z) * AU_units
            }

            const q0 = project(p0, basis)
            const q1 = project(p1, basis)
            if (!q0.visible && !q1.visible) continue
            if (!isFinite(q0.x) || !isFinite(q0.y) || !isFinite(q1.x) || !isFinite(q1.y)) continue

            const segLen3D = Math.hypot(p0.x - p1.x, p0.y - p1.y, p0.z - p1.z)
            const maxSeg3D = Math.max(500, aUnits * (0.15 + 0.35 * ecc))
            if (segLen3D > maxSeg3D) continue

            const dz = Math.abs(q0.depth - q1.depth)
            if (dz > Math.max(2e6, 2e3 * aUnits)) continue

            const t = sIdx / (nPts - 1)
            const alpha = 0.9 * (1 - t) + 0.1

            ctx.globalAlpha = alpha
            ctx.strokeStyle = getOrbitColor(b, el)
            const prevLW = ctx.lineWidth
            ctx.lineWidth = baseLW
            
            ctx.beginPath()
            ctx.moveTo(q0.x, q0.y)
            ctx.lineTo(q1.x, q1.y)
            ctx.stroke()

            ctx.lineWidth = prevLW
          }
        }
        ctx.globalAlpha = 1
      }

      // Draw bodies
      const { height } = canvas
      const f = 1 / Math.tan((fov * Math.PI) / 360)
      const drawList = bodies.map((b, i) => {
        const S = positions[i]
        const proj = project(S, basis)
        const radUnits = radiusUnitsOf(b, radiusScale)
        return { body: b, proj, radUnits }
      })
      .filter((d) => {
        const farCap = Number.isFinite(FAR) ? FAR : 1e12
        return d.proj.visible && d.proj.depth > 0 && d.proj.depth < farCap
      })
      .sort((a, b) => b.proj.depth - a.proj.depth)

      for (const d of drawList) {
        const b = d.body
        if (b.type === 'star' && !showStars) continue
        if (b.type === 'planet' && !showPlanets) continue
        if (b.type === 'dwarf-planet' && !showDwarfs) continue
        if (b.type === 'moon' && !shouldShowMoon(nameToIndex.get(b.name))) continue
        if (b.type === 'asteroid' && !showAsteroids) continue
        const screenRad = (d.radUnits * f / d.proj.zProj) * (height / 2)
        const rPix = Math.max(1, screenRad)
        ctx.beginPath()
        ctx.arc(d.proj.x, d.proj.y, rPix, 0, Math.PI * 2)
        ctx.fillStyle = b.color
        ctx.fill()
      }

      // Labels
      for (const [, el] of labelEls) {
        el.style.display = 'none'
      }
      drawList.forEach(({ body: b, proj }) => {
        const el = labelEls.get(b.name)
        if (!el) return
        if (!showLabels) { el.style.display = 'none'; return }
        if (b.type === 'star' && !showLabelsStars) { el.style.display = 'none'; return }
        if (b.type === 'star' && !showStars) { el.style.display = 'none'; return }
        if (b.type === 'planet' && !showLabelsPlanets) { el.style.display = 'none'; return }
        if (b.type === 'planet' && !showPlanets) { el.style.display = 'none'; return }
        if (b.type === 'dwarf-planet' && !showLabelsDwarfplanets) { el.style.display = 'none'; return }
        if (b.type === 'dwarf-planet' && !showDwarfs) { el.style.display = 'none'; return }
        if (b.type === 'moon' && !showLabelsMoons) { el.style.display = 'none'; return }
        if (b.type === 'moon' && !shouldShowMoon(nameToIndex.get(b.name))) {
          el.style.display = 'none'
          return
        }
        if (b.type === 'asteroid' && !showLabelsAsteroids) { el.style.display = 'none'; return }
        if (b.type === 'asteroid' && !showAsteroids) { el.style.display = 'none'; return }
        const elOrbCol = elements[nameToIndex.get(b.name)]
        el.style.display = 'block'
        el.style.transform = `translate(${proj.x}px, ${proj.y}px)`
        el.style.color = getOrbitColor(b, elOrbCol)
      })

      raf.current = requestAnimationFrame(drawFrame)
    }

    raf.current = requestAnimationFrame(drawFrame)

    // Mouse controls
    const onWheel = (e) => {
      e.preventDefault()
      const k = 0.001
      const factor = Math.exp(e.deltaY * k)
      const speed = Math.max(1, cam.current.dist * 0.1)
      const amount = e.deltaY * 0.05 * speed * zoomScale
      const locked = lockRef.current !== ' '
      const basis = getCameraBasis()
      if (locked) {
        camTarget.current.dist = clamp(camTarget.current.dist * factor, 1e-6, 4000)
      } else {
        camTarget.current.target.x -= amount * basis.forward.x
        camTarget.current.target.y -= amount * basis.forward.y
        camTarget.current.target.z -= amount * basis.forward.z
      }
    }
    const onDown = (e) => {
      e.preventDefault()
      drag.current.active = true
      drag.current.x = e.clientX
      drag.current.y = e.clientY
      drag.current.yaw0 = camTarget.current.yaw
      drag.current.pitch0 = camTarget.current.pitch
      drag.current.move = e.shiftKey || e.button === 1 || e.button === 2
    }
    const onMove = (e) => {
      if (!drag.current.active) return
      const dx = e.clientX - drag.current.x
      const dy = e.clientY - drag.current.y
      const locked = lockRef.current !== ' '
      if (drag.current.move) {
        if (locked) return
        const { right, up } = getCameraBasis()
        const moveSpeed = cam.current.dist * 0.0015 * moveScale
        camTarget.current.target.x -= (dx * moveSpeed) * right.x + (-dy * moveSpeed) * up.x
        camTarget.current.target.y -= (dx * moveSpeed) * right.y + (-dy * moveSpeed) * up.y
        camTarget.current.target.z -= (dx * moveSpeed) * right.z + (-dy * moveSpeed) * up.z
      } else {
        camTarget.current.yaw = drag.current.yaw0 - dx * 0.005
        camTarget.current.pitch = clamp(drag.current.pitch0 - dy * 0.003, -1.4, 1.4)
      }
    }
    const onUp = () => { drag.current.active = false }
    const onContext = (e) => e.preventDefault()

    canvas.addEventListener('wheel', onWheel, { passive: false })
    canvas.addEventListener('mousedown', onDown)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    canvas.addEventListener('contextmenu', onContext)

    // Cleanup
    return () => {
      cancelAnimationFrame(raf.current)
      ro.disconnect()
      canvas.removeEventListener('wheel', onWheel)
      canvas.removeEventListener('mousedown', onDown)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      canvas.removeEventListener('contextmenu', onContext)
      for (const [name, el] of labelEls) {
        el.replaceWith(el.cloneNode(true))
      }
      labelsLayer.innerHTML = ''
    }
  }, [
    bodies,
    elements,
    idxByName,
    nameToIndex,
    relOrbitPts,
    pause,
    timeUnit,
    timeScale,
    radiusScale,
    moveScale,
    zoomScale,
    fov,
    showOrbits,
    showOrbitsStars,
    showOrbitsPlanets,
    showOrbitsDwarfplanets,
    showOrbitsMoons,
    showOrbitsAsteroids,
    showLabels,
    showLabelsStars,
    showLabelsPlanets,
    showLabelsDwarfplanets,
    showLabelsMoons,
    showLabelsAsteroids,
    showStars,
    showPlanets,
    showDwarfs,
    showMoons,
    showRegular,
    showIrregular,
    showSatellitesOnlyOfLocked,
    showAsteroids,
    orbitColorMode,
  ])

  // Camera lock
  useEffect(() => {
    if (lockTarget === ' ') return
    const idx = nameToIndex.get(lockTarget)
    if (idx == null) return
    const days = simDays.current
    const el = elements[idx]
    if (!el) return

    const pIdx = idxByName.get(el.orbit_target || 'Sun')
    let parentPos = { x: 0, y: 0, z: 0 }
    if (pIdx != null && bodies[pIdx].type !== 'star') {
      const parentEl = elements[pIdx]
      const parentRel = keplerToPosition(days, parentEl)
      parentPos = parentRel
    }
      
    const rel = keplerToPosition(days, el)
    const x = (rel.x + parentPos.x) * AU_units
    const y = (rel.y + parentPos.y) * AU_units
    const z = (rel.z + parentPos.z) * AU_units

    cam.current.target.x = x
    cam.current.target.y = y
    cam.current.target.z = z
    camTarget.current.target.x = x
    camTarget.current.target.y = y
    camTarget.current.target.z = z
  }, [bodies, elements, nameToIndex, idxByName, lockTarget])

  // Panel resize
  useEffect(() => {
    const onMove = (e) => {
      if (!resDrag.current.active) return
      const dx = resDrag.current.startX - e.clientX
      setPanelWidth((w) => clamp(resDrag.current.startW + dx, 250, 500))
    }
    const onUp = () => { resDrag.current.active = false }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [])

  const startResize = (e) => {
    e.preventDefault()
    if (!panelActive) return
    resDrag.current.active = true
    resDrag.current.startX = e.clientX
    resDrag.current.startW = panelWidth
  }

  const resetCam = () => {
    camTarget.current.yaw = camInitYaw
    camTarget.current.pitch = camInitPitch
    camTarget.current.roll = camInitRoll
    camTarget.current.dist = camInitDist
    camTarget.current.target.x = camInitX
    camTarget.current.target.y = camInitY
    camTarget.current.target.z = camInitZ
  }

  return (
    <div className='main'>
      <div className='sim-root' style={{ gridTemplateColumns: panelActive ? `1fr ${panelWidth}px` : '1fr 0px'}}>
        {/* <aside className='sim-panel-left'></aside> */}

        <div className='sim-stage'>
          <button className='sim-toggle' onClick={() => setPanelActive((v) => !v)}>
            {panelActive ? 'Hide panel' : 'Show panel'}
          </button>
          <canvas className='sim-canvas' ref={canvasRef}/>
          <div className='sim-label-layer' ref={labelsRef}/>
        </div>

        <aside className='sim-panel'>
          <div className='sim-resizer' onMouseDown={startResize}/>
          <h2>Settings</h2>
          <div className='sim-row'>
            <label>
              <input type='checkbox' checked={pause} onChange={(e) => setPause(e.target.checked)}/> Pause
            </label>
          </div>
          <div className='sim-row'>
            <label>
              Time scale: {timeScale.toFixed(0)}
              {' '}
              <select
                className='sim-select-small'
                value={timeUnit}
                onChange={(e) => {
                  const next = e.target.value
                  if (next === 'hours' && timeUnit === 'days') {
                    setTimeScale(Math.min(24, Math.max(1, Math.round(timeScale * 24))))
                  } else if (next === 'days' && timeUnit === 'hours') {
                    setTimeScale(Math.min(365, Math.max(1, Math.round(timeScale / 24))))
                  }
                  setTimeUnit(next)
                }}
              >
                <option value='hours'>h/s</option>
                <option value='days'>d/s</option>
              </select>
            </label>
            <input
              type='range'
              min={timeUnit === 'days' ? 1 : 1}
              max={timeUnit === 'days' ? 365 : 24}
              step={1}
              value={timeScale}
              onChange={(e) => setTimeScale(+e.target.value)}
            />
          </div>
          <div className='sim-row'>
            <label>Radius scale: × {radiusScale}</label>
            <input type='range' min='1' max='1000' value={radiusScale} onChange={(e) => setRadiusScale(+e.target.value)}/>
          </div>
          <div className='sim-row'>
            <label>Move scale: × {moveScale}</label>
            <input type='range' min='0.01' max='100' step='0.01' value={moveScale} onChange={(e) => setMoveScale(+e.target.value)}/>
          </div>
          <div className='sim-row'>
            <label>Zoom scale: × {zoomScale}</label>
            <input type='range' min='0.1' max='10' step='0.1' value={zoomScale} onChange={(e) => setZoomScale(+e.target.value)}/>
          </div>
          {/* <div className='sim-row'>
            <label>FOV: {fov.toFixed(0)}°</label>
            <input type='range' min='30' max='100' value={fov} onChange={(e) => setFov(+e.target.value)}/>
          </div> */}
          <div className='sim-row'>
            <SimDropdown title='Labels'>
              <div className='sim-dropdown-item'>
                <label>
                  <input type='checkbox' checked={showLabels} onChange={(e) => setShowLabels(e.target.checked)}/> Enabled
                </label>
              </div>
              <div className='sim-dropdown-item'>
                <label>
                  <input type='checkbox' checked={showLabelsStars} onChange={(e) => setShowLabelsStars(e.target.checked)}/> Stars
                </label>
              </div>
              <div className='sim-dropdown-item'>
                <label>
                  <input type='checkbox' checked={showLabelsPlanets} onChange={(e) => setShowLabelsPlanets(e.target.checked)}/> Planets
                </label>
              </div>
              <div className='sim-dropdown-item'>
                <label>
                  <input type='checkbox' checked={showLabelsDwarfplanets} onChange={(e) => setShowLabelsDwarfplanets(e.target.checked)}/> Dwarf-planets
                </label>
              </div>
              <div className='sim-dropdown-item'>
                <label>
                  <input type='checkbox' checked={showLabelsMoons} onChange={(e) => setShowLabelsMoons(e.target.checked)}/> Moons
                </label>
              </div>
              <div className='sim-dropdown-item'>
                <label>
                  <input type='checkbox' checked={showLabelsAsteroids} onChange={(e) => setShowLabelsAsteroids(e.target.checked)}/> Asteroids
                </label>
              </div>
            </SimDropdown>
          </div>
          <div className='sim-row'>
            <SimDropdown title='Orbits'>
              <div className='sim-dropdown-item'>
                <label>
                  <input type='checkbox' checked={showOrbits} onChange={(e) => setShowOrbits(e.target.checked)}/> Enabled
                </label>
              </div>
              <div className='sim-dropdown-item'>
                <label>
                  <input type='checkbox' checked={showOrbitsStars} onChange={(e) => setShowOrbitsStars(e.target.checked)}/> Stars
                </label>
              </div>
              <div className='sim-dropdown-item'>
                <label>
                  <input type='checkbox' checked={showOrbitsPlanets} onChange={(e) => setShowOrbitsPlanets(e.target.checked)}/> Planets
                </label>
              </div>
              <div className='sim-dropdown-item'>
                <label>
                  <input type='checkbox' checked={showOrbitsDwarfplanets} onChange={(e) => setShowOrbitsDwarfplanets(e.target.checked)}/> Dwarf-planets
                </label>
              </div>
              <div className='sim-dropdown-item'>
                <label>
                  <input type='checkbox' checked={showOrbitsMoons} onChange={(e) => setShowOrbitsMoons(e.target.checked)}/> Moons
                </label>
              </div>
              <div className='sim-dropdown-item'>
                <label>
                  <input type='checkbox' checked={showOrbitsAsteroids} onChange={(e) => setShowOrbitsAsteroids(e.target.checked)}/> Asteroids
                </label>
              </div>
            </SimDropdown>
          </div>
          <div className='sim-row'>
            <SimDropdown title='Bodies'>
              <div className='sim-dropdown-item'>
                <label>
                   <input type='checkbox' checked={showStars} onChange={(e) => setShowStars(e.target.checked)}/> Show stars
                </label>
              </div>
              <div className='sim-dropdown-item'>
                <label>
                  <input type='checkbox' checked={showPlanets} onChange={(e) => setShowPlanets(e.target.checked)}/> Show planets
                </label>
              </div>
              <div className='sim-dropdown-item'>
                <label>
                  <input type='checkbox' checked={showDwarfs} onChange={(e) => setShowDwarfs(e.target.checked)}/> Show dwarf-planets
                </label>
              </div>
              <div className='sim-dropdown-item'>
                <label>
                  <input type='checkbox' checked={showMoons} onChange={(e) => setShowMoons(e.target.checked)}/> Show moons
                </label>
              </div>
              <div className='sim-dropdown-item'>
                <label>
                  <input type='checkbox' checked={showRegular} onChange={(e) => setShowRegular(e.target.checked)}/> Show regular satellites
                </label>
              </div>
              <div className='sim-dropdown-item'>
                <label>
                  <input type='checkbox' checked={showIrregular} onChange={(e) => setShowIrregular(e.target.checked)}/> Show irregular satellites
                </label>
              </div>
              <div className='sim-dropdown-item'>
                <label>
                  <input type='checkbox' checked={showSatellitesOnlyOfLocked} onChange={(e) => setShowSatellitesOnlyOfLocked(e.target.checked)}/> Show satellites only for camera locked object
                </label>
              </div>
              <div className='sim-dropdown-item'>
                <label>
                  <input type='checkbox' checked={showAsteroids} onChange={(e) => setShowAsteroids(e.target.checked)}/> Show asteroids
                </label>
              </div>
              {/* <div className='sim-dropdown-item'>
                <label>
                  <input type='checkbox' checked={showAsteroidBelt} onChange={(e) => setShowAsteroidBelt(e.target.checked)}/> Show asteroid belt
                </label>
              </div> */}
              {/* <div className='sim-dropdown-item'>
                <label>
                  <input type='checkbox' checked={showKuiperBelt} onChange={(e) => setShowKuiperBelt(e.target.checked)}/> Show Kuiper belt
                </label>
              </div> */}
            </SimDropdown>
          </div>
          <div className='sim-row'>
            <label>Orbit color mode:</label>
            <select className='sim-select' value={orbitColorMode} onChange={(e) => setOrbitColorMode(e.target.value)}>
              <option value='default'>Default</option>
              <option value='class'>Type</option>
              <option value='group'>Group</option>
              <option value='proretro'>Prograde / Retrograde</option>
            </select>
          </div>
          <div className='sim-row'>
            <label>Lock camera to:</label>
            <select className='sim-select' value={lockTarget} onChange={(e) => setLockTarget(e.target.value)}>
              {lockableTargets.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
            {lockTarget !== ' ' && <small className='sim-note'>Moving is disabled while locked. Rotate/zoom still works.</small>}
          </div>
          <div className='sim-row'>
            <button className='sim-btn' onClick={resetCam}>Reset camera</button>
          </div>
          <div className='sim-help'>
            <p><b>Controls</b></p>
            <ul>
              <li><b>Orbit camera</b>: drag</li>
              <li><b>Rotate</b>: W/A/S/D/Q/E</li>
              <li><b>Move</b>: ←↑↓→, Middle / Shift + drag</li>
              <li><b>Zoom</b>: Wheel, R/F</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  )
}