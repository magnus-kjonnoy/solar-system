import { useEffect } from "react";

import Videos from "../Components/Videos";
import Images from "../Components/Images";
import Sources from "../Components/Sources";

export default function Page({ data }) {
  useEffect(() => {
    document.title = `${data.title} | The Universal Codex`;
  }, []);

  function renderText(text) {
    if (typeof text === 'string' || typeof text === 'number' || text?.type) {
      return <>{text}</>
    };

    if (Array.isArray(text)) {
      return text.map((item, idx) => {
        if (typeof item === 'string' || item?.type) {
          return <div key={idx}>{item}</div>
        }

        if (item.type === 'list') {
          return (
            <dl className="list" key={idx}>
              {item.items.map((li, i) => (
                <li key={i}>
                  {item.bold && li.key ? <b>{li.key}:</b> : null} {li.text}
                </li>
              ))}
            </dl>
          );
        };

        return null;
      });
    };

    return null;
  };

  return (
    <div className="body">
      <div className="containerMain">
        <div className="header2">
          <div className="title">{data.title}</div>
          <div className="nav2">
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
        {data.info && Object.entries(data.info).map(([sectionKey, section]) => (
          <div className='containerInfo' key={sectionKey}>
            <div className="infoTitle1">{data.title}</div>
            <img className='infoImage' src={data.images.image1.src} alt={data.title}/>
            <hr className='infoHr'/>
          </div>
        ))}
      </div>
    </div>
  );
};