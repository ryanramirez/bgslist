import React from 'react';
import Image from 'next/image';

type GameListingCardProps = {
  title: string;
  description: string;
  imageUrl: string;
  postedDaysAgo: number;
  location: string;
};

export default function GameListingCard({ title, description, imageUrl, postedDaysAgo, location }: GameListingCardProps) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md">
      <div className="relative h-48 w-full">
        <Image 
          src={imageUrl || '/game-placeholder.jpg'} 
          alt={title} 
          layout="fill" 
          objectFit="cover"
        />
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button className="text-gray-400 hover:text-yellow-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </button>
        </div>
        
        <p className="text-gray-600 mt-1">{description}</p>
        
        <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
          <span>Posted {postedDaysAgo} days ago</span>
          <span>{location}</span>
        </div>
      </div>
    </div>
  );
} 