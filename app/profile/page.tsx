import React from 'react';
import Navbar from '@/components/Navbar';
import Banner from '@/components/Banner';
import GameListingCard from '@/components/GameListingCard';

// Sample user data
const user = {
  name: 'Jane Boardgamer',
  location: 'Bend, OR',
  joinedDate: 'January 2023',
  avatar: '/user-placeholder.jpg',
  bio: 'Board game enthusiast with a collection of over 100 games. Love trading for new experiences!'
};

// Sample listings from this user
const userListings = [
  {
    id: 1,
    title: 'Wingspan',
    description: 'Only played 2 times, looking for a good trade for 2 weeks.',
    imageUrl: '/game-placeholder.jpg',
    postedDaysAgo: 3,
    location: 'Bend, OR'
  },
  {
    id: 2,
    title: 'Selling Ticket to Ride',
    description: 'Selling Ticket to Ride, played once. Like new condition. $40',
    imageUrl: '/game-placeholder.jpg',
    postedDaysAgo: 1,
    location: 'Bend, OR'
  }
];

export default function Profile() {
  return (
    <main className="min-h-screen bg-gray-100">
      <Navbar />
      <Banner />
      
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://via.placeholder.com/150";
                }}
              />
            </div>
            
            <div className="flex-grow text-center md:text-left">
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-gray-600">{user.location}</p>
              <p className="text-gray-500 text-sm">Member since {user.joinedDate}</p>
              <p className="mt-4">{user.bio}</p>
            </div>
            
            <div className="flex-shrink-0">
              <button className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded">
                Edit Profile
              </button>
            </div>
          </div>
        </div>
        
        <h3 className="text-xl font-semibold mb-4">My Listings</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userListings.map(game => (
            <GameListingCard 
              key={game.id}
              title={game.title}
              description={game.description}
              imageUrl={game.imageUrl}
              postedDaysAgo={game.postedDaysAgo}
              location={game.location}
            />
          ))}
        </div>
      </div>
    </main>
  );
} 