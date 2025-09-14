// Mars – the fourth planet from the Sun – is a dusty, cold, desert world with a very thin atmosphere.
// This dynamic planet has seasons, polar ice caps, extinct volcanoes, canyons and weather.
              
// Mars is one of the most explored bodies in our solar system, and it's the only planet where we've sent rovers to roam the alien landscape.
// NASA missions have found lots of evidence that Mars was much wetter and warmer, with a thicker atmosphere, billions of years ago.

import { useEffect } from 'react';

import { database } from '../Components/Data';
import Videos from '../Components/Videos';
import Images from '../Components/Images';
import Sources from '../Components/Sources';

export default function PlanetMars() {
  const data = database.planets.items.mars;

  useEffect(() => {
    document.title = data.title;
  }, []);

  return (
    <>
      
    </>
  );
};