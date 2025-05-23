'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import LocationDropdown from '@/components/LocationDropdown';
import BoardGameDropdown from '@/components/BoardGameDropdown';
import GenreDropdown from '@/components/GenreDropdown';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [favoriteGameId, setFavoriteGameId] = useState('');
  const [favoriteGenreId, setFavoriteGenreId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const { signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Sign up the user with profile data
      await signUp(email, password, {
        email,
        name,
        location,
        favoriteGameId,
        favoriteGenreId
      });
      
      router.push('/profile');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to sign up';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Create an Account</h2>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="location" className="block text-gray-700 font-medium mb-2">
                Location
              </label>
              <LocationDropdown
                selectedLocation={location}
                onChange={setLocation}
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="favoriteGame" className="block text-gray-700 font-medium mb-2">
                Favorite Board Game <span className="text-gray-500 text-sm">(Optional)</span>
              </label>
              <BoardGameDropdown
                selectedGameId={favoriteGameId}
                onChange={setFavoriteGameId}
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="favoriteGenre" className="block text-gray-700 font-medium mb-2">
                Favorite Game Genre <span className="text-gray-500 text-sm">(Optional)</span>
              </label>
              <GenreDropdown
                selectedGenreId={favoriteGenreId}
                onChange={setFavoriteGenreId}
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
                minLength={6}
              />
              <p className="mt-1 text-sm text-gray-500">Password must be at least 6 characters</p>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link href="/auth/signin" className="text-amber-600 hover:text-amber-800 font-medium">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
} 