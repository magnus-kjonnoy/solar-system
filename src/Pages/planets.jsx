import { useEffect } from 'react';

import { database } from '../Components/Data';
import PageCard from '../Components/PageCard';

export default function Planets() {
  const data = database;

  useEffect(() => {
    document.title = data.planets.title + ' | ' + 'The Solar System';
  }, []);

  return (
    <div className='body'>
      <div className='containerMain'>
        <div className='title'>{data.planets.title}</div>
        <div className='containerText'>
          <div className='text'>
            The solar system has eight planets: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune.
            The first four planets from the Sun are Mercury, Venus, Earth, and Mars.
            These inner planets also are known as terrestrial planets because they have solid surfaces.
            The giant planets in our outer solar system don't have hard surfaces and instead have swirling gases above a core.
            Jupiter and Saturn are gas giants.
            Uranus and Neptune are ice giants.
          </div>
        </div>
        <div className='containerPageCards'>
          {Object.values(data.planets.items).map((data) => {
            return <PageCard data={data} key={data.id}/>
          })}
        </div>
      </div>
    </div>
  );
};