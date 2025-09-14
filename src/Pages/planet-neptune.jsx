// Neptune is the eighth and most distant planet in our solar system.

// Dark, cold, and whipped by supersonic winds, ice giant Neptune is more than 30 times as far from the Sun as Earth.
// Neptune is the only planet in our solar system not visible to the naked eye.
// Neptune is so far from the Sun that high noon on the big blue planet would seem like dim twilight to us.
// The warm light we see here on our home planet is roughly 900 times as bright as sunlight on Neptune.

import { useEffect } from 'react';

import { database } from '../Components/Data';
import Videos from '../Components/Videos';
import Images from '../Components/Images';
import Sources from '../Components/Sources';

export default function PlanetNeptune() {
  const data = database.planets.items.neptune;

  useEffect(() => {
    document.title = data.title;
  }, []);

  return (
    <>
      
    </>
  );
};