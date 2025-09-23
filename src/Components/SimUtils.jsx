import { keplerToPosition, positionFromTrueAnomaly } from './SimOrbit'

export function buildNameIndex(bodies) {
  const m = new Map()
  bodies.forEach((b, i) => m.set(b.name, i))
  return m
}

export function precomputeOrbitPolylines(elements, bodies, segments = 512) {
  return elements.map((el, i) => {
    if (bodies[i].name === 'Sun') return []
    const e = Math.min(Math.max(el?.e ?? 0, 0), 0.999999999)
    const SEG = Math.floor(segments * (1 + 4 * e))
    const segCap = 2048
    const segCalc = Math.floor(segments * (1 + 4 * e))
    const seg = Math.min(segCalc, segCap)
    const pts = new Array(seg + 1)
    for (let k = 0; k <= seg; k++) {
      const nu_deg = (k / seg) * 360
      pts[k] = positionFromTrueAnomaly(el, nu_deg)
    }
    return pts
  })
}

export function createPositionResolver(bodies, elements, idxByName) {
  const parentIndexOf = (i) => {
    const pn = elements[i]?.orbit_target || 'Sun'
    return idxByName.get(pn) ?? null
  }

  return (days) => {
    const memo = new Array(elements.length)
    const visiting = new Array(elements.length)

    function compute(i) {
      if (memo[i]) return memo[i]
      if (visiting[i]) return (memo[i] = { x: 0, y: 0, z: 0 })
      visiting[i] = true

      const b = bodies[i]
      if (b.type === 'star') {
        visiting[i] = false
        return (memo[i] = { x: 0, y: 0, z: 0 })
      }

      const el = elements[i]
      const pIdx = parentIndexOf(i)
      const pPos = pIdx != null ? compute(pIdx) : { x: 0, y: 0, z: 0 }
      const rel = keplerToPosition(days, el)

      visiting[i] = false

      return (memo[i] = { x: pPos.x + rel.x, y: pPos.y + rel.y, z: pPos.z + rel.z })
    }

    for (let i = 0; i < elements.length; i++) compute(i)

    return memo
  }
}

export function toWorldUnits(positionsAU, AU_units) {
  return positionsAU.map((p) => ({ x: p.x * AU_units, y: p.y * AU_units, z: p.z * AU_units }))
}

export function makeWorldPosOf(nameToIndex, positions) {
  return (name) => {
    const i = nameToIndex.get(name)
    return i == null ? null : positions[i]
  }
}

export function makeParentPosOf(elements, idxByName, nameToIndex, positions) {
  return (name) => {
    const i = nameToIndex.get(name)
    if (i == null) return null
    const parentName = elements[i]?.orbit_target || 'Sun'
    const pi = idxByName.get(parentName)
    return pi == null ? { x: 0, y: 0, z: 0 } : positions[pi]
  }
}

export function makeIsPrimaryVisibleByType(bodies, { showStars, showPlanets, showDwarfs, showAsteroids }) {
  return (i) => {
    const t = bodies[i]?.type
    if (t === 'star') return showStars
    if (t === 'planet') return showPlanets
    if (t === 'dwarf-planet') return showDwarfs
    if (t === 'asteroid') return showAsteroids
    return true
  }
}

export function buildLockedPrimaryName(bodies, elements, nameToIndex) {
  const parentNameOf = (i) => elements[i]?.orbit_target || 'Sun'
  const typeOf = (i) => bodies[i]?.type
  return (lockTarget) => {
    if (!lockTarget || lockTarget === ' ') return null
    const li = nameToIndex.get(lockTarget)
    if (li == null) return null
    const lt = typeOf(li)
    if (lt === 'planet' || lt === 'dwarf-planet' || lt === 'asteroid') return bodies[li].name
    if (lt === 'moon') return parentNameOf(li)
    return null
  }
}

export function makeShouldShowMoon({
  bodies,
  elements,
  nameToIndex,
  isPrimaryVisibleByType,
  getLockTarget,
  showMoons,
  showRegular,
  showIrregular,
  showSatellitesOnlyOfLocked,
}) {
  const parentNameOf = (i) => elements[i]?.orbit_target || 'Sun'
  const lockedPrimaryNameFor = buildLockedPrimaryName(bodies, elements, nameToIndex)
  return (i) => {
    const b = bodies[i]
    if (b.type !== 'moon') return true
    if (!showMoons) return false

    const cls = b.orbit_type || 'regular'
    if (cls === 'regular' && !showRegular) return false
    if (cls === 'irregular' && !showIrregular) return false

    const pName = parentNameOf(i)

    if (showSatellitesOnlyOfLocked) {
      const L = lockedPrimaryNameFor(getLockTarget?.())
      if (!L) return false
      return pName === L
    }

    const pi = nameToIndex.get(pName)
    if (pi != null && !isPrimaryVisibleByType(pi)) return false

    return true
  }
}

export function wrapIndex(i, n) {
  return (i % n + n) % n
}