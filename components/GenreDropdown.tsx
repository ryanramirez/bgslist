'use client';

import React, { useState, useEffect, useRef } from 'react';
import { boardGameGenres, BoardGameGenre } from '@/lib/boardGameGenres';

interface GenreDropdownProps {
  selectedGenreId: string;
  onChange: (genreId: string) => void;
  className?: string;
}

export default function GenreDropdown({ 
  selectedGenreId, 
  onChange,
  className = ''
}: GenreDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredGenres, setFilteredGenres] = useState(boardGameGenres);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedGenre = boardGameGenres.find(genre => genre.id === selectedGenreId);

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

  // Filter genres based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredGenres(boardGameGenres);
    } else {
      const lowercasedTerm = searchTerm.toLowerCase();
      const filtered = boardGameGenres.filter(genre => 
        genre.name.toLowerCase().includes(lowercasedTerm) || 
        (genre.description && genre.description.toLowerCase().includes(lowercasedTerm))
      );
      setFilteredGenres(filtered);
    }
  }, [searchTerm]);

  const handleSelectGenre = (genre: BoardGameGenre) => {
    onChange(genre.id);
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
        {selectedGenre ? (
          <div className="flex justify-between items-center w-full">
            <span className="flex-1">{selectedGenre.name}</span>
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
          <span className="text-gray-500">Select your favorite game genre...</span>
        )}
      </div>
      
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          <div className="sticky top-0 bg-white p-2 border-b border-gray-200">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search genres..."
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
              No favorite genre selected
            </button>
            
            {filteredGenres.length > 0 ? (
              filteredGenres.map((genre) => (
                <button
                  key={genre.id}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                    selectedGenreId === genre.id 
                      ? 'bg-amber-100 text-amber-800' 
                      : 'text-gray-700'
                  }`}
                  onClick={() => handleSelectGenre(genre)}
                >
                  <div>
                    <div className="font-medium">{genre.name}</div>
                    {genre.description && (
                      <div className="text-xs text-gray-500">{genre.description}</div>
                    )}
                  </div>
                </button>
              ))
            ) : (
              <div className="px-4 py-2 text-sm text-gray-500">No genres found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 