// Eris is one of largest the dwarf planets in our solar system.
// It's about the same size as Pluto, but it's three times farther from the Sun.

import { useEffect } from 'react';

import { database } from '../Components/Data';
import Videos from '../Components/Videos';
import Images from '../Components/Images';
import Sources from '../Components/Sources';

export default function DwarfplanetEris() {
  const data = database.dwarfplanets.items.eris;

  useEffect(() => {
    document.title = data.title;
  }, []);

  return (
    <>
      
    </>
  );
};