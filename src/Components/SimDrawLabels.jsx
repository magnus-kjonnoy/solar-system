import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react'

const SimDrawLabels = forwardRef(function SimDrawLabels(
  {
    bodies,
    elements,
    nameToIndex,
    colorMode,
    onLock,
    showLabels = true,
    showLabelsStars = true,
    showLabelsPlanets = true,
    showLabelsDwarfplanets = true,
    showLabelsAsteroids = false,
    showLabelsMoons = true,
  },
  ref
) {
  const layerRef = useRef(null)
  const labelEls = useRef(new Map())

  useEffect(() => {
    const layer = layerRef.current
    if (!layer) return

    for (const [, el] of labelEls.current) el.remove()
    labelEls.current.clear()

    bodies.forEach((b) => {
      const el = document.createElement('div')
      el.className = 'sim-label'
      el.textContent = b.name
      el.style.cursor = 'pointer'
      el.style.position = 'absolute'
      el.style.display = 'none'
      el.addEventListener('click', () => onLock?.(b.name))
      layer.appendChild(el)
      labelEls.current.set(b.name, el)
    })

    return () => {
      for (const [, el] of labelEls.current) el.remove()
      labelEls.current.clear()
    }
  }, [bodies, onLock])

  useImperativeHandle(ref, () => ({
    draw({ drawList }) {
      for (const [, el] of labelEls.current) el.style.display = 'none'
      if (!showLabels || !drawList || drawList.length === 0) return

      for (const { body: b, proj } of drawList) {
        const el = labelEls.current.get(b.name)
        if (!el) continue

        if (b.type === 'star' && !showLabelsStars) continue
        if (b.type === 'planet' && !showLabelsPlanets) continue
        if (b.type === 'dwarf-planet' && !showLabelsDwarfplanets) continue
        if (b.type === 'asteroid' && !showLabelsAsteroids) continue
        if (b.type === 'moon' && !showLabelsMoons) continue

        const elOrb = elements[nameToIndex.get(b.name)]
        el.style.display = 'block'
        el.style.transform = `translate(${proj.x}px, ${proj.y}px)`
        el.style.color = colorMode(b, elOrb)
      }
    }
  }), [
    elements,
    nameToIndex,
    colorMode,
    showLabels,
    showLabelsStars,
    showLabelsPlanets,
    showLabelsDwarfplanets,
    showLabelsAsteroids,
    showLabelsMoons,
  ])

  return <div className='sim-label-layer' ref={layerRef}/>
})

export default SimDrawLabels