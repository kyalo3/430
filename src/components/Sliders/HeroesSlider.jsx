import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import CustomArrows from './CustomArrows';
import { useState, useEffect, useRef } from 'react';

const HeroesSlider = ({ slides }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [progress, setProgress] = useState(0);
    const sliderRef = useRef(null);
    const autoPlaySpeed = 3600; // Adjusted for testing speed

    const settings = {
        dots: false,               // Disables dots navigation
        infinite: true,            // Enables infinite loop sliding
        slidesToShow: 1,           // Number of slides to show at once
        slidesToScroll: 1,      
        autoplay: true,  
        autoplaySpeed: autoPlaySpeed,
        arrows: false,
        beforeChange: (oldIndex, newIndex) => {
            setCurrentSlide(newIndex);
            setProgress(0); 
        },
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => (prev >= 100 ? 0 : prev + 1));
        }, autoPlaySpeed / 100);

        return () => clearInterval(interval);
    }, [currentSlide]);

    const getBorderStyle = (idx) => {
        if (idx !== currentSlide) {
            return { borderColor: '#34d399' }; 
        }
        return {
            background: `conic-gradient(from 0deg, #f97316 ${progress}%, transparent ${progress}% 100%)`,
        };
    };

    return (
        <div className="max-w-7xl mx-auto relative">
            <CustomArrows className="absolute" />
            <ul className='flex space-x-4 absolute left-24 top-16 mb-16'>
                {slides.map((slide, idx) => (
                    <li key={idx}>
                        <div
                            className="flex justify-center align-center w-16 h-16 rounded-full mb-4 transition-colors duration-500"
                            style={getBorderStyle(idx)}
                        >
                            <img
                                src={slide.image}
                                alt={slide.name}
                                className="w-14 h-14 bg-slate-100 rounded-full my-auto"
                            />
                        </div>
                    </li>
                ))}
            </ul>
            <Slider ref={sliderRef} {...settings} className='mt-16'>
                {slides.map((slide, index) => (
                    <div key={index} className="flex flex-col items-center justify-center p-16">
                        <div className="ml-8 mt-8">
                            <h3 className="font-bold text-xl mb-6">{slide.name}</h3>
                            <p className="text-m text-gray-500">{slide.description}</p>
                            <p className="mt-2 text-base text-gray-700">
                                {/* {slide.testimonial} */}
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                            </p>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default HeroesSlider;
