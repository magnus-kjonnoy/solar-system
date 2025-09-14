import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    document.title = 'The Solar System';
  }, []);

  return (
    <div className='body'>
      <div className='containerIntroduction'>
        <div className='title'>The Solar System</div>
        <div className='introductionText'>
          <div className='introductionTextP'>
            Our solar system includes the Sun, eight planets, five officially named dwarf planets, and hundreds of moons, and thousands of asteroids and comets.
          </div>
          <div className='introductionTextP'>
            The solar system a part of the Milky Way galaxy, a barred spiral galaxy with two major arms, and two minor arms.
          </div>
          <div className='introductionTextP'>
            It's located in a small, partial arm of the Milky Way called the Orion Arm, or Orion Spur, between the Sagittarius and Perseus arms.
          </div>
          <div className='introductionTextP'>
            The solar system orbits the center of the galaxy at about 515,000mph or 828,000kph. 
            It takes about 230 million years to complete one orbit around the galactic center.
          </div>
        </div>
      </div>
    </div>
  );
};