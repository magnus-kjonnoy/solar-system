import React, { useRef, forwardRef, useImperativeHandle } from 'react'

import { FAR, radiusUnitsOf } from './SimConstants'
import { projectPoint } from './SimCamera'

const SimDrawBodies = forwardRef(function SimDrawBodies(
  {
    bodies,
    radiusScale = 1,
    showStars = true,
    showPlanets = true,
    showDwarfs = true,
    showAsteroids = true,
    showMoons = true,
    shouldShowMoon,
    minPixelRadius = 0,
    dotThresholdPx = 0.6,
    cullBelowPx = 0,
    dotSizePx = 1,
  },
  ref
) {
  const lastDrawListRef = useRef([])

  useImperativeHandle(ref, () => ({
    draw({ ctx, basis, width, height, fov, NEAR, positions }) {
      const drawList = bodies.map((b, i) => {
        const S = positions[i]
        const proj = projectPoint(S, basis, width, height, fov, NEAR, FAR)
        const radUnits = radiusUnitsOf(b, radiusScale)
        return { body: b, proj, radUnits, idx: i }
      })
      .filter((d) => {
        const farCap = Number.isFinite(FAR) ? FAR : 1e12
        if (!d.proj.visible || d.proj.depth <= 0 || d.proj.depth >= farCap) return false

        const t = d.body.type
        if (t === 'star' && !showStars) return false
        if (t === 'planet' && !showPlanets) return false
        if (t === 'dwarf-planet' && !showDwarfs) return false
        if (t === 'asteroid' && !showAsteroids) return false
        if (t === 'moon') {
          if (!showMoons) return false
          if (typeof shouldShowMoon === 'function') return shouldShowMoon(d.idx)
        }
      return true
      })
      .sort((a, b) => b.proj.depth - a.proj.depth)

      const f = 1 / Math.tan((fov * Math.PI) / 360)
      for (const d of drawList) {
        const screenRad = (d.radUnits * f / d.proj.zProj) * (height / 2)
        if (screenRad < cullBelowPx) continue
        if (screenRad < dotThresholdPx) {
          const x = Math.round(d.proj.x)
          const y = Math.round(d.proj.y)
          ctx.fillStyle = d.body.color
          ctx.fillRect(x, y, dotSizePx, dotSizePx)
          continue
        }
        const rPix = Math.max(screenRad, minPixelRadius)
        ctx.beginPath()
        ctx.arc(d.proj.x, d.proj.y, rPix, 0, Math.PI * 2)
        ctx.fillStyle = d.body.color
        ctx.fill()
      }

      lastDrawListRef.current = drawList
    },

    getDrawList() {
      return lastDrawListRef.current
    }
  }), [
    bodies,
    radiusScale,
    showStars,
    showPlanets,
    showDwarfs,
    showAsteroids,
    showMoons,
    shouldShowMoon,
    minPixelRadius,
    dotThresholdPx,
    dotSizePx,
    cullBelowPx,
  ])

  return null
})

export default SimDrawBodies