export const AU_units = 64 // World units per AU
export const AU_km = 149_597_870.7
// export const NEAR = Math.max(0.0004 * cam.current.dist, 1e-6)
export const FAR = Infinity
export const DEG = Math.PI / 180

export const kmToAU = (km) => km / AU_km
export const auToUnits = (au) => au * AU_units
export const kmToUnits = (km) => auToUnits(kmToAU(km))
export const radiusUnitsOf = (b, rScale) => {
  if (b.type === 'star') {
    return
  }/* else if (b.type === 'dwarf-planet') {
    return kmToUnits(b.radius) * rScale * 10
  } else if (b.type === 'asteroid') {
    return kmToUnits(b.radius) * rScale * 10
  }*/ else {
    return kmToUnits(b.radius) * rScale
  }
}

export function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi ?? Infinity, v)) }

export function normPi(a) {
  a = (a + Math.PI) % (2 * Math.PI)
  if (a < 0) a += 2 * Math.PI
  return a - Math.PI
}

export function shortestStep(cur, target, maxStep) {
  const delta = normPi(target - cur)
  const step = clamp(delta, -maxStep, maxStep)
  return normPi(cur + step)
}