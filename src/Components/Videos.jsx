

export default function Videos({ data: { url } }) {

  return (
    <iframe src={url} className='contentVid'/>
  );
};