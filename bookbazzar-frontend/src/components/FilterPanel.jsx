// src/components/FilterChips.jsx
import React from 'react';

const categories = ['All','Crime','Comic','Fiction','Romance'];

const FilterChips = ({ genre, setGenre }) => (
  <div className="overflow-x-auto py-2">
    <div className="inline-flex space-x-3">
      {categories.map(cat => (
        <button
          key={cat}
          onClick={() => setGenre(cat)}
          className={`px-4 py-2 rounded-lg shadow-sm whitespace-nowrap
            ${genre === cat
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          {cat}
        </button>
      ))}
      <button className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300">
        More
      </button>
    </div>
  </div>
);

export default FilterChips;
