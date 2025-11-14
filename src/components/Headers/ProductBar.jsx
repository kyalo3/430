import { useState } from 'react';
import ToggleButtons from '../Toggles/ToggleButtons';

const ProductBar = ({product}) => {
  return (
    <div className="mt-2 border-y border-gray-200 sticky bg-white top-0 z-[999]">
      <div className='max-w-7xl mx-auto flex justify-between items-center p-6'>
        <div className='flex justify-between gap-16'>
          <div className="flex items-center">
            <img className="w-16 h-16 shadow-lg border-t rounded-lg" src={product.image} alt="product"/>
          </div>
          <div className="flex items-center">
            <div className=''>
              {product.name}
              <ToggleButtons toggles={{first:"Description", second:"Specification"}}/>
            </div>

          </div>
        </div>
        <div className="flex justify-between gap-6 items-center"> 
          <div className='text-orange-500 text-l font-bold'>
            KSH. {product.price}
          </div>
          <button className='bg-orange-500 px-4 py-2 text-white rounded-lg'>
            Add to cart
          </button>

        </div>
      </div>
    </div>
  );
};

export default ProductBar;
