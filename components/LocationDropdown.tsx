'use client';

import React, { useState, useEffect, useRef } from 'react';
import { cities, City } from '@/lib/cities';

interface LocationDropdownProps {
  selectedLocation: string;
  onChange: (location: string) => void;
  className?: string;
}

export default function LocationDropdown({ 
  selectedLocation, 
  onChange,
  className = ''
}: LocationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCities, setFilteredCities] = useState(cities);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Filter cities based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredCities(cities);
    } else {
      const lowercasedTerm = searchTerm.toLowerCase();
      const filtered = cities.filter(city => 
        city.name.toLowerCase().includes(lowercasedTerm) || 
        city.state.toLowerCase().includes(lowercasedTerm) ||
        city.displayName.toLowerCase().includes(lowercasedTerm)
      );
      setFilteredCities(filtered);
    }
  }, [searchTerm]);

  const handleSelectCity = (city: City) => {
    onChange(city.displayName);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClearSelection = () => {
    onChange('');
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div 
        className="flex items-center w-full px-3 py-2 border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-amber-500 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedLocation ? (
          <div className="flex justify-between items-center w-full">
            <span>{selectedLocation}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleClearSelection();
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ) : (
          <span className="text-gray-500">Select a location...</span>
        )}
      </div>
      
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          <div className="sticky top-0 bg-white p-2 border-b border-gray-200">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search cities..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              onClick={(e) => e.stopPropagation()}
              autoFocus
            />
          </div>
          
          <div className="py-1">
            <button
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={handleClearSelection}
            >
              No location selected
            </button>
            
            {filteredCities.length > 0 ? (
              filteredCities.map((city) => (
                <button
                  key={city.id}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                    selectedLocation === city.displayName 
                      ? 'bg-amber-100 text-amber-800' 
                      : 'text-gray-700'
                  }`}
                  onClick={() => handleSelectCity(city)}
                >
                  {city.displayName}
                </button>
              ))
            ) : (
              <div className="px-4 py-2 text-sm text-gray-500">No cities found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 