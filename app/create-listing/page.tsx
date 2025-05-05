'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import ImageUpload from '@/components/ImageUpload';
import { createGameListing } from '@/lib/firestore';
import { uploadGameImage } from '@/lib/storage';
import { getUserProfile } from '@/lib/firestore';
import { conditionOptions } from '@/lib/models';

export default function CreateListing() {
  const router = useRouter();
  const { user, loading } = useAuth();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [condition, setCondition] = useState('likeNew');
  const [price, setPrice] = useState('');
  const [tradeOnly, setTradeOnly] = useState(false);
  const [type, setType] = useState<'offering' | 'selling' | 'wanting'>('offering');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState('/game-placeholder.jpg');
  const [userLocation, setUserLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin');
    }
  }, [loading, user, router]);

  // Get user location
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;
      
      try {
        const profile = await getUserProfile(user.uid);
        if (profile && profile.location) {
          setUserLocation(profile.location);
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
      }
    };
    
    fetchUserProfile();
  }, [user]);

  const handleImageChange = (file: File) => {
    setImageFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('You must be logged in to create a listing');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      // Upload image if one was selected
      let finalImageUrl = imageUrl;
      if (imageFile) {
        finalImageUrl = await uploadGameImage(imageFile, user.uid);
      }
      
      const listingData = {
        userId: user.uid,
        title,
        description,
        condition,
        price: price ? parseFloat(price) : undefined,
        tradeOnly,
        imageUrl: finalImageUrl,
        location: userLocation,
        type
      };
      
      const listingId = await createGameListing(listingData);
      
      if (listingId) {
        router.push('/profile');
      } else {
        setError('Failed to create listing');
      }
    } catch (error) {
      console.error('Error creating listing:', error);
      setError('An error occurred while creating your listing');
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
                Game Image
              </label>
              <ImageUpload
                initialImage={imageUrl}
                onImageChange={handleImageChange}
                className="mb-2"
              />
              <p className="text-xs text-gray-500">
                Upload a clear image of the game. Better photos get more interest!
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
                  <span className="ml-2">Offering for Trade</span>
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
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    value="wanting"
                    checked={type === 'wanting'}
                    onChange={() => setType('wanting')}
                    className="form-radio text-amber-500"
                  />
                  <span className="ml-2">Wanting</span>
                </label>
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
                Game Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
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
            )}
            
            {(type === 'offering' || type === 'selling') && (
              <div className="mb-6">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={tradeOnly}
                    onChange={(e) => setTradeOnly(e.target.checked)}
                    className="form-checkbox text-amber-500"
                  />
                  <span className="ml-2">Trade Only (No Cash)</span>
                </label>
              </div>
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
        </div>
      </div>
    </main>
  );
} 