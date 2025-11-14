import { IoIosArrowDown } from "react-icons/io";

const CategoriesNavbar = () => {
  return (
    <nav className="bg-white shadow-m">
      <div className="max-w-7xl mx-auto px-2 m:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex space-x-8">
            <a href="#" className="inline-flex items-center px-1 pt-1 text-m font-normal text-gray-500 hover:text-gray-700">
              Fruits <IoIosArrowDown className="ml-1" />
            </a>
            <a href="#" className="inline-flex items-center px-1 pt-1 text-m font-normal text-gray-500 hover:text-gray-700">
              Vegetables <IoIosArrowDown className="ml-1" />
            </a>
            <a href="#" className="inline-flex items-center px-1 pt-1 text-m font-normal text-gray-500 hover:text-gray-700">
              Fish & Meat <IoIosArrowDown className="ml-1" />
            </a>
            <a href="#" className="inline-flex items-center px-1 pt-1 text-m font-normal text-gray-500 hover:text-gray-700">
              Pantry <IoIosArrowDown className="ml-1" />
            </a>
            <a href="#" className="inline-flex items-center px-1 pt-1 text-m font-normal text-gray-500 hover:text-gray-700">
              Dairy <IoIosArrowDown className="ml-1" />
            </a>
            <a href="#" className="inline-flex items-center px-1 pt-1 text-m font-normal text-gray-500 hover:text-gray-700">
              Bakery & Pastries <IoIosArrowDown className="ml-1" />
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default CategoriesNavbar;
