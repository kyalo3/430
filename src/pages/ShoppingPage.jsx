import { useEffect } from 'react';
import HeaderShop from '../components/Headers/HeaderShop'
import CategoriesNavbar from '../components/Navbars/CategoriesNavbar';
import Footer from '../components/Footers/Footer';
import { FaArrowRightLong } from "react-icons/fa6";
import ImageSlider from '../components/Sliders/ImageSlider';
import ImageGrid from '../components/ImageGrids/ImageGrid';
import ProductSlider from '../components/Sliders/ProductSlider';
import { LuShoppingBasket, LuPackage, LuTruck } from 'react-icons/lu';


const ShoppingPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const steps = [
    {
      icon: <LuShoppingBasket size={24} />,
      title: 'Browse surplus categories',
      description: 'See what kinds of resources communities typically redistribute — not a retail catalogue.',
    },
    {
      icon: <LuPackage size={24} />,
      title: 'Register to list or request',
      description: 'Create a role-based account. Listings are verified before they become available.',
    },
    {
      icon: <LuTruck size={24} />,
      title: 'Match and handover',
      description: 'Volunteers complete authorised handovers. Impact is counted only after confirmation.',
    }
  ];

  return (
     <div className='bg-slate-100'>
      <HeaderShop/>
      <CategoriesNavbar/>
      <main>
        <ImageSlider/>
        <ImageGrid/>
        <ProductSlider props ={{title:"Featured Products", rows:2}}/>
        <div className="container mx-auto my-8 bg-white rounded-lg py-16 px-10 min-h-400">
          <h2 className="font-bold text-2xl mb-4 text-center text-emeraldCustomDark">How redistribution works</h2>
          <p className="text-center mb-8 text-gray-600">This browse surface is not checkout. There is no cart and no payment.</p>
          <div className="flex justify-around gap-16 px-12">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="bg-emeraldCustomDark text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  {step.icon}
                </div>
                <h3 className="font-bold mb-2 text-emerald-800">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
        <ProductSlider props ={{title:"Trending Products", rows:2}}/>
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
            <div className="container relative mx-auto">
              <div className="flex flex-wrap">
                <div className="px-4">
                  <div className="pr-12">
                    <h1 className="text-white font-semibold text-5xl">
                    Surplus categories,<br/>
                    verified journeys.
                    </h1>
                    <p className="mt-4 text-lg text-slate-200">
                    Browse examples, then join as a donor, recipient, or volunteer. We never invent impact counters.
                    </p>
                    <a
                      href="/"
                      className="w-48 mt-8 items-center inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-4 bg-orange-500 text-m font-medium text-white"
                    >
                      Join to participate <FaArrowRightLong className='ml-4' />
                    </a>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ShoppingPage;
