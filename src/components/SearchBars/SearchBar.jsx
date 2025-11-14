import { useState } from 'react';
import { BiSearch, BiX } from 'react-icons/bi';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  const handleSearch = () => {
    onSearch(query);
  };

  return (
    <div className="flex items-center justify-center py-2">
      <div className="flex items-center bg-gray-100 rounded-md py-1 shadow-sm w-full max-w-lg">
        <BiSearch size={24} className="ml-4 text-gray-500" />
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="What Are You Looking For?"
          className="flex-grow px-4 py-2 bg-transparent border-none focus:outline-none focus:ring-0"
        />
        <div className='w-10 flex justify-center items-center'>
        {query && (
          <button
            onClick={handleClear}
            className="mr-6 text-gray-500 focus:outline-none"
          >
            <BiX size={24}/>
          </button>
        )}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
