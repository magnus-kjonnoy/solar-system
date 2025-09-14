// import { dataStars } from '../Data/planets';
// import { dataPlanets } from '../Data/planets';
// import { dataDwarfplanets } from '../Data/planets';
// import { dataMoons } from '../Data/planets';

// export const database = {
//   dataStars,
//   dataPlanets,
//   dataDwarfplanets,
//   dataMoons,
// };


import TheSun from '../Pages/the_sun';
import Planets from '../Pages/planets';
import PlanetMercury from '../Pages/planet-mercury';
import PlanetVenus from '../Pages/planet-venus';
import PlanetEarth from '../Pages/planet-earth';
import PlanetMars from '../Pages/planet-mars';
import PlanetJupiter from '../Pages/planet-jupiter';
import PlanetSaturn from '../Pages/planet-saturn';
import PlanetUranus from '../Pages/planet-uranus';
import PlanetNeptune from '../Pages/planet-neptune';
import Dwarfplanets from '../Pages/dwarfplanets';
import DwarfplanetCeres from '../Pages/dwarfplanet-ceres';
import DwarfplanetPluto from '../Pages/dwarfplanet-pluto';
import DwarfplanetHaumea from '../Pages/dwarfplanet-haumea';
import DwarfplanetMakemake from '../Pages/dwarfplanet-makemake';
import DwarfplanetEris from '../Pages/dwarfplanet-eris';
import Moons from '../Pages/moons';


