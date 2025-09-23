import React, { useMemo, forwardRef, useImperativeHandle } from 'react'
import { projectPoint } from './SimCamera'
import { AU_units as AU_units_default, DEG, FAR, radiusUnitsOf } from './SimConstants'
import { orbitDir, solveE, positionFromTrueAnomaly } from './SimOrbit'

function ringCount(pts) {
  const n = pts?.length || 0
  if (n < 2) return 0
  const a = pts[0]
  const b = pts[n - 1]
  const closed = Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z) < 1e-9
  return closed ? (n - 1) : n
}
function tj(ti, pa, pb, alpha = 0.5) {
  const dx = pb.x - pa.x
  const dy = pb.y - pa.y
  const dz = pb.z - pa.z
  const d = Math.max(1e-9, Math.hypot(dx, dy, dz))
  return ti + Math.pow(d, alpha)
}
function catmullRomCentripetal(p0, p1, p2, p3, t01, t12, t23, t) {
  const t1 = t01
  const t2 = t12
  const t3 = t23
  const t_ = t1 + (t2 - t1) * t

  const A1 = {
    x: (t1 - t_) / (t1 - 0) * p0.x + (t_ - 0) / (t1 - 0) * p1.x,
    y: (t1 - t_) / (t1 - 0) * p0.y + (t_ - 0) / (t1 - 0) * p1.y,
    z: (t1 - t_) / (t1 - 0) * p0.z + (t_ - 0) / (t1 - 0) * p1.z,
  }
  const A2 = {
    x: (t2 - t_) / (t2 - t1) * p1.x + (t_ - t1) / (t2 - t1) * p2.x,
    y: (t2 - t_) / (t2 - t1) * p1.y + (t_ - t1) / (t2 - t1) * p2.y,
    z: (t2 - t_) / (t2 - t1) * p1.z + (t_ - t1) / (t2 - t1) * p2.z,
  }
  const A3 = {
    x: (t3 - t_) / (t3 - t2) * p2.x + (t_ - t2) / (t3 - t2) * p3.x,
    y: (t3 - t_) / (t3 - t2) * p2.y + (t_ - t2) / (t3 - t2) * p3.y,
    z: (t3 - t_) / (t3 - t2) * p2.z + (t_ - t2) / (t3 - t2) * p3.z,
  }

  const B1 = {
    x: (t2 - t_) / (t2 - 0) * A1.x + (t_ - 0) / (t2 - 0) * A2.x,
    y: (t2 - t_) / (t2 - 0) * A1.y + (t_ - 0) / (t2 - 0) * A2.y,
    z: (t2 - t_) / (t2 - 0) * A1.z + (t_ - 0) / (t2 - 0) * A2.z,
  }
  const B2 = {
    x: (t3 - t_) / (t3 - t1) * A2.x + (t_ - t1) / (t3 - t1) * A3.x,
    y: (t3 - t_) / (t3 - t1) * A2.y + (t_ - t1) / (t3 - t1) * A3.y,
    z: (t3 - t_) / (t3 - t1) * A2.z + (t_ - t1) / (t3 - t1) * A3.z,
  }

  return {
    x: (t2 - t_) / (t2 - t1) * B1.x + (t_ - t1) / (t2 - t1) * B2.x,
    y: (t2 - t_) / (t2 - t1) * B1.y + (t_ - t1) / (t2 - t1) * B2.y,
    z: (t2 - t_) / (t2 - t1) * B1.z + (t_ - t1) / (t2 - t1) * B2.z,
  }
}
function sampleCR_centripetal(pts, u, base) {
  const n = base
  const uWrap = ((u % n) + n) % n
  const i1 = Math.floor(uWrap)
  const t = uWrap - i1
  const i0 = (i1 - 1 + n) % n
  const i2 = (i1 + 1) % n
  const i3 = (i1 + 2) % n

  const p0 = pts[i0]
  const p1 = pts[i1]
  const p2 = pts[i2]
  const p3 = pts[i3]

  const t0 = 0
  const t1 = tj(t0, p0, p1, 0.5)
  const t2 = tj(t1, p1, p2, 0.5)
  const t3 = tj(t2, p2, p3, 0.5)

  return catmullRomCentripetal(p0, p1, p2, p3, t1, t2, t3, t)
}

