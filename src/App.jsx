import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import { database as data } from './Components/Data'
import Header from './Components/Header'

import Error from './Pages/error'
import Home from './Pages/home'
import Simulation from './Pages/simulation'

export default function App() {
  const baseURL = '/solar-system'

  return (
    <Router>
      <Header/>
      <Routes>
        <Route path='*' element={<Error/>}/>
        {/* <Route path={`${baseURL}`} element={<Home/>}/> */}
        <Route path={`${baseURL}`} element={<Simulation/>}/>
        {/* <Route path={`${baseURL}/simulation`} element={<Simulation/>}/> */}

        {/* <Route path='/universal-codex/elements' element={}/>
        <Route path='/universal-codex/universe' element={}/>
        <Route path='/universal-codex/galaxies' element={}/>
        <Route path='/universal-codex/exoplanets' element={}/>
        <Route path='/universal-codex/stars' element={}/>
        <Route path='/universal-codex/black-holes' element={}/> */}

        <Route path={data.stars.items.the_sun.path} element={<data.stars.items.the_sun.component/>}/>
        {/* <Route path={data.stars.path} element={data.stars.component}/>
        {Object.values(data.stars.items).map((star) => (
          <Route path={star.path} element={<planet.component/>} key={star.id}/>
        ))} */}

        <Route path={data.planets.path} element={<data.planets.component/>}/>
        {Object.values(data.planets.items).map((planet) => (
          <Route path={planet.path} element={<planet.component/>} key={planet.id}/>
        ))}

        {/* <Route path={data.dwarfplanets.path} element={<data.dwarfplanets.component/>}/>
        {Object.values(data.dwarfplanets.items).map((dwarfplanet) => (
          <Route path={dwarfplanet.path} element={<dwarfplanet.component/>} key={dwarfplanet.id}/>
        ))}

        <Route path={data.moons.path} element={<data.moons.component/>}/>
        {Object.values(data.moons.items).map((moon) => (
          <Route path={moon.path} element={<moon.component/>} key={moon.id}/>
        ))} */}
      </Routes>
    </Router>
  )
}