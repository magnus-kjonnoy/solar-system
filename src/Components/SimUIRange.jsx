import React, { useState, useEffect, useRef, useLayoutEffect } from 'react'

import { clamp } from './SimConstants'

export default function SimUIRange({
  label,
  value,
  onChange,
  min,
  max,
  step,
  prefix = '',
  suffix = '',
  unitSelect = null,
}) {
  const [text, setText] = useState(String(value))
  const [focus, setFocus] = useState(false)
  const inputRef = useRef(null)
  const measRef = useRef(null)

  useEffect(() => {
    if(!focus) setText(String(value))
  }, [focus, value])

  const commit = () => {
    const n = parseFloat(String(text).replace(',', '.'))
    if (!Number.isFinite(n)) { setText(String(value)); return }
    const clamped = clamp(n, min, max)
    setText(String(clamped))
    onChange(clamped)
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter') { commit(); e.currentTarget.blur() }
    if (e.key === 'Escape') { setText(String(value)); e.currentTarget.blur() }
  }

  useLayoutEffect(() => {
    if (!inputRef.current || !measRef.current) return
    const str = (text && text.length ? text : '0')
    measRef.current.textContent = str
    const w = measRef.current.offsetWidth
    inputRef.current.style.width = `${Math.ceil(w)}px`
  }, [text])

  return (
    <>
      {label && <label>{label}: {prefix ? <span>{prefix}</span> : null} <input
          type='text'
          inputMode='decimal'
          value={text}
          onFocus={() => setFocus(true)}
          onBlur={commit}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKeyDown}
          ref={inputRef}
          size={Math.max(1, (text?.length ?? 0) || String(value).length || 1)}
        />{unitSelect ? <span>{unitSelect}</span> : null}{suffix ? <span>{suffix}</span> : null}</label>}
      <span className='input-width-measure' aria-hidden='true' ref={measRef}/>
      <input
        type='range'
        min={min}
        max={max}
        step={step}
        value={value}
        onPointerDown={() => {
          if (document.activeElement === inputRef.current) {
            commit()
            inputRef.current.blur()
            setFocus(false)
          }
        }}
        onChange={(e) => {
          const next = parseFloat(e.target.value)
          onChange(next)
          if (document.activeElement !== inputRef.current) setText(String(next))
        }}
      />
    </>
  )
}