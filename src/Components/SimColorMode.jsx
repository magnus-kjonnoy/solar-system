import React, { forwardRef, useImperativeHandle } from 'react'

import { orbitDir } from './SimOrbit'

const colorsType = {
  'star':         '#ffffff',
  'planet':       '#eeeeee',
  'dwarf-planet': '#dddddd',
  'asteroid':     '#cccccc',
  'moon':         '#bbbbbb',

  'other':        '#ffffff',
}
const colorsOrbitType = {
  'regular':    '#b6b391',
  'irregular':  '#af7847',
  'rogue':      '#ffffff80',
}
const colorsOrbitDir = {
  'prograde':   '#2294ff',
  'retrograde': '#ff2222',
}
const colorsGroup = {
  // general
  'inner':      '#ffffffbf',
  'major':      '#a0a0ff', // '#a0a0ff' // '#ccccff'
  'ungrouped':  '#999999',
  // Jupiter
  'Galilean':   '#ccccff',
  'Themisto':   '#ffe0fc',
  'Himalia':    '#fdd5b1',
  'Carpo':      '#d5fbff',
  'Valetudo':   '#d0f0d0',
  'Ananke':     '#f0f0b0',
  'Pasiphae':   '#d3d3d3',
  'Carme':      '#f4c2c2',
  // Saturn
  'Inuit':      '#f4c2c2',
  'Gallic':     '#fdd5b1',
  'Norse':      '#9fdaff', // '#80ceff' // '#d3d3d3'
  // Uranus
  'Caliban':    '#f0f0b0',
  // Neptune
  'Sao':        '#f0f0b0',
  'Neso':       '#f4c2c2',
}
// other:       '#6ec8ff' '#ff6ec8'

const SimColorMode = forwardRef(function SimColorMode(
  {
    mode = 'default', // default, body, orbit-type, orbit-dir, group
    modeDefault = colorsType,
    modeOrbitType = colorsOrbitType,
    modeOrbitDir = colorsOrbitDir,
    modeGroup = colorsGroup,
  },
  ref
) {
  const colorMode = mode

  const typeColors = (t) => modeDefault?.[t] ?? modeDefault.other ?? '#ffffff'

  function getColor(body, element) {
    const t = body?.type

    // if (t !== 'moon') {
    //   return typeColors(t)
    // }

    if (mode === 'default') {
      return typeColors(t)
    }

    if (mode === 'body') {
      return body?.color ?? typeColors(t)
    }

    if (mode === 'orbit-type') {
      const cls = element?.orbit_type ?? body?.orbit_type ?? 'regular'
      return modeOrbitType?.[cls] ?? modeOrbitType?.[String(cls).toLowerCase()] ?? typeColors(t)
    }

    if (mode === 'orbit-dir') {
      const key = orbitDir(element) > 0 ? 'prograde' : 'retrograde'
      return modeOrbitDir?.[key] ?? modeOrbitDir?.[String(key).toLowerCase()] ?? typeColors(t)
    }

    if (mode === 'group') {
      const g = element?.group ?? body?.group
      if (!g) return typeColors(t)
      return modeGroup?.[g] ?? modeGroup?.[String(g).toLowerCase()] ?? typeColors(t)
    }

    return typeColors(t)
  }

  useImperativeHandle(ref, () => ({
    getColor,
    getTypeColor: typeColors,
    getMode: () => colorMode,
  }), [mode, modeDefault, modeOrbitType, modeOrbitDir, modeGroup])

  return null
})

export default SimColorMode
export {
  colorsType,
  colorsOrbitType,
  colorsOrbitDir,
  colorsGroup,
}