import { useContext, useState, useEffect} from 'react';
import HeaderShop from '../components/Headers/HeaderShop';
import CategoriesNavbar from '../components/Navbars/CategoriesNavbar';
import ProductBar from '../components/Headers/ProductBar';
import QuantityComponent from '../components/Toggles/QuantityComponent';
import { ProductContext } from '../context/ProductContext';
import ToggleButtons from '../components/Toggles/ToggleButtons';
import Footer from '../components/Footers/Footer';
import ProductSlider from '../components/Sliders/ProductSlider';


function ProductPage() {
  const { product } = useContext(ProductContext);
  const [productbar, setProductBar] = useState(false);
  const [shopHeader, setHeader] = useState(true);


  useEffect(() => {
    
    window.scrollTo(0, 0);
    const handleScroll = () => {
      if (window.scrollY > 440) {
        setProductBar(true);
      } else {
        setProductBar(false);
      }
    };

  window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div>
        {!productbar &&<HeaderShop/>}
        <CategoriesNavbar/>
        {productbar && <ProductBar product={product}/>}
        <main className='max-w-7xl mx-auto py-4 px-2 m:px-6 lg:px-8'>
          <div className='flex flex-col gap-2'>
            <div className='font-semi-bold text-xl'>
              {product.name}
            </div>
            <div className='font-thin text-sm uppercase border-b pb-4'>
              {product.vendor}
            </div>
          </div>
          <div className='w-full flex  flex-row mt-4 gap-32'>
            <div className='w-1/4'>
             <img className="w-[300px] h-[300px] my-auto" src={product.image} alt="product"/>
            </div>
            <div className='flex flex-col w-3/4'>
              <div className='font-bold text-l'>
                Ksh. {product.price}
              </div>
              <div className='font-thin text-sm mb-4'>
                Tax included. Shipping calculated at checkout.
              </div>
              <div className>
                <div className='mb-2'>
                  Status: <span className='text-emerald-800 font-bold text-sm'>In Stock</span>
                </div>
                <div className='mb-2'>
                  Quantity
                </div>
                <QuantityComponent/>
                <button className='justify-end my-4 bg-orange-500 p-4 rounded font-bold text-white w-full mx-auto'>
                  Add to cart
                </button>
                <div className='mb-2'>
                  Categories: <span className='text-emerald-500 font-light text-sm'>All Food, Fresh Fruits, Fresh Fruits & Vegetables, Fresh Vegetables</span>
                </div>
                <div>
                  Tags: <span className='text-slate-500 font-light text-sm'>Fruits, Vegetables</span>
                </div>
              </div>


            </div>
          </div>
          <div className='flex justify-center mt-16 mb-4 border-b'>
            <ToggleButtons toggles={{first:"Description", second:"Specification"}}/>
          </div>
          <p className='text-black-500 font-light text-l'>Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>

          <div className='flex flex-col mt-12'>
            <div className='bg-slate-200 py-4 mb-4 justify-center rounded-m'>
              <h3 className='font-bold text-m text-center'>Related Products</h3>
            </div>
            <ProductSlider props ={{title:"", rows:1}}/>
          </div>
        </main>
        <div className="relative pt-16 pb-16 mt-8 flex content-center items-center justify-center min-h-400">
            <div
              className="absolute top-0 w-full h-full bg-center bg-cover"
              style={{
                backgroundImage:
                  "url('/images/hero.webp')",
                }}
            >
              <span
                id="blackOverlay"
                className="w-full h-full absolute opacity-50 bg-black"
              ></span>
            </div>
        </div>
        <Footer/>
    </div>
  )
}

export default ProductPage
