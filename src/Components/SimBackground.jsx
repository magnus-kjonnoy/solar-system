import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react'

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

function drawImageTiled(ctx, img, ox, oy, scale = 1) {
  const { width, height } = ctx.canvas

  const w = (img.width  * scale) || 1
  const h = (img.height * scale) || 1

  const x0 = ((ox % w) + w) % w
  const y0 = ((oy % h) + h) % h

  for (let y = -y0; y < height; y += h) {
    for (let x = -x0; x < width; x += w) {
      ctx.drawImage(img, x, y, w, h)
    }
  }
}

const SimBackground = forwardRef(function SimBackground(
  { canvasRef, viewportRef, camRef, bgSrc, show = true },
  ref
) {
  const patternRef = useRef(null)
  const imgRef = useRef(null)

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const img = await loadImage(bgSrc)
        if (cancelled) return
        imgRef.current = img
        const ctx = canvasRef.current?.getContext('2d')
        if (ctx) patternRef.current = ctx.createPattern(img, 'repeat')
      } catch {}
    })()
    return () => { cancelled = true }
  }, [bgSrc, canvasRef])

  const getCameraBasis = () => {
    const { yaw, pitch, dist, target, roll } = camRef.current

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

    const right = { x: rx * cosR + ux * sinR, y: ry * cosR + uy * sinR, z: rz * cosR + uz * sinR }
    const up    = { x: ux * cosR - rx * sinR, y: uy * cosR - ry * sinR, z: uz * cosR - rz * sinR }

    return { right, up }
  }

  function draw() {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return

    const { cssW: width, cssH: height } = viewportRef.current || { cssW: ctx.canvas.width, cssH: ctx.canvas.height }

    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, width, height)

    if (!show) return
    const img = imgRef.current
    if (!img) return

    const { right, up } = getCameraBasis()

    const roll  = camRef.current.roll  || 0
    const yaw   = camRef.current.yaw   || 0
    const pitch = camRef.current.pitch || 0

    const yawK = 0.05
    const pitchK = 0.05
    const rotK = roll + yaw * yawK + pitch * pitchK

    const kMove = 0.05
    const tx = (camRef.current.target.x * right.x + camRef.current.target.y * right.y + camRef.current.target.z * right.z) * kMove
    const ty = (camRef.current.target.x * up.x    + camRef.current.target.y * up.y    + camRef.current.target.z * up.z)    * kMove

    const pattern = patternRef.current

    if (pattern && pattern.setTransform) {
      const m = new DOMMatrix()
        .translateSelf(width / 2, height / 2)
        .rotateSelf((rotK * 180) / Math.PI)
        .translateSelf(-width / 2, -height / 2)
        .translateSelf(tx, ty)
      pattern.setTransform(m)
      ctx.save()
      ctx.fillStyle = pattern
      ctx.globalAlpha = 1
      ctx.fillRect(0, 0, width, height)
      ctx.restore()
    } else {
      // Fallback
      ctx.save()
      ctx.translate(width / 2, height / 2)
      ctx.rotate(rotK)
      ctx.translate(-width / 2, -height / 2)
      ctx.globalAlpha = 1
      drawImageTiled(ctx, img, tx, ty, 1)
      ctx.restore()
    }
  }

  useImperativeHandle(ref, () => ({ draw }), [show])
  return null
})

export default SimBackground