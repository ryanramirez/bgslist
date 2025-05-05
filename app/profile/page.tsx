'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Banner from '@/components/Banner';
import GameListingCard from '@/components/GameListingCard';
import { useAuth } from '@/context/AuthContext';
import { getUserProfile, getUserListings } from '@/lib/firestore';
import { UserProfile, GameListing } from '@/lib/models';

export default function Profile() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [userListings, setUserListings] = useState<GameListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedLocation, setEditedLocation] = useState('');
  const [editedBio, setEditedBio] = useState('');

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/signin');
    }
  }, [authLoading, user, router]);

  // Fetch user profile and listings
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Fetch user profile
        const userProfile = await getUserProfile(user.uid);
        if (userProfile) {
          setProfile(userProfile);
          setEditedName(userProfile.name);
          setEditedLocation(userProfile.location);
          setEditedBio(userProfile.bio);
        }
        
        // Fetch user listings
        const listings = await getUserListings(user.uid);
        setUserListings(listings);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load your profile data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [user]);

  // Handle profile edit
  const handleSaveProfile = async () => {
    if (!user || !profile) return;
    
    try {
      setLoading(true);
      
      const updatedProfile = {
        ...profile,
        name: editedName,
        location: editedLocation,
        bio: editedBio
      };
      
      // Call your updateUserProfile function here
      // await updateUserProfile(user.uid, updatedProfile);
      
      setProfile(updatedProfile);
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update your profile');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <main className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
        </div>
      </main>
    );
  }

  if (!user || !profile) {
    return (
      <main className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-gray-600">Profile not found or you are not logged in.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <Navbar />
      <Banner />
      
      <div className="container mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 relative">
              <Image 
                src={profile.avatar || '/user-placeholder.jpg'} 
                alt={profile.name} 
                fill
                className="object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://via.placeholder.com/150";
                }}
              />
            </div>
            
            {isEditing ? (
              <div className="flex-grow">
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">Name</label>
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">Location</label>
                  <input
                    type="text"
                    value={editedLocation}
                    onChange={(e) => setEditedLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">Bio</label>
                  <textarea
                    value={editedBio}
                    onChange={(e) => setEditedBio(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                
                <div className="flex space-x-2">
                  <button 
                    onClick={handleSaveProfile}
                    className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded"
                  >
                    Save
                  </button>
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-grow text-center md:text-left">
                <h2 className="text-2xl font-bold">{profile.name}</h2>
                <p className="text-gray-600">{profile.location}</p>
                <p className="text-gray-500 text-sm">Member since {new Date(profile.joinedDate).toLocaleDateString()}</p>
                <p className="mt-4">{profile.bio}</p>
              </div>
            )}
            
            {!isEditing && (
              <div className="flex-shrink-0">
                <button 
                  onClick={() => setIsEditing(true)}
                  className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded"
                >
                  Edit Profile
                </button>
              </div>
            )}
          </div>
        </div>
        
        <h3 className="text-xl font-semibold mb-4">My Listings</h3>
        
        {userListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userListings.map(game => (
              <GameListingCard 
                key={game.id}
                title={game.title}
                description={game.description}
                imageUrl={game.imageUrl}
                postedDaysAgo={getDaysAgo(game.createdAt)}
                location={game.location}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-gray-500">You don&apos;t have any listings yet.</p>
            <button
              onClick={() => router.push('/create-listing')}
              className="mt-4 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded"
            >
              Create Your First Listing
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

// Helper function to calculate days ago
function getDaysAgo(dateString: string): number {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
} 