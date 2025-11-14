import { useState } from 'react';

const ToggleButtons = ({toggles, activeToggle, setActiveToggle}) => {
  return (
    <div className="flex mt-4">
      <button
        className={`mr-4 px-4 py-2 rounded-3xl  ${activeToggle === toggles.first ? 'bg-emerald-700 text-emerald-100' : 'text-emerald-700 transparent'}`}
        onClick={() => setActiveToggle(toggles.first)}
      >
        {toggles.first}
      </button>
      <button
        className={`px-4 py-2  rounded-3xl ${activeToggle === toggles.second ? 'bg-emerald-700 text-emerald-100' : 'text-emerald-700 bg-transparent'}`}
        onClick={() => setActiveToggle(toggles.second)}
      >
        {toggles.second}
      </button>
    </div>
  );
};

export default ToggleButtons;
