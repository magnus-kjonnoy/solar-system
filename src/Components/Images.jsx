

export default function Images({ data: { src, alt } }) {

  return (
    <img src={src} alt={alt} className='contentImg'/>
  );
};