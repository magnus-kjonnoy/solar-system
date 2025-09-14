// Makemake is slightly smaller than Pluto, and is the second-brightest object in the Kuiper Belt as seen from Earth while Pluto is the brightest.
// It takes about 305 Earth years for this dwarf planet to make one trip around the Sun.

// Makemake holds an important place in the history of solar system studies because it was one of the objects – along with Eris – whose discovery prompted the International Astronomical Union to reconsider the definition of a planet, and to create the new group of dwarf planets.

import { useEffect } from 'react';

import { database } from '../Components/Data';
import Videos from '../Components/Videos';
import Images from '../Components/Images';
import Sources from '../Components/Sources';

export default function DwarfplanetMakemake() {
  const data = database.dwarfplanets.items.makemake;

  useEffect(() => {
    document.title = data.title;
  }, []);

  return (
    <>
      
    </>
  );
};