// Saturn is the sixth planet from the Sun, and the second-largest planet in our solar system.

// Like fellow gas giant Jupiter, Saturn is a massive ball made mostly of hydrogen and helium.
// Saturn is not the only planet to have rings, but none are as spectacular or as complex as Saturn's.
// Saturn also has dozens of moons.
// From the jets of water that spray from Saturn's moon Enceladus to the methane lakes on smoggy Titan, the Saturn system is a rich source of scientific discovery and still holds many mysteries.

import { useEffect } from 'react';

import { database } from '../Components/Data';
import Videos from '../Components/Videos';
import Images from '../Components/Images';
import Sources from '../Components/Sources';

export default function PlanetSaturn() {
  const data = database.planets.items.saturn;

  useEffect(() => {
    document.title = data.title;
  }, []);

  return (
    <>
      
    </>
  );
};