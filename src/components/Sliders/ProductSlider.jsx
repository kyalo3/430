// ProductSlider.js
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import ProductLink from './ProductLink';

const products = [
  { id: 1, name: 'Crisp Red Apples (500g Approx. 5pcs)', price: '150', image: '/images/products/apple.webp', vendor: "Naivas", category: "fruits" },
  { id: 2, name: 'Red Onions', price: '195', image: '/images/products/onions.webp', vendor: "Naivas",  category: "vegetables"},
  { id: 3, name: 'Sukuma wiki (per bunch)', price: '20', image: '/images/products/sukuma.webp', vendor: "Naivas", category: "vegetables"},
  { id: 4, name: 'Spinach (per bunch)', price: '25', image: '/images/products/spinach.webp', vendor: "Naivas", category: "vegetables"},
  { id: 5, name: 'Orange Sweet Potatoes 1kg', price: '200', image: '/images/products/sweet-potatoes.webp', vendor: "Naivas", category: "vegetables" },
  { id: 6, name: 'Tomatoes', price: '325', image: '/images/products/tomatoes.webp', vendor: "Naivas", category: "vegetables" },
  { id: 7, name: 'All Natural Mild Premium Sausage Patties 100g', price: '150', image: '/images/products/Swaggerty_sFarmAllNaturalMildPremiumSausagePatties.webp', vendor: "Naivas", category: "fishnmeat"},
  { id: 8, name: 'Pickled garlic and lemon slices 200g', price: '98', image: '/images/products/TOP02915_1946x.webp', vendor: "Naivas", category: "pantry"},
  { id: 9, name: 'Green Beans 250g', price: '120', image: '/images/products/pack-veg-5-update-1.webp',vendor: "Naivas", category: "vegetables"},
  { id: 10, name: 'White onions', price: '90', image: '/images/products/wonions.webp', vendor: "Naivas", category: "vegetables"},
];


const ProductSlider = ({props}) => {
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 5, // Adjust to show the number of columns you want per row
    slidesToScroll: 5, // Adjust to scroll the number of columns you want per scroll
    rows: props.rows, 
  };

  return (
    <div className="container mx-auto my-4 bg-white rounded-lg py-8 px-8">
      <h2 className="font-bold text-xl text-emeraldCustomDark mb-8 ml-4">{props.title}</h2>
      <Slider {...settings}>
        {products.map((product) => (
            <ProductLink key={product.id} product={product}/>
        ))}
      </Slider>
    </div>
  );
};

export default ProductSlider;
