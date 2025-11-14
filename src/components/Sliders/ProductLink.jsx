import { Link } from "react-router-dom";
import { LuShoppingBasket } from "react-icons/lu";
import { ProductContext } from '../../context/ProductContext';
import { useContext } from "react";


function transformString(name) {
  return name.toLowerCase().replace(/ /g, '-');
}


function ProductLink({product}) {
  const { setProduct } = useContext(ProductContext);
  const handleProductClick = () => {
    setProduct(product);
  };

  const transformedName = transformString(product.name);
  return (
    <div className="relative mr-6 shadow-md mb-8 rounded-lg h-72">
    <Link key={product.id} 
    to={`/shop/collection/${product.category}/${transformedName}/${product.id}`}
    onClick={handleProductClick}
    >
    <div className='absolute right-0 mr-2 mt-2 bg-slate-100 rounded w-8 h-6 items-center flex justify-center'>
        <LuShoppingBasket size={16} className='text-emeraldCustomDark'/>
    </div>
      <img src={product.image} alt={product.name} className="w-full h-48 object-contain" />
      <div className="p-4">
        <h3 className="font-bold text-sm text-emeraldCustomDark">Ksh. {product.price}</h3>
        <p className="text-gray-600">{product.name}</p>
      </div>
  </Link>
  </div>
  )
}

export default ProductLink