// src/components/ImageSlider.jsx
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const images = [
  {
    src: "/images/slider2.jpg",
    link: "#"
  },
  {
    src: "/images/slider1.jpg",
    link: "#"
  },
//   {
//     src: "/images/slider3.jpg",
//     link: "#"
//   },
  // Add more images as needed
];

const ImageSlider = () => {
  const settings = {
    dots: false,
    autoplay:true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  return (
    <Slider {...settings} className="max-w-7xl mx-auto">
      {images.map((image, index) => (
        <div key={index} className="flex items-center mx-auto justify-center bg-transparent text-white p-4 h-500-px overflow-hidden">
          <a href={image.link} className="w-full h-full">
            <img src={image.src} alt={`Slide ${index + 1}`} className="object-cover w-full h-full rounded-lg " />
          </a>
        </div>
      ))}
    </Slider>
  );
};

export default ImageSlider;
