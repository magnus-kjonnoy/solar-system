// Uranus is the seventh planet from the Sun, and it has the third largest diameter of planets in our solar system.

// Uranus is a very cold and windy world.
// The ice giant is surrounded by 13 faint rings and 28 small moons.
// Uranus rotates at a nearly 90-degree angle from the plane of its orbit.
// This unique tilt makes Uranus appear to spin sideways, orbiting the Sun like a rolling ball.

import { useEffect } from 'react';

import { database } from '../Components/Data';
import Videos from '../Components/Videos';
import Images from '../Components/Images';
import Sources from '../Components/Sources';

export default function PlanetUranus() {
  const data = database.planets.items.uranus;

  useEffect(() => {
    document.title = data.title;
  }, []);

  return (
    <>
      
    </>
  );
};