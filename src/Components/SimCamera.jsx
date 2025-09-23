import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import { DEG, clamp, normPi } from './SimConstants'

function vLen(v) { return Math.hypot(v.x, v.y, v.z) || 1 }
function vNorm(v) {const L = vLen(v); return { x: v.x / L, y: v.y / L, z: v.z / L } }
function vDot(a, b) { return a.x * b.x + a.y * b.y + a.z * b.z }
function vCross(a, b) { return { x: a.y * b.z - a.z * b.y, y: a.z * b.x - a.x * b.z, z: a.x * b.y - a.y * b.x } }
function vRotateAxis(v, axis, ang) {
  const a = vNorm(axis)
  const c = Math.cos(ang)
  const s = Math.sin(ang)
  const dot = vDot(a, v)
  return {
    x: v.x * c + (a.y * v.z - a.z * v.y) * s + a.x * dot * (1 - c),
    y: v.y * c + (a.z * v.x - a.x * v.z) * s + a.y * dot * (1 - c),
    z: v.z * c + (a.x * v.y - a.y * v.x) * s + a.z * dot * (1 - c),
  }
}

// Quaternion helpers
function qFromAxisAngle(ax, ang) {
  const h = ang * 0.5
  const s = Math.sin(h)
  const c = Math.cos(h)
  return { x: ax.x * s, y: ax.y * s, z: ax.z * s, w: c }
}
function qMul(a, b) {
  return {
    w: a.w * b.w - a.x * b.x - a.y * b.y - a.z * b.z,
    x: a.w * b.x + a.x * b.w + a.y * b.z - a.z * b.y,
    y: a.w * b.y - a.x * b.z + a.y * b.w + a.z * b.x,
    z: a.w * b.z + a.x * b.y - a.y * b.x + a.z * b.w,
  }
}
function qRotate(q, v) {
  const x = q.x
  const y = q.y
  const z = q.z
  const w = q.w

  const vx = v.x
  const vy = v.y
  const vz = v.z

  const tx = 2 * (y * vz - z * vy)
  const ty = 2 * (z * vx - x * vz)
  const tz = 2 * (x * vy - y * vx)

  return {
    x: vx + w * tx + (y * tz - z * ty),
    y: vy + w * ty + (z * tx - x * tz),
    z: vz + w * tz + (x * ty - y * tx),
  }
}
function qFromBasis(right, up, forward) {
  const m00 =    right.x
  const m01 =       up.x
  const m02 = -forward.x
  const m10 =    right.y
  const m11 =       up.y
  const m12 = -forward.y
  const m20 =    right.z
  const m21 =       up.z
  const m22 = -forward.z
  const tr = m00 + m11 + m22

  let x, y, z, w
  if (tr > 0) {
    const S = Math.sqrt(tr + 1) * 2
    w = 0.25 * S
    x = (m21 - m12) / S
    y = (m02 - m20) / S
    z = (m10 - m01) / S
  } else if ((m00 > m11) && (m00 > m22)) {
    const S = Math.sqrt(1 + m00 - m11 - m22) * 2
    w = (m21 - m12) / S
    x = 0.25 * S
    y = (m01 + m10) / S
    z = (m02 + m20) / S
  } else if (m11 > m22) {
    const S = Math.sqrt(1 + m11 - m00 - m22) * 2
    w = (m02 - m20) / S
    x = (m01 + m10) / S
    y = 0.25 * S
    z = (m12 + m21) / S
  } else {
    const S = Math.sqrt(1 + m22 - m00 - m11) * 2
    w = (m10 - m01) / S
    x = (m02 + m20) / S
    y = (m12 + m21) / S
    z = 0.25 * S
  }
  const L = Math.hypot(x, y, z, w) || 1
  return { x: x / L, y: y / L, z: z / L, w: w / L }
}
function qNormalize(q) {
  const L = Math.hypot(q.x, q.y, q.z, q.w) || 1
  return { x: q.x / L, y: q.y / L, z: q.z / L, w: q.w / L }
}
function qFromYPR(yaw = 0, pitch = 0, roll = 0) {
  const qYaw = qFromAxisAngle({ x: 0, y: 1, z: 0 }, yaw)
  const rightAfterYaw = qRotate(qYaw, { x: 1, y: 0, z: 0 })
  const qPitch = qFromAxisAngle(rightAfterYaw, pitch)
  const qYP = qMul(qPitch, qYaw)
  const fAfterYP = qRotate(qYP, { x: 0, y: 0, z: -1 })
  const qRoll  = qFromAxisAngle(fAfterYP, roll)
  return qNormalize(qMul(qRoll, qYP))
}
function qNlerp(a, b, t) {
  const inv = (a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w) < 0 ? -1 : 1
  const q = {
    x: a.x * (1 - t) + b.x * inv * t,
    y: a.y * (1 - t) + b.y * inv * t,
    z: a.z * (1 - t) + b.z * inv * t,
    w: a.w * (1 - t) + b.w * inv * t,
  }
  return qNormalize(q)
}

