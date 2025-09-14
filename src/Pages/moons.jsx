import { useEffect } from 'react';

import { database } from '../Components/Data';
import PageCard from '../Components/PageCard';

export default function Moons() {
  const data = database;

  useEffect(() => {
    document.title = data.moons.title;
  }, []);

  return (
    <div className='body'>
      <div className='title'>Moons</div>
      <div className='containerPages'>
        {Object.values(data.moons.items).map((data) => {
          return <PageCard data={data} key={data.id}/>
        })}
      </div>
    </div>
  );
};