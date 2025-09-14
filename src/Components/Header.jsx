import { Link, NavLink } from 'react-router-dom';

import Nav from './Nav';

export default function Header() {

  return (
    <div className='header'>
      <Link to='/solar-system' className='headerTitle'>
        The Solar System
      </Link>
      <Nav/>
    </div>
  );
};