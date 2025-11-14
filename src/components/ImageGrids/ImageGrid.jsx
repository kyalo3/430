// src/components/ImageGrid.jsx
import { FiArrowRight } from "react-icons/fi";
import { Link } from "react-router-dom";

const images = [
  { 
    src: "/images/fruits.webp",
    title: "Fruits",
    link: "/shop/collection/fruits",
  },
  {
    src: "/images/vegetables.webp",
    title: "Vegetables",
    link: "/shop/collection/vegetables",
  },
  {
    src: "/images/fishmeat.webp",
    title: "Fish & Meat",
    link: "/shop/collection/fish-meat",
  },
  {
    src: "/images/pantry.webp",
    title: "Pantry",
    link: "/shop/collection/pantry",
  },
  {
    src: "/images/dairy.webp",
    title: "Dairy",
    link: "/shop/collection/dairy",
  },
  {
    src: "/images/bakery.webp",
    title: "Bakery & Pastries",
    link: "/shop/collection/bakery-pastry",
  },
];


const ImageGrid = () => {
    return (
      <div className="max-w-7xl mx-auto my-8 p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <Link to={image.link} key={index} className="relative group">
            <img src={image.src} alt={image.title} className="w-full h-full object-cover rounded-lg" />
            <div className="absolute inset-0 bg-black bg-opacity-25 flex items-end justify-center pb-4 rounded-lg group-hover:bg-opacity-75 group-hover:items-center transition-opacity duration-300">
                    <div className="text-white text-lg font-bold">
                    {image.title}
                    </div>
                    <div className="absolute bottom-4">
                    <div  className="flex justify-center items-center text-white opacity-0 group-hover:opacity-100">
                      View More 
                      <FiArrowRight className="ml-1"/>
                      </div>
                    </div>
            </div>
          </Link>
        ))}
      </div>
    );
  };



export default ImageGrid;
