// Earth – our home planet – is the third planet from the Sun, and the fifth largest planet.
// It's the only place we know of inhabited by living things.
              
// Earth is the only planet in our solar system with liquid water on the surface.
// Just slightly larger than nearby Venus, Earth is the biggest of the four planets closest to the Sun, all of which are made of rock and metal.

import { useEffect } from 'react';

import { database } from '../Components/Data';
import Videos from '../Components/Videos';
import Images from '../Components/Images';
import Sources from '../Components/Sources';

export default function PlanetEarth() {
  const data = database.planets.items.earth;

  useEffect(() => {
    document.title = data.title;
  }, []);

  return (
    <>
      
    </>
  );
};