export function getCameraBasis(cam) {
  const { yaw, pitch, roll, dist, target } = cam
  let q = cam.orient
  if (!q) { q = qFromYPR(cam.yaw || 0, cam.pitch || 0, cam.roll || 0) }

  const right   = qRotate(q, { x: 1, y: 0, z:  0 })
  const up      = qRotate(q, { x: 0, y: 1, z:  0 })
  const forward = qRotate(q, { x: 0, y: 0, z: -1 })

  const eye = {
    x: target.x - forward.x * dist,
    y: target.y - forward.y * dist,
    z: target.z - forward.z * dist,
  }

  return { eye, right, up, forward }
}

export function projectPoint(p, basis, width, height, fov, NEAR_D, FAR) {
  const { eye, right, up, forward } = basis
  const px = p.x - eye.x
  const py = p.y - eye.y
  const pz = p.z - eye.z

  const cx = px * right.x + py * right.y + pz * right.z
  const cy = px * up.x + py * up.y + pz * up.z
  const cz = px * forward.x + py * forward.y + pz * forward.z

  if (cz <= 1e-6) return {visible: false, depth: Infinity }

  const zProj = Math.max(cz, NEAR_D)

  const aspect = width / height
  const f = 1 / Math.tan((fov * Math.PI) / 360)
  const sx = (cx * f / aspect) / zProj
  const sy = (cy * f) / zProj
  const x = width / 2 + (width / 2) * sx
  const y = height / 2 - (height / 2) * sy
  const visible = x >= -50 && x <= width + 50 && y >= -50 && y <= height + 50

  return { x, y, visible, depth: cz, zProj }
}

export function zoomAlong(cur, tgt, amount, basis, locked) {
  if (locked) {
    tgt.dist = clamp(tgt.dist + amount, 1e-4, 4000)
  } else {
    tgt.target.x += amount * basis.forward.x
    tgt.target.y += amount * basis.forward.y
    tgt.target.z += amount * basis.forward.z
  }
}

export function smoothTowards(cur, tgt, dt, k = 8) {
  const s = 1 - Math.exp(-dt * k)
  cur.dist     += (tgt.dist     - cur.dist)     * s
  cur.target.x += (tgt.target.x - cur.target.x) * s
  cur.target.y += (tgt.target.y - cur.target.y) * s
  cur.target.z += (tgt.target.z - cur.target.z) * s
  cur.dist = Math.max(1e-6, cur.dist)

  const cq = cur.orient || qFromYPR(cur.yaw || 0, cur.pitch || 0, cur.roll || 0)
  const tq = tgt.orient || qFromYPR(tgt.yaw || 0, tgt.pitch || 0, tgt.roll || 0)

  cur.orient = qNlerp(cq, tq, s)
  cur.yaw = normPi(cur.yaw || 0)
  cur.pitch = cur.pitch || 0
  cur.roll = normPi(cur.roll || 0)
}

