import { useState, useEffect } from 'react';
import logo from '../../assets/images/logo.png'
import SearchBar from '../SearchBars/SearchBar';
import { FiUser } from "react-icons/fi";
import { BiSearch } from 'react-icons/bi';
import { TiShoppingCart } from "react-icons/ti";

import CategoriesNavbar from '../Navbars/CategoriesNavbar';

const HeaderShop = () => {
  const [showSearchBar, setShowSearchBar] = useState(true);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 48) { // 3rem in pixels
        setShowSearchBar(false);
      } else {
        setShowSearchBar(true);
      }
    };

  window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  const handleSearch = (query) => {
    console.log('Search query:', query);
    // Implement search functionality here
  };
  const handleSearchClick = () => {
    setShowSearchBar(true);
    // Implement search functionality here
  }; 
  return (
    <header className="sticky top-0 bg-white z-50 border-b">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-2 h-24">
        <div className="flex justify-between h-full">
          <div className="flex items-center">
            <div className="flex-shrink-0 mr-16">
              <a href="/shop" >
                <img className="w-32 h-auto" src={logo} alt="Logo" />
              </a>
            </div>
            {!showSearchBar && <CategoriesNavbar/>}
          </div>
          <div className="flex items-center">
            {showSearchBar && <SearchBar onSearch={handleSearch}/>}
            {!showSearchBar && <BiSearch size={24} onClick={handleSearchClick} className='text-emerald-800 ml-4'/>}
            <div>
              <div className='min-w-8 rounded-lg absolute top-2 bg-custom-emerald z-50'></div>
              <TiShoppingCart size={24} className='text-emerald-800 ml-4'/>
            </div>
            <FiUser size={24} className='text-emerald-800 ml-4'/>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderShop;
