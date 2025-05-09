'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Banner from '@/components/Banner';
import GameListingCard from '@/components/GameListingCard';
import LocationDropdown from '@/components/LocationDropdown';
import BoardGameDropdown from '@/components/BoardGameDropdown';
import GenreDropdown from '@/components/GenreDropdown';
import VPBadge from '@/components/VPBadge';
import { useAuth } from '@/context/AuthContext';
import { useVP } from '@/context/VPContext';
import { getUserProfile, getUserListings, updateUserProfile, updateUserVPs } from '@/lib/firestore';
import { UserProfile, GameListing } from '@/lib/models';
import { popularBoardGames } from '@/lib/boardGames';
import { boardGameGenres } from '@/lib/boardGameGenres';
import { getTimeAgo } from '@/lib/utils';

export default function Profile() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { refreshVPs } = useVP();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [userListings, setUserListings] = useState<GameListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedLocation, setEditedLocation] = useState('');
  const [editedBio, setEditedBio] = useState('');
  const [editedFavoriteGameId, setEditedFavoriteGameId] = useState('');
  const [editedFavoriteGenreId, setEditedFavoriteGenreId] = useState('');

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/signin');
    }
  }, [authLoading, user, router]);

  // Fetch or create user profile
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        console.log('Fetching profile data for user ID:', user.uid);
        
        // Fetch user profile
        let userProfile = await getUserProfile(user.uid);
        console.log('User profile fetched:', userProfile);
        
        // If no profile exists, create a default one
        if (!userProfile) {
          console.log('No profile found, creating a default profile');
          
          // Create a default profile object
          const defaultProfile = {
            name: user.email?.split('@')[0] || 'User',
            email: user.email || '',
            location: '',
            joinedDate: new Date().toISOString(),
            bio: '',
            avatar: '',
            vps: 1, // Start with 1 VP for creating an account
            postCount: 0,
            favoriteGameId: '',
            favoriteGenreId: ''
          };
          
          console.log('Default profile data:', defaultProfile);
          
          try {
            // Update the database with the default profile
            const success = await updateUserProfile(user.uid, defaultProfile);
            
            if (success) {
              console.log('Default profile created successfully');
              // Fetch the profile again
              userProfile = await getUserProfile(user.uid);
              console.log('Newly created profile:', userProfile);
              
              if (!userProfile) {
                // If still null, construct it manually
                console.log('Constructing profile manually after creation');
                userProfile = {
                  id: user.uid,
                  ...defaultProfile
                };
              }
            } else {
              console.error('Failed to create default profile - unknown error');
              setError('We encountered an issue setting up your profile. Please try again.');
            }
          } catch (profileError) {
            console.error('Error creating default profile:', profileError);
            setError('Error creating profile: ' + String(profileError));
          }
        }
        
        // Ensure VP count is updated (adds missing VPs if needed)
        if (userProfile) {
          await updateUserVPs(user.uid);
          // Re-fetch profile to get the updated VP count
          userProfile = await getUserProfile(user.uid);
          // Refresh the VP context so navbar updates too
          refreshVPs();
        }
        
        // Set the profile
        if (userProfile) {
          setProfile(userProfile);
          setEditedName(userProfile.name || '');
          setEditedLocation(userProfile.location || '');
          setEditedBio(userProfile.bio || '');
          setEditedFavoriteGameId(userProfile.favoriteGameId || '');
          setEditedFavoriteGenreId(userProfile.favoriteGenreId || '');
        }
        
        // Fetch user listings
        console.log('Fetching listings for user ID:', user.uid);
        const listings = await getUserListings(user.uid);
        console.log('User listings fetched:', listings);
        setUserListings(listings);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load your profile data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [user, refreshVPs]);

  // Handle profile edit
  const handleSaveProfile = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError('');
      
      const updatedProfile = {
        ...(profile || { id: user.uid }),
        name: editedName,
        location: editedLocation,
        bio: editedBio,
        email: user.email || '',
        favoriteGameId: editedFavoriteGameId,
        favoriteGenreId: editedFavoriteGenreId
      };
      
      console.log('Saving profile with data:', updatedProfile);
      
      try {
        const success = await updateUserProfile(user.uid, updatedProfile);
        
        if (success) {
          console.log('Profile updated successfully');
          
          // Fetch the updated profile to make sure we have the latest data
          const latestProfile = await getUserProfile(user.uid);
          if (latestProfile) {
            setProfile(latestProfile);
          } else {
            console.log('Could not fetch updated profile, using local data');
            setProfile(updatedProfile as UserProfile);
          }
          
          setIsEditing(false);
          setSuccessMessage('Profile updated successfully!');
          
          // Clear success message after 3 seconds
          setTimeout(() => {
            setSuccessMessage('');
          }, 3000);
          
          // Refresh VP data in context
          refreshVPs();
        } else {
          console.error('Failed to update profile - unknown error');
          setError('Failed to update your profile. Please try again.');
        }
      } catch (saveError) {
        console.error('Exception during profile update:', saveError);
        setError('Error saving profile: ' + String(saveError));
      }
    } catch (err) {
      console.error('General error in handleSaveProfile:', err);
      setError('Failed to update your profile. Error: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setLoading(false);
    }
  };

  // Find favorite game and genre objects
  const favoriteGame = popularBoardGames.find(game => game.id === profile?.favoriteGameId);
  const favoriteGenre = boardGameGenres.find(genre => genre.id === profile?.favoriteGenreId);

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

  if (!user) {
    return (
      <main className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-gray-600">Please sign in to view your profile.</p>
        </div>
      </main>
    );
  }

  // Even if profile is null, show the edit form
  if (!profile) {
    return (
      <main className="min-h-screen bg-gray-100">
        <Navbar />
        <Banner />
        
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6">Complete Your Profile</h2>
            
            <p className="mb-4">Let&apos;s set up your profile information:</p>
            
            <div className="flex-grow w-full">
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Name</label>
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Your name"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={user.email || ''}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Default Location</label>
                <LocationDropdown
                  selectedLocation={editedLocation}
                  onChange={setEditedLocation}
                />
                <p className="text-xs text-gray-500 mt-1">This will be used as the default location for your listings</p>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Favorite Board Game</label>
                <BoardGameDropdown
                  selectedGameId={editedFavoriteGameId}
                  onChange={setEditedFavoriteGameId}
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Favorite Game Genre</label>
                <GenreDropdown
                  selectedGenreId={editedFavoriteGenreId}
                  onChange={setEditedFavoriteGenreId}
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Bio</label>
                <textarea
                  value={editedBio}
                  onChange={(e) => setEditedBio(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Tell others about yourself and your board game interests..."
                />
              </div>
              
              <div>
                <button 
                  onClick={handleSaveProfile}
                  className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded"
                >
                  Save Profile
                </button>
              </div>
            </div>
          </div>
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
        
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {successMessage}
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">My Profile</h2>
          
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 relative">
              <Image 
                src={profile?.avatar || '/user-placeholder.jpg'} 
                alt={profile?.name || 'User'} 
                fill
                className="object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://via.placeholder.com/150";
                }}
              />
            </div>
            
            {isEditing ? (
              <div className="flex-grow w-full">
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
                  <label className="block text-gray-700 font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={user.email || ''}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">Default Location</label>
                  <LocationDropdown
                    selectedLocation={editedLocation}
                    onChange={setEditedLocation}
                  />
                  <p className="text-xs text-gray-500 mt-1">This will be used as the default location for your listings</p>
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">Favorite Board Game</label>
                  <BoardGameDropdown
                    selectedGameId={editedFavoriteGameId}
                    onChange={setEditedFavoriteGameId}
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">Favorite Game Genre</label>
                  <GenreDropdown
                    selectedGenreId={editedFavoriteGenreId}
                    onChange={setEditedFavoriteGenreId}
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">Bio</label>
                  <textarea
                    value={editedBio}
                    onChange={(e) => setEditedBio(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Tell others about yourself and your board game interests..."
                  />
                </div>
                
                <div className="flex space-x-2">
                  <button 
                    onClick={handleSaveProfile}
                    className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded"
                  >
                    Save Changes
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
                <div className="flex items-center justify-center md:justify-start mb-2">
                  <h2 className="text-2xl font-bold mr-3">{profile?.name || 'User'}</h2>
                  <VPBadge vps={profile?.vps || 0} size="md" />
                </div>
                <p className="text-gray-600 mb-1">{user.email}</p>
                
                <div className="mt-2">
                  <span className="font-medium">Location: </span>
                  <span>{profile?.location || 'Not specified'}</span>
                </div>
                
                <div className="mt-2">
                  <span className="font-medium">Member since: </span>
                  <span>{profile?.joinedDate ? new Date(profile.joinedDate).toLocaleDateString() : 'Unknown'}</span>
                </div>
                
                <div className="mt-2">
                  <span className="font-medium">Listings: </span>
                  <span>{profile?.postCount || 0}</span>
                </div>
                
                <div className="mt-2">
                  <span className="font-medium">Favorite Game: </span>
                  <span>{favoriteGame?.name || 'Not specified'}</span>
                </div>
                
                <div className="mt-2">
                  <span className="font-medium">Favorite Genre: </span>
                  <span>{favoriteGenre?.name || 'Not specified'}</span>
                </div>
                
                <div className="mt-4">
                  <p className="font-medium mb-1">Bio:</p>
                  <p className="text-gray-700">{profile?.bio || 'No bio provided yet.'}</p>
                </div>
                
                <div className="mt-4">
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded"
                  >
                    Edit Profile
                  </button>
                </div>
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
                listingId={game.id}
                userId={user?.uid}
                title={game.title}
                description={game.description}
                imageUrl={game.imageUrls && game.imageUrls.length > 0 ? game.imageUrls[0] : undefined}
                timeAgo={getTimeAgo(game.createdAt)}
                location={game.location}
                price={game.price}
                tradeOnly={game.tradeOnly}
                type={game.type}
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