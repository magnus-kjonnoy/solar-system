import { useState } from 'react'

import icon_ArrowDown from '/icon/iconamoon--white-arrow-down.png'

export default function SimDropdown({ title, children }) {
  const [dropdown, setDropdown] = useState(false)

  return (
    <div className='sim-dropdown'>
      <div className='sim-dropdown-header'>
        <h3>{title}</h3>
        <button onClick={() => setDropdown(!dropdown)}>
          <img src={icon_ArrowDown}/>
        </button>
      </div>
      {dropdown && (
        <div className='sim-dropdown-content'>
          {children}
        </div>
      )}
    </div>
  )
}