import { DEG } from './SimConstants'

export function orbitDir(el) {
  if (el.orbit_direction ===   'prograde') return +1
  if (el.orbit_direction === 'retrograde') return -1
  const inc = el.tilt_inclination ?? 0
  return inc > 90 ? -1 : +1
}

export function solveE(M, e, iters = 8) {
  M = ((M + Math.PI) % (2 * Math.PI)) - Math.PI
  let E = e < 0.8 ? M : Math.PI
  for (let i = 0; i < iters; i++) {
    const f = E - e * Math.sin(E) - M
    const fp = 1 - e * Math.cos(E)
    E = E - f / fp
  }
  return E
}

export function keplerToPosition(days, el) {
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

export function positionFromTrueAnomaly(el, nu_deg) {
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

  const x1 = xP * cosω - yP * sinω
  const y1 = xP * sinω + yP * cosω
  const z1 = 0

  const x2 = x1
  const y2 = y1 * cosi - z1 * sini
  const z2 = y1 * sini + z1 * cosi

  const x = x2 * cosΩ - y2 * sinΩ
  const y = x2 * sinΩ + y2 * cosΩ
  const z = z2

  return { x, y, z }
}