'use client';

import React, { useState, useEffect, useRef } from 'react';
import { popularBoardGames, BoardGame } from '@/lib/boardGames';

interface BoardGameDropdownProps {
  selectedGameId: string;
  onChange: (gameId: string) => void;
  onCustomGameCreate?: (gameName: string) => void;
  className?: string;
}

export default function BoardGameDropdown({ 
  selectedGameId, 
  onChange,
  onCustomGameCreate,
  className = ''
}: BoardGameDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredGames, setFilteredGames] = useState(popularBoardGames);
  const [customGameName, setCustomGameName] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedGame = popularBoardGames.find(game => game.id === selectedGameId);

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

  // Filter games based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredGames(popularBoardGames);
    } else {
      const lowercasedTerm = searchTerm.toLowerCase();
      const filtered = popularBoardGames.filter(game => 
        game.name.toLowerCase().includes(lowercasedTerm) || 
        (game.publisher && game.publisher.toLowerCase().includes(lowercasedTerm))
      );
      setFilteredGames(filtered);
    }
    // Update custom game name
    setCustomGameName(searchTerm.trim());
  }, [searchTerm]);

  const handleSelectGame = (game: BoardGame) => {
    onChange(game.id);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClearSelection = () => {
    onChange('');
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && customGameName) {
      e.preventDefault();
      
      // Check if the entered game name matches any existing game
      const existingGame = popularBoardGames.find(
        game => game.name.toLowerCase() === customGameName.toLowerCase()
      );
      
      if (existingGame) {
        // If game exists, select it
        handleSelectGame(existingGame);
      } else if (onCustomGameCreate) {
        // If it's a custom game, call the callback
        onCustomGameCreate(customGameName);
        setIsOpen(false);
        setSearchTerm('');
      }
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div 
        className="flex items-center w-full px-3 py-2 border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-amber-500 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedGame ? (
          <div className="flex justify-between items-center w-full">
            <span className="flex-1">{selectedGame.name}</span>
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
          <span className="text-gray-500">Select board game...</span>
        )}
      </div>
      
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          <div className="sticky top-0 bg-white p-2 border-b border-gray-200">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search or enter custom game name and press Enter"
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
              No game selected
            </button>
            
            {customGameName && filteredGames.length === 0 && (
              <button
                className="w-full text-left px-4 py-2 text-sm bg-green-50 text-green-800 hover:bg-green-100"
                onClick={() => {
                  if (onCustomGameCreate) {
                    onCustomGameCreate(customGameName);
                    setIsOpen(false);
                    setSearchTerm('');
                  }
                }}
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Add custom: &quot;{customGameName}&quot;</span>
                </div>
              </button>
            )}
            
            {filteredGames.length > 0 ? (
              filteredGames.map((game) => (
                <button
                  key={game.id}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                    selectedGameId === game.id 
                      ? 'bg-amber-100 text-amber-800' 
                      : 'text-gray-700'
                  }`}
                  onClick={() => handleSelectGame(game)}
                >
                  <div>
                    <div className="font-medium">{game.name}</div>
                    {game.publisher && (
                      <div className="text-xs text-gray-500">{game.publisher} ({game.year})</div>
                    )}
                  </div>
                </button>
              ))
            ) : (
              !customGameName && <div className="px-4 py-2 text-sm text-gray-500">No games found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 