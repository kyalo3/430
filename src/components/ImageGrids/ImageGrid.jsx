import { FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { MEDIA } from '../../constants/media';

const images = [
  {
    src: MEDIA.produce.src,
    objectPosition: MEDIA.produce.objectPosition,
    title: 'Fruits & produce',
    link: '/shop/collection/fruits',
  },
  {
    src: MEDIA.market.src,
    objectPosition: MEDIA.market.objectPosition,
    title: 'Vegetables',
    link: '/shop/collection/vegetables',
  },
  {
    src: MEDIA.kitchen.src,
    objectPosition: MEDIA.kitchen.objectPosition,
    title: 'Prepared & perishable',
    link: '/shop/collection/fish-meat',
  },
  {
    src: MEDIA.pantry.src,
    objectPosition: MEDIA.pantry.objectPosition,
    title: 'Pantry',
    link: '/shop/collection/pantry',
  },
  {
    src: MEDIA.hero.src,
    objectPosition: MEDIA.hero.objectPosition,
    title: 'Dairy & staples',
    link: '/shop/collection/dairy',
  },
  {
    src: MEDIA.volunteers.src,
    objectPosition: MEDIA.volunteers.objectPosition,
    title: 'Bakery & pastries',
    link: '/shop/collection/bakery-pastry',
  },
];

const ImageGrid = () => {
  return (
    <div className="max-w-7xl mx-auto my-8 p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {images.map((image) => (
        <Link
          to={image.link}
          key={image.link}
          className="group relative block h-52 sm:h-56 overflow-hidden rounded-2xl bg-emerald-950"
        >
          <img
            src={image.src}
            alt={image.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            style={{ objectPosition: image.objectPosition }}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-emerald-950/20 to-transparent transition group-hover:from-emerald-950/90" />
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-4 text-white">
            <span className="text-lg font-semibold">{image.title}</span>
            <span className="inline-flex items-center gap-1 text-sm font-medium opacity-0 transition group-hover:opacity-100">
              View <FiArrowRight />
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ImageGrid;