const SimCamera = forwardRef(function SimCamera(
  {
    camRef,
    camTargetRef,
    canvasRef,
    keysRef,
    lockRef,
    lockDirToParent = false,
    moveScale = 1,
    zoomScale = 1,
    zoomSens = 0.01,
    init = { yaw: 0, pitch: 0, roll: 0, dist: 100, target: { x: 0, y: 0, z: 500 } },
  }, ref) {
  const lockDirToParentRef = useRef(lockDirToParent)
  useEffect(() => { lockDirToParentRef.current = lockDirToParent }, [lockDirToParent])
  const drag = useRef({ active: false, x: 0, y: 0, yaw0: 0, pitch0: 0, move: false, })
  const aimOffset = useRef({ yaw: 0, pitch: 0 })
  const lockRollRef = useRef(0)
  const lockBaseRef = useRef({
    r: { x: 1, y: 0, z: 0 },
    u: { x: 0, y: 1, z: 0 },
    f: { x: 0, y: 0, z: -1 },
  })
  const yawLimit   = 15 * DEG
  const pitchLimit = 15 * DEG

  const prevLock = useRef({ on: false, name: ' ' })

  useEffect(() => {
    const canvas = canvasRef?.current
    if (!canvas) return

    const onWheel = (e) => {
      e.preventDefault()
      const basis = getCameraBasis(camRef.current)
      const locked = lockRef.current !== ' '

      const unit =
        e.deltaMode === 1 ? 16 :
        e.deltaMode === 2 ? window.innerHeight :
        1
      const delta = e.deltaY * unit

      const s = zoomSens * (e.shiftKey ? 0.25 : 1) * (zoomScale ?? 1)
      const factor = Math.exp(delta * s)
      
      if (locked) {
        camTargetRef.current.dist = clamp(camTargetRef.current.dist * factor, 1e-4, 4000)
      } else {
        const amount = (factor - 1) * camRef.current.dist
        camTargetRef.current.target.x -= amount * basis.forward.x
        camTargetRef.current.target.y -= amount * basis.forward.y
        camTargetRef.current.target.z -= amount * basis.forward.z
      }
    }
    const onDown = (e) => {
      e.preventDefault()
      drag.current.active = true
      drag.current.x = e.clientX
      drag.current.y = e.clientY
      drag.current.yaw0 = camTargetRef.current.yaw
      drag.current.pitch0 = camTargetRef.current.pitch
      drag.current.move = e.shiftKey || e.button === 1 || e.button === 2
    }
    const onMove = (e) => {
      if (!drag.current.active) return
      const dx = e.clientX - drag.current.x
      const dy = e.clientY - drag.current.y
      const locked = lockRef.current !== ' '
      if (drag.current.move) {
        if (locked) return
        const { right, up } = getCameraBasis(camRef.current)
        const moveSpeed = camRef.current.dist * 0.00005 * moveScale
        const sx = -dx * moveSpeed
        const sy = +dy * moveSpeed
        camTargetRef.current.target.x += sx * right.x + sy * up.x
        camTargetRef.current.target.y += sx * right.y + sy * up.y
        camTargetRef.current.target.z += sx * right.z + sy * up.z
      } else {
        const yawDelta = -dx * 0.005
        const pitchDelta = -dy * 0.003

        if (lockDirToParentRef.current && lockRef.current !== ' ') {
          aimOffset.current.yaw   = clamp(aimOffset.current.yaw   + yawDelta,   -yawLimit,   yawLimit)
          aimOffset.current.pitch = clamp(aimOffset.current.pitch + pitchDelta, -pitchLimit, pitchLimit)
        } else {
          const { right, up } = getCameraBasis(camRef.current)
          const qYaw   = qFromAxisAngle(up, yawDelta)
          const qPitch = qFromAxisAngle(right, pitchDelta)
          const qDelta = qMul(qYaw, qPitch)
          const curQ = camRef.current.orient || qFromYPR(camRef.current.yaw || 0, camRef.current.pitch || 0, camRef.current.roll || 0)
          camTargetRef.current.orient = qNormalize(qMul(qDelta, curQ))
        }
      }
      drag.current.x = e.clientX
      drag.current.y = e.clientY
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
      canvas.removeEventListener('wheel', onWheel)
      canvas.removeEventListener('mousedown', onDown)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      canvas.removeEventListener('contextmenu', onContext)
    }
  }, [canvasRef, camRef, camTargetRef, lockRef, moveScale, zoomScale])

  useImperativeHandle(ref, () => ({
    update({
      dt,
      moveScale = 1,
      zoomScale = 1,
      lockDirToParent = false,
      worldPosOf,
      parentPosOf,
    }) {
      const basis = getCameraBasis(camRef.current)
      const { right, up, forward } = basis
      const keys = keysRef?.current || new Set()
      const rotRate = 0.8
      const rollRate = 1.2
      const pitchRate = 0.5
      const curQ = camRef.current.orient || qFromYPR(camRef.current.yaw || 0, camRef.current.pitch || 0, camRef.current.roll || 0)
      let tgtQ = camTargetRef.current.orient || (curQ)
      const moveRate = camRef.current.dist * moveScale * dt
      const zoomStep = camRef.current.dist * zoomScale * dt
      const fine = (keys.has('ShiftLeft') || keys.has('ShiftRight')) ? 0.25 : 1
      const step = zoomStep * fine
      const locked = lockRef.current !== ' '

      if (lockDirToParent && locked && worldPosOf && parentPosOf) {
        const changed = !prevLock.current.on || prevLock.current.name !== lockRef.current
        if (changed) {
          const name = lockRef.current
          const t = worldPosOf(name)
          const p = parentPosOf(name)
          if (t && p) {
            const fBase = vNorm({ x: p.x - t.x, y: p.y - t.y, z: p.z - t.z })
            const upHint = (Math.abs(fBase.y) > 0.97) ? { x: 1, y: 0, z: 0 } : { x: 0, y: 1, z: 0 }
            let rBase = vNorm(vCross(upHint, fBase))
            let uBase = vCross(rBase, fBase)

            if (vDot(uBase, lockBaseRef.current.u) < 0) {
              uBase = { x: -uBase.x, y: -uBase.y, z: -uBase.z }
              rBase = { x: -rBase.x, y: -rBase.y, z: -rBase.z }
            }
            
            const fYaw = vRotateAxis(fBase, uBase, aimOffset.current.yaw)
            const rYaw = vNorm(vCross(uBase, fYaw))
            const uYaw = vCross(rYaw, fYaw)

            const fAim = vRotateAxis(fYaw, rYaw, aimOffset.current.pitch)
            const rAim = vNorm(vCross(uYaw, fAim))
            const uAim = vCross(rAim, fAim)

            lockBaseRef.current = { r: rAim, u: uAim, f: fAim }
            aimOffset.current = { yaw: 0, pitch: 0 }

            const curQ = camRef.current.orient || qFromYPR(camRef.current.yaw || 0, camRef.current.pitch || 0, camRef.current.roll || 0)
            const upCur = qRotate(curQ, { x: 0, y: 1, z: 0 })
            const a = vNorm(uBase)
            const b = vNorm(upCur)
            const crossAB = vCross(a, b)
            const dotAB = vDot(a, b)
            const sign = vDot(crossAB, fAim) >= 0 ? 1 : -1
            lockRollRef.current = Math.atan2(sign * vLen(crossAB), dotAB)

            const qNoRoll = qFromBasis(rAim, uAim, fAim)
            const qRoll = qFromAxisAngle(fAim, lockRollRef.current)

            camTargetRef.current.orient = qNormalize(qMul(qRoll, qNoRoll))
          }
        }
      }
      prevLock.current.on = lockDirToParent && locked
      prevLock.current.name = lockRef.current

      // Zoom
      if (keys.has('KeyR')) zoomAlong(camRef.current, camTargetRef.current, locked ? -step : +step, basis, locked)
      if (keys.has('KeyF')) zoomAlong(camRef.current, camTargetRef.current, locked ? +step : -step, basis, locked)
      // Rotate
      if (lockDirToParent && locked && worldPosOf && parentPosOf) {
        if (keys.has('KeyS')) aimOffset.current.yaw = clamp(aimOffset.current.yaw - rotRate * dt, -yawLimit, yawLimit)
        if (keys.has('KeyW')) aimOffset.current.yaw = clamp(aimOffset.current.yaw + rotRate * dt, -yawLimit, yawLimit)
        if (keys.has('KeyA')) aimOffset.current.pitch = clamp(aimOffset.current.pitch + pitchRate * dt, -pitchLimit, pitchLimit)
        if (keys.has('KeyD')) aimOffset.current.pitch = clamp(aimOffset.current.pitch - pitchRate * dt, -pitchLimit, pitchLimit)

        if (keys.has('KeyQ')) lockRollRef.current -= rollRate * dt
        if (keys.has('KeyE')) lockRollRef.current += rollRate * dt

        const name = lockRef.current
        const t = worldPosOf(name)
        const p = parentPosOf(name)
        if (t && p) {
          const fBase = vNorm({ x: p.x - t.x, y: p.y - t.y, z: p.z - t.z })
          const upHint = (Math.abs(fBase.y) > 0.97) ? { x: 1, y: 0, z: 0 } : { x: 0, y: 1, z: 0 }
          let rBase = vNorm(vCross(upHint, fBase))
          let uBase = vCross(rBase, fBase)

          if (vDot(uBase, lockBaseRef.current.u) < 0) {
            uBase = { x: -uBase.x, y: -uBase.y, z: -uBase.z }
            rBase = { x: -rBase.x, y: -rBase.y, z: -rBase.z }
          }
            
          const fYaw = vRotateAxis(fBase, uBase, aimOffset.current.yaw)
          const rYaw = vNorm(vCross(uBase, fYaw))
          const uYaw = vCross(rYaw, fYaw)

          const fAim = vRotateAxis(fYaw, rYaw, aimOffset.current.pitch)
          const rAim = vNorm(vCross(uYaw, fAim))
          const uAim = vCross(rAim, fAim)

          lockBaseRef.current = { r: rAim, u: uAim, f: fAim }

          const qNoRoll = qFromBasis(rAim, uAim, fAim)
          const qRoll = qFromAxisAngle(fAim, lockRollRef.current)

          camTargetRef.current.orient = qNormalize(qMul(qRoll, qNoRoll))
          const fCam = qRotate(camTargetRef.current.orient, { x: 0, y: 0, z: -1 })
          const dot = clamp(vDot(fCam, fAim), -1, 1)
        }
      } else {
        if (keys.has('KeyA')) tgtQ = qMul(qFromAxisAngle(up, -rotRate * dt), tgtQ)
        if (keys.has('KeyD')) tgtQ = qMul(qFromAxisAngle(up, +rotRate * dt), tgtQ)
        if (keys.has('KeyS')) tgtQ = qMul(qFromAxisAngle(right, +pitchRate * dt), tgtQ)
        if (keys.has('KeyW')) tgtQ = qMul(qFromAxisAngle(right, -pitchRate * dt), tgtQ)

        if (keys.has('KeyQ')) tgtQ = qMul(qFromAxisAngle(forward, -rollRate * dt), tgtQ)
        if (keys.has('KeyE')) tgtQ = qMul(qFromAxisAngle(forward, +rollRate * dt), tgtQ)

        camTargetRef.current.orient = qNormalize(tgtQ)
      }
      // Move
      if (!locked) {
        if (keys.has('ArrowRight')) {
          camTargetRef.current.target.x += moveRate * right.x
          camTargetRef.current.target.y += moveRate * right.y
          camTargetRef.current.target.z += moveRate * right.z
        }
        if (keys.has('ArrowLeft')) {
          camTargetRef.current.target.x -= moveRate * right.x
          camTargetRef.current.target.y -= moveRate * right.y
          camTargetRef.current.target.z -= moveRate * right.z
        }
        if (keys.has('ArrowUp')) {
          camTargetRef.current.target.x += moveRate * up.x
          camTargetRef.current.target.y += moveRate * up.y
          camTargetRef.current.target.z += moveRate * up.z
        }
        if (keys.has('ArrowDown')) {
          camTargetRef.current.target.x -= moveRate * up.x
          camTargetRef.current.target.y -= moveRate * up.y
          camTargetRef.current.target.z -= moveRate * up.z
        }
      }

      // Follow target locked body
      if (locked && worldPosOf) {
        const p = worldPosOf(lockRef.current)
        if (p) {
          camTargetRef.current.target.x = p.x
          camTargetRef.current.target.y = p.y
          camTargetRef.current.target.z = p.z
        }
      }

      // Normalize
      camRef.current.yaw = normPi(camRef.current.yaw)
      camTargetRef.current.yaw = normPi(camTargetRef.current.yaw)
      camRef.current.roll = normPi(camRef.current.roll)
      camTargetRef.current.roll = normPi(camTargetRef.current.roll)

      // Smooth
      smoothTowards(camRef.current, camTargetRef.current, dt, 8)
    },

    // Reset camera
    reset() {
      camTargetRef.current.orient = qFromYPR(init.yaw || 0, init.pitch || 0, init.roll || 0)
      camTargetRef.current.yaw = init.yaw ?? 0
      camTargetRef.current.pitch = init.pitch ?? 0
      camTargetRef.current.roll = init.roll ?? 0
      camTargetRef.current.dist = init.dist ?? 0
      camTargetRef.current.target.x = init.target?.x ?? 0
      camTargetRef.current.target.y = init.target?.y ?? 0
      camTargetRef.current.target.z = init.target?.z ?? 0
    },

    getBasis() { return getCameraBasis(camRef.current) },
  }), [camRef, camTargetRef, keysRef, lockRef, moveScale, zoomScale, init])
  return null
})

export default SimCamera