// src/components/SearchBar.jsx
import React from 'react';

const SearchBar = ({ search, setSearch }) => (
  <div className="flex-1">
    <input
      type="text"
      value={search}
      onChange={e => setSearch(e.target.value)}
      placeholder="Search for books here..."
      className="w-full px-4 py-3 rounded-full bg-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
  </div>
);

export default SearchBar;
