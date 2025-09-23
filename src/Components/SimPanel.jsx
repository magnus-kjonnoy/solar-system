import React from 'react'

import SimDropdown from './SimDropdown'
import SimUIRange from './SimUIRange'

export default function SimPanel({ state }) {
  const {
    startResize,

    showBackground, setShowBackground,
    pause, setPause,
    timeUnit, setTimeUnit,
    timeScale, setTimeScale,
    radiusScale, setRadiusScale,
    moveScale, setMoveScale,
    zoomScale, setZoomScale,
    fov, setFov,

    showStars, setShowStars,
    showPlanets, setShowPlanets,
    showDwarfs, setShowDwarfs,
    showMoons, setShowMoons,
    showRegular, setShowRegular,
    showIrregular, setShowIrregular,
    showSatellitesOnlyOfLocked, setShowSatellitesOnlyOfLocked,
    showAsteroids, setShowAsteroids,

    showLabels, setShowLabels,
    showLabelsStars, setShowLabelsStars,
    showLabelsPlanets, setShowLabelsPlanets,
    showLabelsDwarfplanets, setShowLabelsDwarfplanets,
    showLabelsMoons, setShowLabelsMoons,
    showLabelsAsteroids, setShowLabelsAsteroids,

    showOrbits, setShowOrbits,
    showOrbitsStars, setShowOrbitsStars,
    showOrbitsPlanets, setShowOrbitsPlanets,
    showOrbitsDwarfplanets, setShowOrbitsDwarfplanets,
    showOrbitsMoons, setShowOrbitsMoons,
    showOrbitsAsteroids, setShowOrbitsAsteroids,

    colorMode, setColorMode,

    lockableTargets,
    lockTarget, setLockTarget,
    lockDirToParent, setLockDirToParent,

    resetCam,
  } = state

  const handleTimeUnitChange = (nextUnit) => {
    setTimeScale((prev) => {
      let next = prev
      if (nextUnit === 'hours' && timeUnit === 'days') next = Math.round(prev * 24)
      if (nextUnit === 'days' && timeUnit === 'hours') next = Math.round(prev / 24)
      const max = nextUnit === 'days' ? 365.25 : 24
      return Math.min(max, Math.max(1, next))
    })
    setTimeUnit(nextUnit)
  }

  return (
    <aside className='sim-panel'>
      <div className='sim-resizer' onMouseDown={startResize}/>
      <h2>Settings</h2>
      <div className='sim-row'>
        <label>
          <input type='checkbox' checked={showBackground} onChange={(e) => setShowBackground(e.target.checked)}/> Background
        </label>
      </div>
      <div className='sim-row'>
        <label>
          <input type='checkbox' checked={pause} onChange={(e) => setPause(e.target.checked)}/> Pause
        </label>
      </div>
      <div className='sim-row'>
        <SimUIRange
          label='Time scale'
          prefix='×'
          min={timeUnit === 'days' ? 1 : 1}
          max={timeUnit === 'days' ? 365 : 24}
          step={1}
          value={timeScale}
          onChange={setTimeScale}
          unitSelect={
            <select
              className='sim-select-small'
              value={timeUnit}
              onChange={(e) => handleTimeUnitChange(e.target.value)}
            >
              <option value='hours'>h/s</option>
              <option value='days'>d/s</option>
            </select>
          }
        />
      </div>
      <div className='sim-row'>
        <SimUIRange
          label='Radius scale'
          prefix='×'
          min={1}
          max={1000}
          step={1}
          value={radiusScale}
          onChange={setRadiusScale}
        />
      </div>
      <div className='sim-row'>
        <SimUIRange
          label='Move scale'
          prefix='×'
          min={0.01}
          max={100}
          step={0.01}
          value={moveScale}
          onChange={setMoveScale}
        />
      </div>
      <div className='sim-row'>
        <SimUIRange
          label='Zoom scale'
          prefix='×'
          min={0.1}
          max={10}
          step={0.1}
          value={zoomScale}
          onChange={setZoomScale}
        />
      </div>
      <div className='sim-row'>
        <SimUIRange
          label='FOV'
          suffix='°'
          min={30}
          max={100}
          step={1}
          value={fov.toFixed(0)}
          onChange={setFov}
        />
      </div>
      <div className='sim-row'>
        <SimDropdown title='Labels'>
          <div className='sim-dropdown-item'>
            <label>
              <input type='checkbox' checked={showLabels} onChange={(e) => setShowLabels(e.target.checked)}/> Enabled
            </label>
          </div>
          <div className='sim-dropdown-item'>
            <label>
              <input type='checkbox' checked={showLabelsStars} onChange={(e) => setShowLabelsStars(e.target.checked)}/> Stars
            </label>
          </div>
          <div className='sim-dropdown-item'>
            <label>
              <input type='checkbox' checked={showLabelsPlanets} onChange={(e) => setShowLabelsPlanets(e.target.checked)}/> Planets
            </label>
          </div>
          <div className='sim-dropdown-item'>
            <label>
              <input type='checkbox' checked={showLabelsDwarfplanets} onChange={(e) => setShowLabelsDwarfplanets(e.target.checked)}/> Dwarf-planets
            </label>
          </div>
          <div className='sim-dropdown-item'>
            <label>
              <input type='checkbox' checked={showLabelsMoons} onChange={(e) => setShowLabelsMoons(e.target.checked)}/> Moons
            </label>
          </div>
          <div className='sim-dropdown-item'>
            <label>
              <input type='checkbox' checked={showLabelsAsteroids} onChange={(e) => setShowLabelsAsteroids(e.target.checked)}/> Asteroids
            </label>
          </div>
        </SimDropdown>
      </div>
      <div className='sim-row'>
        <SimDropdown title='Orbits'>
          <div className='sim-dropdown-item'>
            <label>
              <input type='checkbox' checked={showOrbits} onChange={(e) => setShowOrbits(e.target.checked)}/> Enabled
            </label>
          </div>
          <div className='sim-dropdown-item'>
            <label>
              <input type='checkbox' checked={showOrbitsStars} onChange={(e) => setShowOrbitsStars(e.target.checked)}/> Stars
            </label>
          </div>
          <div className='sim-dropdown-item'>
            <label>
              <input type='checkbox' checked={showOrbitsPlanets} onChange={(e) => setShowOrbitsPlanets(e.target.checked)}/> Planets
            </label>
          </div>
          <div className='sim-dropdown-item'>
            <label>
              <input type='checkbox' checked={showOrbitsDwarfplanets} onChange={(e) => setShowOrbitsDwarfplanets(e.target.checked)}/> Dwarf-planets
            </label>
          </div>
          <div className='sim-dropdown-item'>
            <label>
              <input type='checkbox' checked={showOrbitsMoons} onChange={(e) => setShowOrbitsMoons(e.target.checked)}/> Moons
            </label>
          </div>
          <div className='sim-dropdown-item'>
            <label>
              <input type='checkbox' checked={showOrbitsAsteroids} onChange={(e) => setShowOrbitsAsteroids(e.target.checked)}/> Asteroids
            </label>
          </div>
        </SimDropdown>
      </div>
      <div className='sim-row'>
        <SimDropdown title='Bodies'>
          <div className='sim-dropdown-item'>
            <label>
               <input type='checkbox' checked={showStars} onChange={(e) => setShowStars(e.target.checked)}/> Show stars
            </label>
          </div>
          <div className='sim-dropdown-item'>
            <label>
              <input type='checkbox' checked={showPlanets} onChange={(e) => setShowPlanets(e.target.checked)}/> Show planets
            </label>
          </div>
          <div className='sim-dropdown-item'>
            <label>
              <input type='checkbox' checked={showDwarfs} onChange={(e) => setShowDwarfs(e.target.checked)}/> Show dwarf-planets
            </label>
          </div>
          <div className='sim-dropdown-item'>
            <label>
              <input type='checkbox' checked={showMoons} onChange={(e) => setShowMoons(e.target.checked)}/> Show moons
            </label>
          </div>
          <div className='sim-dropdown-item'>
            <label>
              <input type='checkbox' checked={showRegular} onChange={(e) => setShowRegular(e.target.checked)}/> Show regular satellites
            </label>
          </div>
          <div className='sim-dropdown-item'>
            <label>
              <input type='checkbox' checked={showIrregular} onChange={(e) => setShowIrregular(e.target.checked)}/> Show irregular satellites
            </label>
          </div>
          <div className='sim-dropdown-item'>
            <label>
              <input type='checkbox' checked={showSatellitesOnlyOfLocked} onChange={(e) => setShowSatellitesOnlyOfLocked(e.target.checked)}/> Show satellites only for camera locked object
            </label>
          </div>
          <div className='sim-dropdown-item'>
            <label>
              <input type='checkbox' checked={showAsteroids} onChange={(e) => setShowAsteroids(e.target.checked)}/> Show asteroids
            </label>
          </div>
          {/* <div className='sim-dropdown-item'>
            <label>
              <input type='checkbox' checked={showAsteroidBelt} onChange={(e) => setShowAsteroidBelt(e.target.checked)}/> Show asteroid belt
            </label>
          </div> */}
          {/* <div className='sim-dropdown-item'>
            <label>
              <input type='checkbox' checked={showKuiperBelt} onChange={(e) => setShowKuiperBelt(e.target.checked)}/> Show Kuiper belt
            </label>
          </div> */}
        </SimDropdown>
      </div>
      <div className='sim-row'>
        <label>Color mode:</label>
        <select className='sim-select' value={colorMode} onChange={(e) => setColorMode(e.target.value)}>
          <option value='default'>Default</option>
          <option value='body'>Body</option>
          <option value='orbit-type'>Regular / Irregular</option>
          <option value='orbit-dir'>Prograde / Retrograde</option>
          <option value='group'>Group</option>
        </select>
      </div>
      <div className='sim-row'>
        <label>Lock camera to:</label>
        <select className='sim-select' value={lockTarget} onChange={(e) => setLockTarget(e.target.value)}>
          {lockableTargets.map((name) => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
        {lockTarget !== ' ' && <small className='sim-note'>Moving is disabled while locked. Rotate/zoom still works.</small>}
        <div className='sim-row'>
          <label>
            <input type='checkbox' checked={lockDirToParent} onChange={(e) => setLockDirToParent(e.target.checked)}/> Lock camera to direction of locked target's parent
          </label>
        </div>
      </div>
      <div className='sim-row'>
        <button className='sim-btn' onClick={resetCam}>Reset camera</button>
      </div>
      <div className='sim-help'>
        <p><b>Controls</b></p>
        <ul>
          <li><b>Move</b>: ←↑↓→, Shift + drag</li>
          <li><b>Rotate</b>: W/A/S/D/Q/E</li>
          <li><b>Zoom</b>: Wheel, R/F, Shift + Wheel, Shift + R/F</li>
          <li><b>Orbit camera</b>: drag</li>
        </ul>
      </div>
    </aside>
  )
}