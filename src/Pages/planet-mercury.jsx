import { useEffect } from 'react';

import { database } from '../Components/Data';
import Videos from '../Components/Videos';
import Images from '../Components/Images';
import Sources from '../Components/Sources';

import iconInfo from '/icon/info_v1-white_v2.png';

export default function PlanetMercury() {
  const data = database.planets.items.mercury;

  useEffect(() => {
    document.title = `${data.title} (planet) | The Solar System`;
  }, []);

  return (
    <div className='body'>
      <div className='containerMain'>
        <div className='header2'>
          <div className='title'>{data.title}</div>
          <div className='navSecondary'>
            <button className='button'>
              <img src='/icon/.png'/>
            </button>
            <button className='button'>
              <img src='/icon/.png'/>
            </button>
            <button className='button'>
              <img src='/icon/.png'/>
            </button>
          </div>
        </div>
        <div className='containerInfo'>
          <div className='infoTitle1'>{data.title}</div>
          <img className='infoImage' src={data.images.image1.src} alt={data.title}/>
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
            <div className='infoItem'>
              <div className='infoItemKey'>Inclination</div>
              <div className='infoItemDivider'/>
              <div className='infoItemValue'>
                <li>
                  7,005° to <div className='term'>
                    ecliptic
                    <div className='termExplanation'>
                      The ecliptic or ecliptic plane is the orbital plane of Earth around the Sun.
                    </div>
                  </div>
                </li>
                <li className='liMarginTop'>3,38° to Sun's equator</li>
                <li className='liMarginTop'>6,35° to invariable plane</li>
              </div>
            </div>
            <div className='infoItem'>
              <div className='infoItemKey'>Aphelion</div>
              <div className='infoItemDivider'/>
              <div className='infoItemValue'>69.82 million km</div>
            </div>
            <div className='infoItem'>
              <div className='infoItemKey'>Perihelion</div>
              <div className='infoItemDivider'/>
              <div className='infoItemValue'>46 million km</div>
            </div>
            <div className='infoItem'>
              <div className='infoItemKey'>Satellites</div>
              <div className='infoItemDivider'/>
              <div className='infoItemValue'>None</div>
            </div>
          </div>
          <div className='info'>
            <div className='infoTitle2'>Physical characteristics</div>
            <div className='infoItem'>
              <div className='infoItemKey'>Radius</div>
              <div className='infoItemDivider'/>
              <div className='infoItemValue'>2,439.7km</div>
            </div>
            <div className='infoItem'>
              <div className='infoItemKey'>Flattening</div>
              <div className='infoItemDivider'/>
              <div className='infoItemValue'>0.0009</div>
            </div>
            <div className='infoItem'>
              <div className='infoItemKey'>Surface area</div>
              <div className='infoItemDivider'/>
              <div className='infoItemValue'>
                74 800 000km<sup>2</sup>
              </div>
              
            </div>
            <div className='infoItem'>
              <div className='infoItemKey'>Volume</div>
              <div className='infoItemDivider'/>
              <div className='infoItemValue'></div>
            </div>
            <div className='infoItem'>
              <div className='infoItemKey'>Mass</div>
              <div className='infoItemDivider'/>
              <div className='infoItemValue'></div>
            </div>
            <div className='infoItem'>
              <div className='infoItemKey'>Density</div>
              <div className='infoItemDivider'/>
              <div className='infoItemValue'></div>
            </div>
            <div className='infoItem'>
              <div className='infoItemKey'>Surface gravity</div>
              <div className='infoItemDivider'/>
              <div className='infoItemValue'></div>
            </div>
            <div className='infoItem'>
              <div className='infoItemKey'>Axial tilt</div>
              <div className='infoItemDivider'/>
              <div className='infoItemValue'></div>
            </div>
            <div className='infoItem'>
              <div className='infoItemKey'>Surface temperature</div>
              <div className='infoItemDivider'/>
              <div className='infoItemValue'>
                <div>Min. -193°C</div>
                <div>Max. 427°C</div>
              </div>
            </div>
          </div>
          <div className='info'>
            <div className='infoTitle2'>Atmosphere</div>
            <div className='infoItem'>
              <div className='infoItemKey'>Surface pressure</div>
              <div className='infoItemDivider'/>
              <div className='infoItemValue'>Trace (≲ 0.5 nPa)</div>
            </div>
            <div className='infoItem'>
              <div className='infoItemKey'>Composition by volume</div>
              <div className='infoItemDivider'/>
              <div className='infoItemValue'></div>
            </div>
          </div>
        </div>
        <div className='containerText'>
          <div className='text'>
            <p>
              Mercury is the closest planet to the Sun, and the smallest planet in our solar system
              – only slightly larger than Earth's Moon. Its surface is covered in tens of thousands
              of impact craters. Despite its proximity to the Sun, Mercury is not the hottest planet
              in our solar system – that title belongs to nearby Venus, thanks to its dense
              atmosphere. But Mercury is the fastest planet, zipping around the Sun every 88 Earth
              days.
            </p>
          </div>
        </div>

        <hr className='hr'/>

        <div className='containerText'>
          <div className='title2'>Orbital characteristics</div>
          <div className='text'>
            <dl className='list'>
              <li>
                <b>Distance from the Sun:</b> Mercury orbits at an average distance of approximately
                0.39 astronomical units (AU), which is about 58 million kilometers (36 million
                miles).
              </li>
              <li>
                <b>Orbital Period:</b> It completes an orbit around the Sun in about 88 Earth days.
              </li>
              <li>
                <b>Rotation Period:</b> Mercury has a slow rotation on its axis, taking about 59
                Earth days to complete one rotation.
              </li>
            </dl>
          </div>
        </div>

        <hr className='hr'/>

        <div className='containerText'>
          <div className='title2'>Physical characteristics</div>
          <div className='text'>
            <dl className='list'>
              <li>
                <b>Diameter:</b> Approximately 4,880 kilometers (3,032 miles), making it the
                smallest planet in the Solar System.
              </li>
              <li>
                <b>Mass:</b> About 0.055 times that of Earth.
              </li>
              <li>
                <b>Surface Gravity:</b> Approximately 38% of Earth's gravity.
              </li>
            </dl>
          </div>
        </div>

        <hr className='hr'/>

        <div className='containerText'>
          <div className='title2'>Surface and temperature</div>
          <div className='text'>
            <p>
              Mercury's surface is marked by numerous impact craters, with the largest known as
              Caloris Planitia, spanning about 1,550 kilometers (960 miles) in diameter. The planet
              experiences extreme temperature variations due to its thin exosphere, ranging from
              about 100 K (-173°C) at night to 700 K (427°C) during the day. Notably, some
              permanently shadowed craters near the poles maintain temperatures below 102 K
              (-171°C), allowing for the presence of water ice.
            </p>
          </div>
        </div>

        <hr className='hr'/>

        <div className='containerText'>
          <div className='title2'>Exosphere</div>
          <div className='text'>
            <p>
              Mercury lacks a substantial atmosphere but possesses a tenuous exosphere composed of
              atoms like hydrogen, helium, oxygen, sodium, calcium, and potassium. This exosphere is
              continuously replenished by processes such as solar wind bombardment and radioactive
              decay.
            </p>
          </div>
        </div>

        <hr className='hr'/>

        <div className='containerText'>
          <div className='title2'>Magnetic field</div>
          <div className='text'>
            <p>
              Despite its small size, Mercury has a global magnetic field about 1% as strong as
              Earth's. This magnetic field interacts with the solar wind, creating a magnetosphere
              capable of deflecting solar particles.
            </p>
          </div>
        </div>

        <hr className='hr'/>

        <div className='containerText'>
          <div className='title2'>Exploration</div>
          <div className='text'>
            <p>Mercury has been visited by two spacecrafts:</p>
            <dl className='list'>
              <li>
                <b>Mariner 10:</b> Conducted three flybys in 1974 and 1975, providing the first
                close-up images of Mercury's surface.
              </li>
              <li>
                <b>MESSENGER:</b> Orbited Mercury from 2011 to 2015, offering extensive data on its
                composition, geology, and magnetic field.
              </li>
            </dl>
            <p>
              In January 2025, the BepiColombo mission – a collaboration between the European Space
              Agency (ESA) and the Japan Aerospace Exploration Agency (JAXA) – conducted its sixth
              and final flyby of Mercury. During this maneuver, the spacecraft captured detailed
              images of Mercury's north pole, including permanently shadowed craters and expansive
              volcanic plains. These observations aim to enhance our understanding of the planet's
              geological history and the presence of water ice in shadowed regions.
            </p>
          </div>
        </div>

        <hr className='hr'/>

        <div className='containerText'>
          <div className='title2'>Habitability</div>
          <div className='text'>
            <p>
              Mercury's harsh environmental conditions – extreme temperatures, lack of a substantial
              atmosphere, and high solar radiation – make it an unlikely candidate for Earth-like
              life. However, the discovery of water ice in permanently shadowed craters suggests
              that some regions may have been stable over extended periods, offering insights into
              the planet's volatile history.
            </p>
            <p>
              Understanding Mercury provides valuable information about the formation and evolution
              of terrestrial planets in our Solar System.
            </p>
          </div>
        </div>

        <hr className='hr'/>

        <div className='containerContentMain'>
          <div className='containerTitleNav'>
            <div className='title3'>Videos</div>
            <div className='navSecondary'>
              <button className='button'>
                <img src='/icon/forsen.png'/>
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
                <img src='/icon/forsen.png'/>
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