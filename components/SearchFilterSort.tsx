import React from 'react';

export default function SearchFilterSort() {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
      <div className="w-full md:w-1/2">
        <input
          type="text"
          placeholder="Search games..."
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
        <div className="flex items-center gap-2">
          <span className="text-gray-700 whitespace-nowrap">Filter by:</span>
          <select className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500">
            <option value="genre">Genre</option>
            <option value="condition">Condition</option>
            <option value="price">Price</option>
            <option value="location">Location</option>
          </select>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-gray-700 whitespace-nowrap">Sort by:</span>
          <select className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500">
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>
    </div>
  );
} 