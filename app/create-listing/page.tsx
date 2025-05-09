'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useVP } from '@/context/VPContext';
import Navbar from '@/components/Navbar';
import ImageUpload from '@/components/ImageUpload';
import LocationDropdown from '@/components/LocationDropdown';
import BoardGameDropdown from '@/components/BoardGameDropdown';
import { createGameListing } from '@/lib/firestore';
import { uploadGameImages } from '@/lib/storage';
import { getUserProfile } from '@/lib/firestore';
import { conditionOptions, GameListing } from '@/lib/models';

export default function CreateListing() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { refreshVPs } = useVP();
  
  const [title, setTitle] = useState('');
  const [selectedGameId, setSelectedGameId] = useState('');
  const [customGameName, setCustomGameName] = useState('');
  const [description, setDescription] = useState('');
  const [condition, setCondition] = useState('likeNew');
  const [price, setPrice] = useState('');
  const [tradeOnly, setTradeOnly] = useState(false);
  const [type, setType] = useState<'offering' | 'selling' | 'wanting'>('offering');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [userLocation, setUserLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [debug, setDebug] = useState<string[]>([]);

  // Board game selection helper
  const handleBoardGameChange = (gameId: string) => {
    setSelectedGameId(gameId);
    setCustomGameName(''); // Clear custom game when selecting from dropdown
    addDebug(`Selected board game ID: ${gameId}`);
  };
  
  // Custom game creation helper
  const handleCustomGameCreate = (gameName: string) => {
    setSelectedGameId(''); // Clear selected ID since this is a custom game
    setCustomGameName(gameName);
    addDebug(`Created custom game: ${gameName}`);
  };

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin');
    }
  }, [loading, user, router]);

  // Get user location and email
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;
      
      try {
        const profile = await getUserProfile(user.uid);
        addDebug(`Fetched user profile: ${profile ? 'success' : 'not found'}`);
        if (profile && profile.location) {
          setUserLocation(profile.location);
          addDebug(`User location set to: ${profile.location}`);
        } else {
          // Set default location if none found
          setUserLocation('Unknown location');
          addDebug('User location not found, setting default');
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
        addDebug(`Error fetching profile: ${err instanceof Error ? err.message : String(err)}`);
      }
    };
    
    fetchUserProfile();
  }, [user]);

  const addDebug = (message: string) => {
    console.log(`DEBUG: ${message}`);
    setDebug(prev => [...prev, message]);
  };

  const handleImagesChange = (files: File[]) => {
    setImageFiles(files);
    addDebug(`${files.length} images selected`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('You must be logged in to create a listing');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    addDebug('Starting submission process...');
    
    try {
      // Upload images if any were selected
      let finalImageUrls: string[] = [];
      if (imageFiles.length > 0) {
        addDebug(`Uploading ${imageFiles.length} images`);
        try {
          console.log('Starting image uploads to Firebase Storage...');
          finalImageUrls = await uploadGameImages(imageFiles, user.uid);
          console.log('Image uploads completed. URLs:', finalImageUrls);
          addDebug(`${finalImageUrls.length} images uploaded successfully`);
        } catch (uploadError) {
          console.error('Error uploading images:', uploadError);
          console.error('Error details:', JSON.stringify(uploadError, null, 2));
          addDebug(`Image upload failed: ${uploadError instanceof Error ? uploadError.message : String(uploadError)}`);
          setError('Failed to upload images. Please try again.');
          setIsSubmitting(false);
          return;
        }
      } else {
        console.log('No image files selected');
        addDebug('No image files selected');
      }
      
      // Ensure location is set
      const listingLocation = userLocation || 'Unknown location';
      
      // Create base listing data
      type ListingDataType = Omit<GameListing, 'id' | 'createdAt'>;
      type BaseListingDataType = Omit<ListingDataType, 'price' | 'imageUrls'>;
      
      // Start with required fields
      const baseListingData: BaseListingDataType = {
        userId: user.uid,
        userEmail: user.email || '',
        title,
        description,
        condition,
        tradeOnly,
        location: listingLocation,
        type
      };
      
      // Add board game ID if selected or custom name if provided
      if (selectedGameId) {
        baseListingData.boardGameId = selectedGameId;
      } else if (customGameName) {
        baseListingData.boardGameId = `custom:${customGameName}`;
      }
      
      // Add imageUrls only if we have any
      if (finalImageUrls.length > 0) {
        Object.assign(baseListingData, { imageUrls: finalImageUrls });
      }
      
      // Create final listing data with or without price
      const listingData: ListingDataType = price 
        ? { ...baseListingData, price: parseFloat(price) }
        : baseListingData as ListingDataType;
      
      addDebug(`Creating listing with data: ${JSON.stringify(listingData)}`);
      const listingId = await createGameListing(listingData);
      
      if (listingId) {
        addDebug(`Listing created successfully! ID: ${listingId}`);
        
        // Refresh VP data to update navbar
        refreshVPs();

        // Redirect to the appropriate page based on listing type
        const redirectPaths = {
          'offering': '/',  // Offering listings shown on home page
          'wanting': '/looking-for',
          'selling': '/selling'
        };
        
        const redirectPath = redirectPaths[type];
        addDebug(`Redirecting to ${redirectPath}`);
        
        router.push(redirectPath);
      } else {
        addDebug('No listing ID returned from createGameListing');
        setError('Failed to create listing - no ID returned');
      }
    } catch (error) {
      console.error('Error creating listing:', error);
      const errorMsg = error instanceof Error ? error.message : String(error);
      addDebug(`Error in submission: ${errorMsg}`);
      setError(`An error occurred while creating your listing: ${errorMsg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-6">Create New Listing</h1>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Game Images
              </label>
              <ImageUpload
                onImagesChange={handleImagesChange}
                className="mb-2"
                maxImages={5}
              />
              <p className="text-xs text-gray-500">
                Upload clear images of the game. Better photos get more interest! (Up to 5 images)
              </p>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Listing Type
              </label>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    value="offering"
                    checked={type === 'offering'}
                    onChange={() => setType('offering')}
                    className="form-radio text-amber-500"
                  />
                  <span className="ml-2">Offering</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    value="wanting"
                    checked={type === 'wanting'}
                    onChange={() => setType('wanting')}
                    className="form-radio text-amber-500"
                  />
                  <span className="ml-2">Looking for</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    value="selling"
                    checked={type === 'selling'}
                    onChange={() => setType('selling')}
                    className="form-radio text-amber-500"
                  />
                  <span className="ml-2">Selling</span>
                </label>
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
                placeholder="Enter listing title"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Board Game (Optional)
              </label>
              <BoardGameDropdown
                selectedGameId={selectedGameId}
                onChange={handleBoardGameChange}
                onCustomGameCreate={handleCustomGameCreate}
                className="mb-2"
              />
              {customGameName && (
                <div className="mt-2 p-2 bg-green-50 text-green-800 rounded-md">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Using custom game: <strong>{customGameName}</strong></span>
                    <button 
                      type="button" 
                      onClick={() => setCustomGameName('')}
                      className="ml-auto text-green-600 hover:text-green-800"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="mb-4">
              <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="location" className="block text-gray-700 font-medium mb-2">
                Location
              </label>
              <LocationDropdown
                selectedLocation={userLocation}
                onChange={setUserLocation}
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="condition" className="block text-gray-700 font-medium mb-2">
                Condition
              </label>
              <select
                id="condition"
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {conditionOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            {type === 'selling' && (
              <>
                <div className="mb-4">
                  <label htmlFor="price" className="block text-gray-700 font-medium mb-2">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    id="price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required={type === 'selling' && !tradeOnly}
                  />
                </div>
                
                <div className="mb-6">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={tradeOnly}
                      onChange={(e) => setTradeOnly(e.target.checked)}
                      className="form-checkbox text-amber-500"
                    />
                    <span className="ml-2">Trades welcome</span>
                  </label>
                </div>
              </>
            )}
            
            <div className="mt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-medium py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {isSubmitting ? 'Creating...' : 'Create Listing'}
              </button>
            </div>
          </form>
          
          {/* Debug information - only visible in development */}
          {process.env.NODE_ENV === 'development' && debug.length > 0 && (
            <div className="mt-8 p-4 bg-gray-100 rounded-lg text-xs font-mono">
              <h3 className="font-bold mb-2">Debug Info:</h3>
              <ul className="list-disc pl-5">
                {debug.map((msg, i) => (
                  <li key={i}>{msg}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </main>
  );
} 