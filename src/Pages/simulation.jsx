import React, { useState, useEffect, useRef, useMemo } from 'react'

import { Bodies } from '../Components/Bodies'

import SimViewport from '../Components/SimViewport'
import SimControls from '../Components/SimControls'
import SimCamera, { getCameraBasis } from '../Components/SimCamera'
import {
  buildNameIndex,
  precomputeOrbitPolylines,
  createPositionResolver,
  toWorldUnits,
  makeWorldPosOf,
  makeParentPosOf,
  makeIsPrimaryVisibleByType,
  makeShouldShowMoon,
} from '../Components/SimUtils'
import { AU_units, clamp } from '../Components/SimConstants'
import SimBackground from '../Components/SimBackground'
import { orbitDir, keplerToPosition, positionFromTrueAnomaly } from '../Components/SimOrbit'
import SimDrawBodies from '../Components/SimDrawBodies'
import SimDrawOrbits from '../Components/SimDrawOrbits'
import SimDrawLabels from '../Components/SimDrawLabels'
import SimColorMode from '../Components/SimColorMode'

import SimPanel from '../Components/SimPanel'

import bg_Space from '/image/space.jpg'

export default function Simulation() {
  const [pause, setPause] = useState(false)
  const [timeUnit, setTimeUnit] = useState('days') // hours, days
  const [timeScale, setTimeScale] = useState(1)
  const [radiusScale, setRadiusScale] = useState(1)
  const [moveScale, setMoveScale] = useState(1)
  const [zoomScale, setZoomScale] = useState(1)
  const [fov, setFov] = useState(60)
  const [lockTarget, setLockTarget] = useState(' ')
  const [lockDirToParent, setLockDirToParent] = useState(false)

  const [showStars, setShowStars] = useState(true)
  const [showPlanets, setShowPlanets] = useState(true)
  const [showDwarfs, setShowDwarfs] = useState(true)
  const [showMoons, setShowMoons] = useState(true)
  const [showRegular, setShowRegular] = useState(true)
  const [showIrregular, setShowIrregular] = useState(true)
  const [showSatellitesOnlyOfLocked, setShowSatellitesOnlyOfLocked] = useState(true)
  const [showAsteroids, setShowAsteroids] = useState(true)
  const [showAsteroidBelt, setShowAsteroidBelt] = useState(false)
  const [showKuiperBelt, setShowKuiperBelt] = useState(false)
  const [showRings, setShowRings] = useState(true)

  const [showLabels, setShowLabels] = useState(true)
  const [showLabelsStars, setShowLabelsStars] = useState(true)
  const [showLabelsPlanets, setShowLabelsPlanets] = useState(true)
  const [showLabelsDwarfplanets, setShowLabelsDwarfplanets] = useState(true)
  const [showLabelsMoons, setShowLabelsMoons] = useState(true)
  const [showLabelsAsteroids, setShowLabelsAsteroids] = useState(false)

  const [showOrbits, setShowOrbits] = useState(true)
  const [showOrbitsStars, setShowOrbitsStars] = useState(false)
  const [showOrbitsPlanets, setShowOrbitsPlanets] = useState(true)
  const [showOrbitsDwarfplanets, setShowOrbitsDwarfplanets] = useState(false)
  const [showOrbitsMoons, setShowOrbitsMoons] = useState(true)
  const [showOrbitsAsteroids, setShowOrbitsAsteroids] = useState(false)

  const [colorMode, setColorMode] = useState('default')

  const [showBackground, setShowBackground] = useState(true)

  const [panelActive, setPanelActive] = useState(true)
  const [panelWidth, setPanelWidth] = useState(250)
  const resDrag = useRef({ active: false, startX: 0, startW: 250 })

  const viewportRef = useRef({ dpr: 1, cssW: 0, cssH: 0 })
  const canvasRef = useRef(null)
  const camApi = useRef(null)
  const bgRef = useRef(null)
  const bodiesApi = useRef(null)
  const orbitsApi = useRef(null)
  const labelsApi = useRef(null)
  const colorApi = useRef(null)

  const raf = useRef(null)
  const lastT = useRef(performance.now())
  const simDays = useRef(0)

  const camInitYaw = 0 // radians (around Y)
  const camInitPitch = 0 // radians (up/down)
  const camInitRoll = 0
  const camInitDist = 100 // world units from target
  const camInitX = 0
  const camInitY = 0
  const camInitZ = 500

  const cam = useRef({
    yaw: camInitYaw,
    pitch: camInitPitch,
    roll: camInitRoll,
    dist: camInitDist,
    target: { x: camInitX, y: camInitY, z: camInitZ },
  })
  const camTarget = useRef({ ...cam.current })
  const lockRef = useRef(lockTarget)
  useEffect(() => { lockRef.current = lockTarget }, [lockTarget])

  const keys = useRef(new Set())

  const bodies = useMemo(() => {
    const B = Bodies
    return B.map((o) => ({ ...o, theta0: Math.random() * Math.PI * 2 }))
  }, [Bodies])

  const elements = useMemo(() => bodies.map((b) => {
    const hasSign = typeof b.period === 'number' && b.period < 0
    const derivedDir = hasSign ? 'retrograde' : undefined

    return {
      name: b.name,
      type: b.type,
      category: b.category ?? undefined,
      sub_category: b.sub_category ?? undefined,
      group: b.group ?? undefined,
      sub_group: b.sub_group ?? undefined,
      orbit_target: b.orbit_target ?? 'Sun',
      orbit_type: b.orbit_type ?? 'regular',
      orbit_direction: b.orbit_direction ?? derivedDir,
      distance: b.distance ?? 0,
      period_days: Math.abs(b.period ?? 1),
      orbit_speed: b.orbit_speed ?? 0,
      tilt_inclination: b.inclination ?? 0,
      e: b.eccentricity ?? 0,
      Omega_deg: b.Omega_deg ?? 0,
      omega_deg: b.omega_deg ?? 0,
      axial_tilt: b.axial_tilt ?? 0,
      rotation_period: b.rotation_period ?? 'synchronous',
      rotation_speed: b.rotation_speed ?? 0,
      flattening: b.flattening ?? 0,
      radius: b.radius ?? 0,
      mass: b.mass ?? 0,
      density: b.density ?? 0,
      volume: b.volume ?? 0,
      color: b.color ?? '#dddddd',
      M0_deg: (b.theta0 ?? 0) * 180 / Math.PI,
    }
  }), [bodies])

  const nameToIndex = useMemo(() => buildNameIndex(bodies), [bodies])

  const indexByName = useMemo(() => buildNameIndex(bodies), [bodies])

  const lockableTargets = useMemo(() => [' ', ...bodies.map((b) => b.name)], [bodies])

  const resolvePositionsAU = useMemo(
    () => createPositionResolver(bodies, elements, indexByName),
    [bodies, elements, indexByName]
  )

  const isPrimaryVisibleByType = useMemo(
    () => makeIsPrimaryVisibleByType(bodies, { showStars, showPlanets, showDwarfs, showAsteroids }),
    [bodies, showStars, showPlanets, showDwarfs, showAsteroids]
  )
  const shouldShowMoon = useMemo(
    () => makeShouldShowMoon({
      bodies,
      elements,
      nameToIndex,
      isPrimaryVisibleByType,
      getLockTarget: () => lockRef.current,
      showMoons,
      showRegular,
      showIrregular,
      showSatellitesOnlyOfLocked,
    }), [
      bodies, elements, nameToIndex,
      isPrimaryVisibleByType,
      showMoons,
      showRegular,
      showIrregular,
      showSatellitesOnlyOfLocked,
    ]
  )

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    function drawFrame(now) {
      const { dpr, cssW, cssH } = viewportRef.current
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, cssW, cssH)
      const { cssW: width, cssH: height } = viewportRef.current
      
      const dt = (now - lastT.current) / 1000
      lastT.current = now
      if (!pause) {
        const daysPerSecond = timeUnit === 'days' ? timeScale : (timeScale / 24)
        simDays.current += dt * daysPerSecond
      }
      const days = simDays.current

      // Background
      bgRef.current?.draw()

      // Positions
      const positions_AU = resolvePositionsAU(days)
      const positions = toWorldUnits(positions_AU, AU_units)

      const worldPosOf = makeWorldPosOf(nameToIndex, positions)
      const parentPosOf = makeParentPosOf(elements, indexByName, nameToIndex, positions)

      camApi.current?.update({
        dt,
        moveScale,
        zoomScale,
        lockDirToParent,
        worldPosOf,
        parentPosOf,
      })
      const basis = camApi.current?.getBasis() || getCameraBasis(cam.current)

      const NEAR = Math.max(0.0004 * cam.current.dist, 1e-6)

      // Draw bodies
      bodiesApi.current?.draw({
        ctx,
        basis,
        width,
        height,
        fov,
        NEAR,
        positions,
      })
      const drawList = bodiesApi.current?.getDrawList() || []

      // Draw orbits
      orbitsApi.current?.draw({
        ctx,
        basis,
        width,
        height,
        fov,
        NEAR,
        simDays: days,
        positionsAU: positions_AU,
        camDist: cam.current.dist,
      })

      // Labels
      labelsApi.current?.draw({ drawList })

      raf.current = requestAnimationFrame(drawFrame)
    }

    raf.current = requestAnimationFrame(drawFrame)

    // Cleanup
    return () => {
      cancelAnimationFrame(raf.current)
    }
  }, [
    bodies,
    elements,
    indexByName,
    nameToIndex,
    pause,
    timeUnit,
    timeScale,
    radiusScale,
    moveScale,
    zoomScale,
    fov,
    showOrbits,
    showOrbitsStars,
    showOrbitsPlanets,
    showOrbitsDwarfplanets,
    showOrbitsMoons,
    showOrbitsAsteroids,
    showLabels,
    showLabelsStars,
    showLabelsPlanets,
    showLabelsDwarfplanets,
    showLabelsMoons,
    showLabelsAsteroids,
    showStars,
    showPlanets,
    showDwarfs,
    showMoons,
    showRegular,
    showIrregular,
    showSatellitesOnlyOfLocked,
    showAsteroids,
    colorMode,
    lockDirToParent,
  ])

  // Panel resize
  useEffect(() => {
    const onMove = (e) => {
      if (!resDrag.current.active) return
      const dx = resDrag.current.startX - e.clientX
      setPanelWidth((w) => clamp(resDrag.current.startW + dx, 250, 500))
    }
    const onUp = () => { resDrag.current.active = false }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [])
  const startResize = (e) => {
    e.preventDefault()
    if (!panelActive) return
    resDrag.current.active = true
    resDrag.current.startX = e.clientX
    resDrag.current.startW = panelWidth
  }

  const resetCam = () => camApi.current?.reset()

  return (
    <div className='main'>
      <div className='sim-root' style={{ gridTemplateColumns: panelActive ? `1fr ${panelWidth}px` : '1fr 0px'}}>

        <div className='sim-stage'>
          <button className='sim-toggle' onClick={() => setPanelActive((v) => !v)}>
            {panelActive ? 'Hide panel' : 'Show panel'}
          </button>
          <canvas className='sim-canvas' ref={canvasRef}/>
          <SimViewport
            canvasRef={canvasRef}
            viewportRef={viewportRef}
          />
          <SimControls
            keysRef={keys}
          />
          <SimCamera
            ref={camApi}
            camRef={cam}
            camTargetRef={camTarget}
            canvasRef={canvasRef}
            keysRef={keys}
            lockRef={lockRef}
            lockDirToParent={lockDirToParent}
            moveScale={moveScale}
            zoomScale={zoomScale}
            zoomSens={0.0005}
            init={{ yaw: 0, pitch: 0, roll: 0, dist: 100, target: { x: 0, y: 0, z: 500 } }}
          />
          <SimBackground
            ref={bgRef}
            canvasRef={canvasRef}
            viewportRef={viewportRef}
            camRef={cam}
            bgSrc={bg_Space}
            show={showBackground}
          />
          <SimDrawBodies
            ref={bodiesApi}
            bodies={bodies}
            radiusScale={radiusScale}
            showStars={showStars}
            showPlanets={showPlanets}
            showDwarfs={showDwarfs}
            showAsteroids={showAsteroids}
            showMoons={showMoons}
            shouldShowMoon={(i) => shouldShowMoon(i)}
            minPixelRadius={0}
            dotThresholdPx={0.000000001}
            cullBelowPx={0.000000001}
            dotSizePx={1}
          />
          <SimDrawOrbits
            ref={orbitsApi}
            bodies={bodies}
            elements={elements}
            indexByName={indexByName}
            colorMode={(b, el) => colorApi.current?.getColor(b, el) ?? '#ffffff'}
            showOrbits={showOrbits}
            showOrbitsStars={showOrbitsStars}
            showOrbitsPlanets={showOrbitsPlanets}
            showOrbitsDwarfs={showOrbitsDwarfplanets}
            showOrbitsAsteroids={showOrbitsAsteroids}
            showOrbitsMoons={showOrbitsMoons}
            shouldShowMoon={(i) => shouldShowMoon(i)}
            segments={512}
            radiusScale={radiusScale}
            minPixelRadius={0}
            dotThresholdPx={1}
            cullBelowPx={1}
            dotSizePx={0}
            lwMinPx={0}
          />
          <SimDrawLabels
            ref={labelsApi}
            bodies={bodies}
            elements={elements}
            nameToIndex={nameToIndex}
            colorMode={(b, el) => colorApi.current?.getColor(b, el) ?? '#ffffff'}
            onLock={setLockTarget}
            showLabels={showLabels}
            showLabelsStars={showLabelsStars}
            showLabelsPlanets={showLabelsPlanets}
            showLabelsDwarfplanets={showLabelsDwarfplanets}
            showLabelsAsteroids={showLabelsAsteroids}
            showLabelsMoons={showLabelsMoons}
          />
          <SimColorMode
            ref={colorApi}
            mode={colorMode}
          />
        </div>
        <SimPanel
          state={{
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
          }}
        />
      </div>
    </div>
  )
}