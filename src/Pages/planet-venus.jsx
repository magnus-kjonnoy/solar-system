// Venus is the second planet from the Sun, and Earth's closest planetary neighbor.
// Venus is the third brightest object in the sky after the Sun and Moon.
// Venus spins slowly in the opposite direction from most planets.
              
// Venus is similar in structure and size to Earth, and is sometimes called Earth's evil twin.
// Its thick atmosphere traps heat in a runaway greenhouse effect, making it the hottest planet in our solar system with surface temperatures hot enough to melt lead.
// Below the dense, persistent clouds, the surface has volcanoes and deformed mountains.
            
import { useEffect } from 'react';

import { database } from '../Components/Data';
import Videos from '../Components/Videos';
import Images from '../Components/Images';
import Sources from '../Components/Sources';

export default function PlanetVenus() {
  const data = database.planets.items.venus;

  useEffect(() => {
    document.title = data.title;
  }, []);

  return (
    <>
      
    </>
  );
};