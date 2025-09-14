

export default function Sources({ data: { url, title } }) {

  return (
    <a href={url} className='link'>
      {title}
    </a>
  );
};