export const database = {
  stars: {
    component: "Stars",
    path: "/stars",
    title: "Stars",
    description: "",
    videos: {
      video1: {
        id: 1,
        url: "https://www.youtube.com/embed/",
      },
    },
    images: {
      image1: {
        id: 1,
        src: "/image/.png",
        alt: "",
      },
    },
    sources: {
      source1: {
        id: 1,
        url: "",
        title: "",
      },
    },
    items: {
      the_sun: {
        id: 1,
        component: TheSun,
        path: "/star/the_sun",
        title: "The Sun",
        description: "",
        image: "/image/.png",
        videos: {
          video1: {
            id: 1,
            url: "https://www.youtube.com/embed/",
          },
        },
        images: {
          image1: {
            id: 1,
            src: "/image/.png",
            alt: "",
          },
        },
        sources: {
          source1: {
            id: 1,
            url: "",
            title: "",
          },
        },
      },
    },
  },
  planets: {
    component: Planets,
    path: "/planets",
    title: "Planets",
    description: "",
    videos: {
      video1: {
        id: 1,
        url: "https://www.youtube.com/embed/",
      },
    },
    images: {
      image1: {
        id: 1,
        src: "/image/.png",
        alt: "",
      },
    },
    sources: {
      source1: {
        id: 1,
        url: "",
        title: "",
      },
    },
    items: {
      mercury: {
        id: 1,
        component: PlanetMercury,
        path: "/planet/mercury",
        title: "Mercury",
        description: "Mercury is the smallest planet in our solar system, and the closest to the sun",
        image: "/image/Mercury.png",
        info: [
          
        ],
        text: {

        },
        videos: {
          video1: {
            id: 1,
            url: "https://www.youtube.com/embed/rX_NCCpw5Uo",
          },
        },
        images: {
          image1: {
            id: 1,
            src: "/image/Mercury.png",
            alt: "Mercury",
          },
        },
        sources: {
          source1: {
            id: 1,
            url: "https://en.wikipedia.org/wiki/Mercury_(planet)",
            title: "Wikipedia - Mercury (planet)",
          },
          source2: {
            id: 2,
            url: "https://science.nasa.gov/mercury/",
            title: "NASA - Mercury",
          },
        },
      },
      venus: {
        id: 2,
        component: PlanetVenus,
        path: "/planet/venus",
        title: "Venus",
        description: "",
        image: "/image/Venus.png",
        videos: {
          video1: {
            id: 1,
            url: "https://www.youtube.com/embed/",
          },
        },
        images: {
          image1: {
            id: 1,
            src: "/image/.png",
            alt: "",
          },
        },
        sources: {
          source1: {
            id: 1,
            url: "",
            title: "",
          },
        },
      },
      earth: {
        id: 3,
        component: PlanetEarth,
        path: "/planet/earth",
        title: "Earth",
        description: "",
        image: "/image/Earth.png",
        videos: {
          video1: {
            id: 1,
            url: "https://www.youtube.com/embed/",
          },
        },
        images: {
          image1: {
            id: 1,
            src: "/image/.png",
            alt: "",
          },
        },
        sources: {
          source1: {
            id: 1,
            url: "",
            title: "",
          },
        },
      },
      mars: {
        id: 4,
        component: PlanetMars,
        path: "/planet/mars",
        title: "Mars",
        description: "",
        image: "/image/Mars.png",
        videos: {
          video1: {
            id: 1,
            url: "https://www.youtube.com/embed/",
          },
        },
        images: {
          image1: {
            id: 1,
            src: "/image/.png",
            alt: "",
          },
        },
        sources: {
          source1: {
            id: 1,
            url: "",
            title: "",
          },
        },
      },
      jupiter: {
        id: 5,
        component: PlanetJupiter,
        path: "/planet/jupiter",
        title: "Jupiter",
        description: "",
        image: "/image/Jupiter.png",
        videos: {
          video1: {
            id: 1,
            url: "https://www.youtube.com/embed/",
          },
        },
        images: {
          image1: {
            id: 1,
            src: "/image/.png",
            alt: "",
          },
        },
        sources: {
          source1: {
            id: 1,
            url: "",
            title: "",
          },
        },
      },
      saturn: {
        id: 6,
        component: PlanetSaturn,
        path: "/planet/saturn",
        title: "Saturn",
        description: "",
        image: "/image/Saturn.png",
        videos: {
          video1: {
            id: 1,
            url: "https://www.youtube.com/embed/",
          },
        },
        images: {
          image1: {
            id: 1,
            src: "/image/.png",
            alt: "",
          },
        },
        sources: {
          source1: {
            id: 1,
            url: "",
            title: "",
          },
        },
      },
      uranus: {
        id: 7,
        component: PlanetUranus,
        path: "/planet/uranus",
        title: "Uranus",
        description: "",
        image: "/image/Uranus.png",
        videos: {
          video1: {
            id: 1,
            url: "https://www.youtube.com/embed/",
          },
        },
        images: {
          image1: {
            id: 1,
            src: "/image/.png",
            alt: "",
          },
        },
        sources: {
          source1: {
            id: 1,
            url: "",
            title: "",
          },
        },
      },
      neptune: {
        id: 8,
        component: PlanetNeptune,
        path: "/planet/neptune",
        title: "Neptune",
        description: "",
        image: "/image/Neptune.png",
        videos: {
          video1: {
            id: 1,
            url: "https://www.youtube.com/embed/",
          },
        },
        images: {
          image1: {
            id: 1,
            src: "/image/.png",
            alt: "",
          },
        },
        sources: {
          source1: {
            id: 1,
            url: "",
            title: "",
          },
        },
      },
    },
  },
  dwarfplanets: {
    component: Dwarfplanets,
    path: "/dwarfplanets",
    title: "Dwarfplanets",
    description: "",
    videos: {
      video1: {
        id: 1,
        url: "https://www.youtube.com/embed/",
      },
    },
    images: {
      image1: {
        id: 1,
        src: "/image/.png",
        alt: "",
      },
    },
    sources: {
      source1: {
        id: 1,
        path: "",
        title: "",
      },
    },
    items: {
      ceres: {
        id: 1,
        component: DwarfplanetCeres,
        path: "/dwarfplanet/ceres",
        title: "Ceres",
        description: "",
        image: "/image/Ceres.png",
        videos: {
          video1: {
            id: 1,
            url: "https://www.youtube.com/embed/",
          },
        },
        images: {
          image1: {
            id: 1,
            src: "/image/.png",
            alt: "",
          },
        },
        sources: {
          source1: {
            id: 1,
            url: "",
            title: "",
          },
        },
      },
      pluto: {
        id: 2,
        component: DwarfplanetPluto,
        path: "/dwarfplanet/pluto",
        title: "Pluto",
        description: "",
        image: "/image/Pluto.png",
        videos: {
          video1: {
            id: 1,
            url: "https://www.youtube.com/embed/",
          },
        },
        images: {
          image1: {
            id: 1,
            src: "/image/.png",
            alt: "",
          },
        },
        sources: {
          source1: {
            id: 1,
            url: "",
            title: "",
          },
        },
      },
      haumea: {
        id: 3,
        component: DwarfplanetHaumea,
        path: "/dwarfplanet/haumea",
        title: "Haumea",
        description: "",
        image: "/image/Haumea.png",
        videos: {
          video1: {
            id: 1,
            url: "https://www.youtube.com/embed/",
          },
        },
        images: {
          image1: {
            id: 1,
            src: "/image/.png",
            alt: "",
          },
        },
        sources: {
          source1: {
            id: 1,
            url: "",
            title: "",
          },
        },
      },
      makemake: {
        id: 4,
        component: DwarfplanetMakemake,
        path: "/dwarfplanet/makemake",
        title: "Makemake",
        description: "",
        image: "/image/Makemake.png",
        videos: {
          video1: {
            id: 1,
            url: "https://www.youtube.com/embed/",
          },
        },
        images: {
          image1: {
            id: 1,
            src: "/image/.png",
            alt: "",
          },
        },
        sources: {
          source1: {
            id: 1,
            url: "",
            title: "",
          },
        },
      },
      eris: {
        id: 5,
        component: DwarfplanetEris,
        path: "/dwarfplanet/eris",
        title: "Eris",
        description: "",
        image: "/image/Eris.png",
        videos: {
          video1: {
            id: 1,
            url: "https://www.youtube.com/embed/",
          },
        },
        images: {
          image1: {
            id: 1,
            src: "/image/.png",
            alt: "",
          },
        },
        sources: {
          source1: {
            id: 1,
            url: "",
            title: "",
          },
        },
      },
    },
  },
  moons: {
    component: Moons,
    path: "/moons",
    title: "Moons",
    description: "",
    videos: {
      video1: {
        id: 1,
        url: "https://www.youtube.com/embed/",
      },
    },
    images: {
      image1: {
        id: 1,
        src: "/image/.png",
        alt: "",
      },
    },
    sources: {
      source1: {
        id: 1,
        url: "",
        title: "",
      },
    },
    items: {
      the_moon: {
        id: 1,
        component: "TheMoon",
        path: "/moon/the_moon",
        title: "The Moon",
        description: "",
        image: "/image/.png",
        videos: {
          video1: {
            id: 1,
            url: "https://www.youtube.com/embed/",
          },
        },
        images: {
          image1: {
            id: 1,
            src: "/image/.png",
            alt: "",
          },
        },
        sources: {
          source1: {
            id: 1,
            url: "",
            title: "",
          },
        },
      },
    },
  },
};