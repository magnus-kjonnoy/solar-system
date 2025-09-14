// Dwarf planet Haumea was originally designated 2003 EL61 (and nicknamed Santa by one discovery team).
// Haumea is located in the Kuiper Belt, a region of icy bodies beyond the orbit of Neptune.
// This oval-shaped dwarf planet is one of the fastest rotating large objects in our solar system.

import { useEffect } from 'react';

import { database } from '../Components/Data';
import Videos from '../Components/Videos';
import Images from '../Components/Images';
import Sources from '../Components/Sources';

export default function DwarfplanetHaumea() {
  const data = database.dwarfplanets.items.haumea;

  useEffect(() => {
    document.title = data.title;
  }, []);

  return (
    <>
      
    </>
  );
};