import { useEffect } from 'react';

import { database } from '../Components/Data';
import PageCard from '../Components/PageCard';

export default function Dwarfplanets() {
  const data = database;

  useEffect(() => {
    document.title = data.dwarfplanets.title;
  }, []);

  return (
    <div className='body'>
      <div className='containerMain'>
        <div className='title'>{data.planets.title}</div>
        <div className='containerText'>
          <div className='text'>
            There are five officially recognized dwarf planets in our solar system: Ceres, Pluto, Haumea, Makemake, and Eris.
            <br/>
            Beyond Neptune, a newer class of smaller worlds called dwarf planets reign, including longtime favorite Pluto.
            The other dwarf planets are Ceres, Makemake, Haumea, and Eris.
            Ceres is the only dwarf planet in the inner solar system, and is located in the main asteroid belt between Mars and Jupiter.
          </div>
        </div>
        <div className='containerPageCards'>
          {Object.values(data.dwarfplanets.items).map((data) => {
            return <PageCard data={data} key={data.id}/>
          })}
        </div>
      </div>
    </div>
  );
};