// Pluto is a complex and mysterious world with mountains, valleys, plains, craters, and glaciers.
// It is located in the distant Kuiper Belt.

// Discovered in 1930, Pluto was long considered our solar system's ninth planet.
// But after the discovery of similar worlds deeper in the Kuiper Belt, Pluto was reclassified as a dwarf planet in 2006.

// Pluto is orbited by five known moons, the largest of which is Charon.
// Charon is about half the size of Pluto itself, making it the largest satellite relative to the planet it orbits in our solar system.

import { useEffect } from 'react';

import { database } from '../Components/Data';
import Videos from '../Components/Videos';
import Images from '../Components/Images';
import Sources from '../Components/Sources';

export default function DwarfplanetPluto() {
  const data = database.dwarfplanets.items.pluto;

  useEffect(() => {
    document.title = data.title;
  }, []);

  return (
    <>
      
    </>
  );
};