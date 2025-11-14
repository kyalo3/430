import { useState } from 'react';

const FilterSortBar = ({props}) => {
  const [filter, setFilter] = useState('Bar');
  const [sort, setSort] = useState('Alphabetically, A-Z');
  const productsCount = props.productsLength;

  return (
    <div className="max-w-7xl mx-auto flex justify-between items-center p-4 mt-2 border-y border-gray-200">
      <div className='flex justify-between gap-16'>
        <div className="flex items-center">
            <label htmlFor="filter" className="mr-4 font-light text-xs">FILTER BY</label>
            <select
            id="filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border-0 outline-none text-emeraldCustomDark font-medium text-sm"
            >
            <option value="Bar">Bar</option>
            <option value="Foo">Foo</option>
            <option value="Baz">Baz</option>
            </select>
        </div>
        <div className="flex items-center">
            <label htmlFor="sort" className="mr-4 font-light text-xs">SORT BY</label>
            <select
            id="sort"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border-0 outline-none text-emeraldCustomDark font-medium text-sm"
            >
            <option value="Alphabetically, A-Z">Alphabetically, A-Z</option>
            <option value="Alphabetically, Z-A">Alphabetically, Z-A</option>
            <option value="Price, Low to High">Price, Low to High</option>
            <option value="Price, High to Low">Price, High to Low</option>
            </select>
        </div>
      </div>
      <div className="italic">{productsCount} products</div>
    </div>
  );
};

export default FilterSortBar;
