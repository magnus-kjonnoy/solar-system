import React, { useEffect } from 'react';

import { database } from '../Components/Data';
import Videos from '../Components/Videos';
import Images from '../Components/Images';
import Sources from '../Components/Sources';

export default function PlanetTest() {
  const data = database.planets.items.test;

  useEffect(() => {
    document.title = data.title + ' (planet)' + ' | ' + 'The Solar System';
  }, []);

  return (
    <div className='body'>
      <div className='containerMain'>
        <div className='containerTitleNav'>
          <div className='title'>{data.title}</div>
          <div className='navSecondary'>
            <button className='button'>
              <img src='/icon/test.png'/>
            </button>
            <button className='button'>
              <img src='/icon/test.png'/>
            </button>
            <button className='button'>
              <img src='/icon/test.png'/>
            </button>
          </div>
        </div>
        <div className='containerInfo'>
          <div className='infoTitle1'>{data.title}</div>
          <img className='infoImage' src={data.image} alt={data.title}/>
          <hr className='infoHr'/>
          <div className='info'>
            <div className='infoTitle2'>Orbital characteristics</div>
            <div className='infoItem'>
              <div className='infoItemKey'>Orbital period</div>
              <div className='infoItemDivider'/>
              <div className='infoItemValue'>88 Earth days</div>
            </div>
            <div className='infoItem'>
              <div className='infoItemKey'>Average orbital speed</div>
              <div className='infoItemDivider'/>
              <div className='infoItemValue'>47km/s</div>
            </div>
          </div>
        </div>
        <div className='containerText'>
          <div className='text'>
            <p>...</p>
          </div>
        </div>

        <hr className='hr'/>

        <div className='containerText'>
          <div className='title2'>Orbital characteristics</div>
          <div className='text'>
            <dl className='list'>
              <li><b>Distance from the Sun:</b> ...</li>
              <li><b>Orbital Period:</b> ...</li>
              <li><b>Rotation Period:</b> ...</li>
            </dl>
          </div>
        </div>

        <hr className='hr'/>

        <div className='containerText'>
          <div className='title2'>Physical characteristics</div>
          <div className='text'>
            <dl className='list'>
              <li><b>Diameter:</b> ...</li>
              <li><b>Mass:</b> ...</li>
              <li><b>Surface Gravity:</b> ...</li>
            </dl>
          </div>
        </div>

        <hr className='hr'/>

        <div className='containerText'>
          <div className='title2'>Surface and temperature</div>
          <div className='text'>
            <p>...</p>
          </div>
        </div>

        <hr className='hr'/>

        <div className='containerText'>
          <div className='title2'>Exosphere</div>
          <div className='text'>
            <p>...</p>
          </div>
        </div>

        <hr className='hr'/>

        <div className='containerText'>
          <div className='title2'>Magnetic field</div>
          <div className='text'>
            <p>...</p>
          </div>
        </div>

        <hr className='hr'/>

        <div className='containerText'>
          <div className='title2'>Exploration</div>
          <div className='text'>
            <p>Mercury has been visited by two spacecrafts:</p>
            <dl className='list'>
              <li><b>Mariner 10:</b> ...</li>
              <li><b>MESSENGER:</b> ...</li>
            </dl>
            <p>...</p>
          </div>
        </div>

        <hr className='hr'/>

        <div className='containerText'>
          <div className='title2'>Habitability</div>
          <div className='text'>
            <p>...</p>
            <p>...</p>
          </div>
        </div>

        <hr className='hr'/>

        <div className='containerContentMain'>
          <div className='containerTitleNav'>
            <div className='title3'>Videos</div>
            <div className='navSecondary'>
              <button className='button'>
                <img src='/icon/test.png'/>
              </button>
            </div>
          </div>
          <div className='containerContent'>
            {Object.values(data.videos).map((video) => {
              return <Videos data={video} key={video.id}/>
            })}
          </div>
        </div>

        <hr className='hr'/>

        <div className='containerContentMain'>
          <div className='containerTitleNav'>
            <div className='title3'>Images</div>
            <div className='navSecondary'>
              <button className='button'>
                <img src='/icon/test.png'/>
              </button>
            </div>
          </div>
          <div className='containerContent'>
            {Object.values(data.images).map((image) => {
              return <Images data={image} key={image.id}/>
            })}
          </div>
        </div>

        <hr className='hr'/>

        <div className='title3'>Sources</div>
        <div className='containerSources'>
          {Object.values(data.sources).map((source) => {
            return <Sources data={source} key={source.id}/>
          })}
        </div>
      </div>
    </div>
  );
};