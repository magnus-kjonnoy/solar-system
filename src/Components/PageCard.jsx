import { Link } from 'react-router-dom';

export default function PageCard({ data: { path, title, description, image } }) {

  return (
    <Link className='pageCard' to={path}>
      <img className='pageCardImage' src={image} alt={title}/>
      <div className='pageCardTitle'>{title}</div>
      <div className='pageCardDescription'>{description}</div>
    </Link>
  );
};