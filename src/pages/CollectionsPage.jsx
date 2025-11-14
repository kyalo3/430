import { useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import HeaderShop from '../components/Headers/HeaderShop';
import CategoriesNavbar from '../components/Navbars/CategoriesNavbar';
import ProductLink from '../components/Sliders/ProductLink';
import FilterSortBar from '../components/Headers/FilterSortBar';

const categories = [
    { 
      src: "/images/fruits.webp",
      title: "Fruits",
      link: "/shop/collection/fruits",
      category: "fruits"
    },
    {
      src: "/images/vegetables.webp",
      title: "Vegetables",
      link: "/shop/collection/vegetables",
      category: "vegetables"
    },
    {
      src: "/images/fishmeat.webp",
      title: "Fish & Meat",
      link: "/shop/collection/fish-meat",
      category: "fishnmeat"
    },
    {
      src: "/images/pantry.webp",
      title: "Pantry",
      link: "/shop/collection/pantry",
      category: "pantry"
    },
    {
      src: "/images/dairy.webp",
      title: "Dairy",
      link: "/shop/collection/dairy",
      category: "dairy"
    },
    {
      src: "/images/bakery.webp",
      title: "Bakery & Pastries",
      link: "/shop/collection/bakery-pastry",
      category: "bakerynpastry"

    },
  ];
  
const allProducts = [
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

function CollectionsPage() {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [categoryDetails, setCategoryDetails] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProducts = async (category) => {
        return allProducts.filter((product) => product.category === category);
    }
    const fetchCategoryDetails = async (category) => {
        return categories.filter((categoryDetail) => categoryDetail.category === category);
    }
    fetchCategoryDetails(category).then((categoryDetail) => setCategoryDetails(...categoryDetail));
    fetchProducts(category).then((products) => setProducts(products));
  }, [category]);

  return (
    <div>
    <HeaderShop/>
    <CategoriesNavbar/>
    <div className="max-w-7xl relative flex items-center mx-auto justify-center bg-transparent text-white rounded-lg h-64 overflow-hidden">
        <img src={categoryDetails.src} alt={categoryDetails.title} className="object-cover w-full h-full rounded-lg " />
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-25">
            <div className="text-white text-3xl font-bold">
                {categoryDetails.title}
            </div>
        </div>
    </div>
    <main>
    <FilterSortBar props ={{productsLength: products.length}}/>
    <div className="max-w-7xl mx-auto my-8 p-4 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-5 gap-4">  
      {products.map((product) => (
            <ProductLink key={product.id} product={product}/>
          )
        )}
        </div>
        </main>
    </div>
  )}

export default CollectionsPage