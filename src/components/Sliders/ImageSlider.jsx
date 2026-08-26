import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { MEDIA } from '../../constants/media';

const slides = [
  {
    ...MEDIA.hero,
    caption: 'Surplus ready to move — not retail stock photography.',
  },
  {
    ...MEDIA.volunteers,
    caption: 'Volunteers packing verified donations for safe handover.',
  },
  {
    ...MEDIA.produce,
    caption: 'Fresh produce redistributed before it becomes waste.',
  },
];

const ImageSlider = () => {
  const settings = {
    dots: true,
    autoplay: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    pauseOnHover: true,
  };

  return (
    <Slider {...settings} className="max-w-7xl mx-auto surplus-slider">
      {slides.map((slide) => (
        <div key={slide.src} className="px-4 py-4">
          <figure className="relative h-64 sm:h-80 md:h-[28rem] overflow-hidden rounded-2xl bg-emerald-950">
            <img
              src={slide.src}
              alt={slide.alt}
              className="h-full w-full object-cover"
              style={{ objectPosition: slide.objectPosition }}
            />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-emerald-950/90 to-transparent p-5 sm:p-7">
              <p className="text-sm sm:text-base font-medium text-white max-w-xl">{slide.caption}</p>
            </figcaption>
          </figure>
        </div>
      ))}
    </Slider>
  );
};

export default ImageSlider;
