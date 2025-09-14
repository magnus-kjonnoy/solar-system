// Dwarf planet Ceres is the largest object in the asteroid belt between Mars and Jupiter, and it's the only dwarf planet located in the inner solar system.
// It was the first member of the asteroid belt to be discovered when Giuseppe Piazzi spotted it in 1801.
// When NASA's Dawn arrived in 2015, Ceres became the first dwarf planet to be explored by a spacecraft.

// Called an asteroid for many years, Ceres is so much bigger and so different from its rocky neighbors that scientists classified it as a dwarf planet in 2006.
// Even though Ceres comprises 25% of the asteroid belt's total mass, Pluto is still 14 times more massive.

import { useEffect } from 'react';

import { database } from '../Components/Data';
import Videos from '../Components/Videos';
import Images from '../Components/Images';
import Sources from '../Components/Sources';

export default function DwarfplanetCeres() {
  const data = database.dwarfplanets.items.ceres;

  useEffect(() => {
    document.title = data.title;
  }, []);

  return (
    <>
      
    </>
  );
};