const SimDrawOrbits = forwardRef(function SimDrawOrbits(
  {
    bodies,
    elements,
    indexByName,
    colorMode,
    showOrbits = true,
    showOrbitsStars = false,
    showOrbitsPlanets = true,
    showOrbitsDwarfs = false,
    showOrbitsAsteroids = false,
    showOrbitsMoons = true,
    shouldShowMoon,
    AU_UNITS = AU_units_default,
    segments = 512,
    radiusScale = 1,
    minPixelRadius = 0,
    dotThresholdPx = 0,
    cullBelowPx = 0,
    dotSizePx = 0,
    lwMinPx = 0,
  },
  ref
) {
  const relOrbitPts = useMemo(() => {
    return elements.map((el, i) => {
      if (bodies[i].name === 'Sun') return []
      const e = Math.min(Math.max(el?.e ?? 0, 0), 0.999999999)
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
  }, [elements, bodies, segments])

  useImperativeHandle(ref, () => ({
    draw({ ctx, basis, width, height, fov, NEAR, simDays, positionsAU, camDist }) {
      if (!showOrbits) return

      const farCap = Number.isFinite(FAR) ? FAR : 1e12
      const f = 1 / Math.tan((fov * Math.PI) / 360)

      for (let i = 0; i < bodies.length; i++) {
        const b = bodies[i]
        const el = elements[i]

        if (b.type === 'star' && (!showOrbitsStars)) continue
        if (b.type === 'planet' && (!showOrbitsPlanets)) continue
        if (b.type === 'dwarf-planet' && (!showOrbitsDwarfs)) continue
        if (b.type === 'asteroid' && (!showOrbitsAsteroids)) continue
        if (b.type === 'moon') {
          if (!showOrbitsMoons) continue
          if (typeof shouldShowMoon === 'function' && !shouldShowMoon(i)) continue
        }

        const parentName = (el && el.orbit_target) || 'Sun'
        const parentIdx = indexByName.get(parentName)
        const parentPosAU = parentIdx != null ? positionsAU[parentIdx] : { x: 0, y: 0, z: 0 }

        const pts = relOrbitPts[i]
        if (!pts || pts.length < 2) continue
        const nPts = pts.length
        const nSeg = ringCount(pts)
        if (nSeg < 2) continue

        const dir = orbitDir(el)
        const e = Math.max(0, Math.min(0.999999999, el?.e || 0))
        const n = (2 * Math.PI / Math.abs(el?.period_days || 1)) * dir
        const M0 = ((el?.M0_deg || 0) * DEG)
        const M = (M0 + n * simDays) % (2 * Math.PI)
        const E = solveE(M < 0 ? M + 2 * Math.PI : M, e)
        const tanNuOver2 = Math.sqrt((1 + e) / (1 - e)) * Math.tan(E / 2)
        let nu = 2 * Math.atan(tanNuOver2)
        if (nu < 0) nu += 2 * Math.PI

        const headFloat = (nu / (2 * Math.PI)) * nSeg
        const baseLW = 1 + Math.log10(1 + (camDist || 0) / 200) * 0.5

        const S_world = {
          x: (positionsAU[i]?.x || 0) * AU_UNITS,
          y: (positionsAU[i]?.y || 0) * AU_UNITS,
          z: (positionsAU[i]?.z || 0) * AU_UNITS,
        }
        const projBody = projectPoint(S_world, basis, width, height, fov, NEAR, FAR)
        const zProj = projBody?.zProj || Infinity
        const radUnits = radiusUnitsOf(b, radiusScale)
        const bodyScreenRad = isFinite(zProj) && zProj !== 0
          ? (radUnits * f / zProj) * (height / 2)
          : 0
        let bodyThicknessCapPx
        if (bodyScreenRad < cullBelowPx) {
          bodyThicknessCapPx = lwMinPx
          // continue
        } else if (bodyScreenRad < dotSizePx) {
          bodyThicknessCapPx = Math.max(lwMinPx, dotSizePx)
          // continue
        } else {
          const bodyDiameterPx = Math.max(minPixelRadius, bodyScreenRad) * 2
          bodyThicknessCapPx = Math.max(lwMinPx, bodyDiameterPx)
        }
        const orbitLW = Math.min(baseLW, bodyThicknessCapPx)
        const aUnits = (el?.distance || 0) * AU_UNITS
        const ecc = e
        const scale = aUnits > 0 ? (aUnits / Math.max(1, camDist || 1)) : 0
        const SUB_MAX = 12
        const SUB = Math.min(SUB_MAX, Math.max(1, Math.floor(1 + scale * 6)))

        for (let sIdx = 0; sIdx < nSeg; sIdx++) {
          for (let sub = 0; sub < SUB; sub++) { 
            const u0 = headFloat - dir * (sIdx + sub / SUB)
            const u1 = headFloat - dir * (sIdx + (sub + 1) / SUB)

            const p0r = sampleCR_centripetal(pts, u0, nSeg)
            const p1r = sampleCR_centripetal(pts, u1, nSeg)

            const p0 = {
              x: (p0r.x + parentPosAU.x) * AU_UNITS,
              y: (p0r.y + parentPosAU.y) * AU_UNITS,
              z: (p0r.z + parentPosAU.z) * AU_UNITS,
            }
            const p1 = {
              x: (p1r.x + parentPosAU.x) * AU_UNITS,
              y: (p1r.y + parentPosAU.y) * AU_UNITS,
              z: (p1r.z + parentPosAU.z) * AU_UNITS,
            }

            const q0 = projectPoint(p0, basis, width, height, fov, NEAR, FAR)
            const q1 = projectPoint(p1, basis, width, height, fov, NEAR, FAR)
            if (!q0.visible && !q1.visible) continue
            if (!isFinite(q0.x) || !isFinite(q0.y) || !isFinite(q1.x) || !isFinite(q1.y)) continue

            const segLen3D = Math.hypot(p0.x - p1.x, p0.y - p1.y, p0.z - p1.z)
            const maxSeg3D = Math.max(500, aUnits * (0.15 + 0.35 * ecc))
            if (segLen3D > maxSeg3D) continue

            const dz = Math.abs(q0.depth - q1.depth)
            if (dz > Math.max(2e6, 2e3 * aUnits)) continue

            const t = sIdx / nSeg
            const tTrail = (sIdx * SUB + sub) / (nSeg * SUB)
            const alpha = 0.9 * (1 - tTrail) + 0.1

            ctx.globalAlpha = alpha
            ctx.strokeStyle = colorMode(b, el)
            const prevLW = ctx.lineWidth
            ctx.lineWidth = orbitLW

            ctx.beginPath()
            ctx.moveTo(q0.x, q0.y)
            ctx.lineTo(q1.x, q1.y)
            ctx.stroke()
            ctx.lineWidth = prevLW
          }
        }
      }
      ctx.globalAlpha = 1
    },
  }), [
    bodies,
    elements,
    indexByName,
    colorMode,
    showOrbits,
    showOrbitsStars,
    showOrbitsPlanets,
    showOrbitsDwarfs,
    showOrbitsAsteroids,
    showOrbitsMoons,
    shouldShowMoon,
    AU_UNITS,
    segments,
    relOrbitPts,
    radiusScale,
    minPixelRadius,
    dotThresholdPx,
    cullBelowPx,
    dotSizePx,
    lwMinPx,
  ])
  return null
})

export default SimDrawOrbits