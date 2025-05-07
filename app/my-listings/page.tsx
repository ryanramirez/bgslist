'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Banner from '@/components/Banner';
import { useAuth } from '@/context/AuthContext';
import { getUserListings, deleteGameListing } from '@/lib/firestore';
import { GameListing } from '@/lib/models';

export default function MyListings() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [userListings, setUserListings] = useState<GameListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [lastRefresh] = useState(Date.now());

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/signin');
    }
  }, [authLoading, user, router]);

  // Fetch user listings
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        console.log('Fetching listings for user ID:', user.uid);
        const listings = await getUserListings(user.uid);
        console.log('User listings fetched:', listings);
        setUserListings(listings);
      } catch (err) {
        console.error('Error fetching user listings:', err);
        setError('Failed to load your listings');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [user, lastRefresh]);

  const handleDeleteListing = async (listingId: string) => {
    if (!user) return;
    
    try {
      setDeletingId(listingId);
      const success = await deleteGameListing(listingId);
      
      if (success) {
        setUserListings(prevListings => prevListings.filter(listing => listing.id !== listingId));
        setSuccessMessage('Listing deleted successfully!');
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      } else {
        setError('Failed to delete the listing. Please try again.');
      }
    } catch (err) {
      console.error('Error deleting listing:', err);
      setError('Failed to delete the listing');
    } finally {
      setDeletingId(null);
    }
  };

  const getListingTypeLabel = (type: string) => {
    switch (type) {
      case 'offering':
        return 'Offering';
      case 'wanting':
        return 'Looking for';
      case 'selling':
        return 'Selling';
      default:
        return type;
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

  if (!user) {
    return (
      <main className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-gray-600">Please sign in to view your listings.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <Navbar />
      <Banner />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">My Listings</h1>
        
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
        
        <div className="mb-4">
          <button 
            onClick={() => router.push('/create-listing')}
            className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create New Listing
          </button>
        </div>
        
        {userListings.length > 0 ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Listing
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date Added
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {userListings.map(listing => (
                  <tr key={listing.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {listing.imageUrl && (
                          <div className="flex-shrink-0 h-10 w-10 mr-4 relative">
                            <Image 
                              className="rounded object-cover" 
                              src={listing.imageUrl} 
                              alt={listing.title}
                              fill
                              sizes="40px"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = "https://via.placeholder.com/40?text=BG";
                              }}
                            />
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {listing.title}
                          </div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {listing.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        listing.type === 'offering' ? 'bg-green-100 text-green-800' : 
                        listing.type === 'wanting' ? 'bg-blue-100 text-blue-800' : 
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {getListingTypeLabel(listing.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {listing.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(listing.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDeleteListing(listing.id)}
                        disabled={deletingId === listing.id}
                        className="text-red-600 hover:text-red-900 ml-4 disabled:opacity-50"
                      >
                        {deletingId === listing.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-gray-500 mb-4">You don&apos;t have any listings yet.</p>
            <button
              onClick={() => router.push('/create-listing')}
              className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded"
            >
              Create Your First Listing
            </button>
          </div>
        )}
      </div>
    </main>
  );
} 