import { useEffect } from 'react'

function isTypingTarget(el) {
  if (!el) return false
  if (el.isContentEditable) return true
  const tag = el.tagName
  if (tag === 'TEXTAREA') return true
  if (tag !== 'INPUT') return false
  const t = (el.type || '').toLowerCase()
  return ['text', 'search', 'email', 'email', 'url', 'password', 'number', 'tel', 'date', 'time', 'datetime-local', 'month', 'week'].includes(t)
}

export default function SimControls({ keysRef }) {
  useEffect(() => {
    const kd = (e) => { if (!isTypingTarget(e.target)) keysRef.current.add(e.code) }
    const ku = (e) => { if (!isTypingTarget(e.target)) keysRef.current.delete(e.code) }
    window.addEventListener('keydown', kd)
    window.addEventListener('keyup', ku)
    return () => {
      window.removeEventListener('keydown', kd)
      window.removeEventListener('keyup', ku)
    }
  }, [keysRef])

  return null
}