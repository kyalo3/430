import DropdownButton from '../Dropdowns/DropdownButton';
import logo from '../../assets/images/logo.png'

const Header = () => {
  return (
    <header className="sticky top-0 bg-background z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-24">
        <div className="flex justify-between h-full">
          <div className="flex items-center">
            <div className="flex-shrink-0 mr-16">
              <a href="/" >
                <img className="w-32 h-auto" src={logo} alt="Logo" />
              </a>
            </div>
            <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
              <a href="/" className="border-primary text-fontWhiteBg inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">Home</a>
              <a href="/about" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">About</a>
              <a href="/services" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">Services</a>
              <a href="/contact" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">Contact</a>
            </div>
          </div>
          <div className="flex items-center">
            <DropdownButton />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
