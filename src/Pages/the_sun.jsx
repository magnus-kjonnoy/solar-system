import { useEffect } from 'react';

import { database } from '../Components/Data';
import Videos from '../Components/Videos';
import Images from '../Components/Images';
import Sources from '../Components/Sources';

export default function TheSun() {
  const data = database.stars.items.the_sun;

  useEffect(() => {
    document.title = data.title;
  }, []);

  return (
    <>
      
    </>
  );
};