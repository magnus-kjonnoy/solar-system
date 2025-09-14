import { Link, NavLink } from 'react-router-dom';

import { database } from './Data';

import iconMenu from '/icon/menu_v2_white_v2.png';
import iconSettings from '/icon/settings_v1-white_v2.png';
import iconArrowDown from '/icon/arrow_down_v2-white_v2.png';
// import iconArrowUp from '/icon/.png';

export default function Nav() {
  const data = database;

  const planet = database.planets.items;
  const dwarfplanet = database.dwarfplanets.items;
  const moon = database.moons.items;

  return (
    <div className='nav'>
      <button className='button'>
        <img src={iconMenu} className='icon'/>
        {/* <div className='dropdownContent'>
          <div className='dropdownItem'>
            <NavLink to={data.stars.path}>{data.stars.title}</NavLink>
            <button>
              <img src={iconArrowDown} className='iconSmall'/>
            </button>
          </div>
          <div className='dropdownItem'>
            <NavLink to={data.planets.path}>{data.planets.title}</NavLink>
            <button>
              <img src={iconArrowDown} className='iconSmall'/>
            </button>
          </div>
          <div className='dropdownItem'>
            <NavLink to={data.dwarfplanets.path}>{data.dwarfplanets.title}</NavLink>
            <button>
              <img src={iconArrowDown} className='iconSmall'/>
            </button>
          </div>
          <div className='dropdownItem'>
            <NavLink to={data.moons.path}>{data.moons.title}</NavLink>
            <button>
              <img src={iconArrowDown} className='iconSmall'/>
            </button>
          </div>
          <div className='dropdownItem'>
            <NavLink to='/'>Other</NavLink>
            <button>
              <img src={iconArrowDown} className='iconSmall'/>
            </button>
          </div>
        </div> */}
      </button>
      <button className='button'>
        <img src={iconSettings} className='icon'/>
      </button>
    </div>
  );
};