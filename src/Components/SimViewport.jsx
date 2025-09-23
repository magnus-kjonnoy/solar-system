import React, { useEffect } from 'react'

export default function SimViewport({ canvasRef, viewportRef, onResize }) {
  useEffect(() => {
    const canvas = canvasRef?.current
    if (!canvas) return
    const ctx = canvas.getContext?.('2d')

    const apply = () => {
      const cssW = canvas.clientWidth  || 0
      const cssH = canvas.clientHeight || 0
      const dpr = Math.max(1, window.devicePixelRatio || 1)

      const nextW = Math.max(1, Math.round(cssW * dpr))
      const nextH = Math.max(1, Math.round(cssH * dpr))

      if (canvas.width  !== nextW) canvas.width  = nextW
      if (canvas.height !== nextH) canvas.height = nextH

      viewportRef.current = { dpr, cssW, cssH }
      if (ctx?.setTransform) ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      onResize?.(viewportRef.current)
    }

    const ro = new ResizeObserver(apply)
    ro.observe(canvas)

    const onWindowResize = () => apply()
    window.addEventListener('resize', onWindowResize)

    let mql
    let stopPolling
    const onMQ = () => apply()
    const bindMQ = () => {
      try { if (mql?.removeEventListener) mql.removeEventListener('change', onMQ) } catch {}
      mql = window.matchMedia(`(resolution: ${window.devicePixelRatio || 1}dppx)`)
      if (mql.addEventListener) {
        mql.addEventListener('change', onMQ)
      } else {
        let running = true
        const tick = () => {
          if (!running) return
          const cur = window.devicePixelRatio || 1
          if (cur !== (viewportRef.current?.dpr || 1)) apply()
          setTimeout(tick, 250)
        }
        tick()
        stopPolling = () => { running = false }
      }
    }
    bindMQ()

    let vv
    const onVV = () => apply()
    if (window.visualViewport) {
      vv = window.visualViewport
      vv.addEventListener('resize', onVV)
      vv.addEventListener('scroll', onVV)
    }

    apply()

    return () => {
      ro.disconnect()
      window.removeEventListener('resize', onWindowResize)
      try { if (mql?.removeEventListener) mql.removeEventListener('change', onMQ) } catch {}
      if (stopPolling) stopPolling()
      if (vv) {
        vv.removeEventListener('resize', onVV)
        vv.removeEventListener('scroll', onVV)
      }
    }
  }, [canvasRef, viewportRef, onResize])

  return null
}