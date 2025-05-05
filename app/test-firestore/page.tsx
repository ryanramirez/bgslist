'use client';

import React, { useState } from 'react';
import { testFirestore, createGameListing } from '@/lib/firestore';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';

export default function TestFirestore() {
  const { user } = useAuth();
  const [testResult, setTestResult] = useState<string>('');
  const [testStatus, setTestStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [createStatus, setCreateStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [createResult, setCreateResult] = useState<string>('');

  const runFirestoreTest = async () => {
    setTestStatus('loading');
    setTestResult('Running Firestore connection test...');
    try {
      const result = await testFirestore();
      setTestStatus(result ? 'success' : 'error');
      setTestResult(result 
        ? 'Firestore connection successful! ✅ Check console for details.' 
        : 'Firestore connection failed. ❌ Check console for errors.');
    } catch (error) {
      setTestStatus('error');
      setTestResult(`Error: ${error instanceof Error ? error.message : String(error)}`);
      console.error('Test error:', error);
    }
  };

  const createTestListing = async () => {
    if (!user) {
      setCreateStatus('error');
      setCreateResult('You must be logged in to create a test listing.');
      return;
    }

    setCreateStatus('loading');
    setCreateResult('Creating test listing...');
    
    try {
      const testData = {
        userId: user.uid,
        title: 'Test Listing',
        description: 'This is a test listing created to verify Firestore is working',
        condition: 'likeNew',
        price: null,
        tradeOnly: false,
        imageUrl: '/game-placeholder.jpg',
        location: 'Test Location',
        type: 'offering' as const
      };
      
      const listingId = await createGameListing(testData);
      
      setCreateStatus('success');
      setCreateResult(listingId 
        ? `Test listing created successfully! ID: ${listingId} ✅` 
        : 'Failed to create test listing - no ID returned ❌');
    } catch (error) {
      setCreateStatus('error');
      setCreateResult(`Error: ${error instanceof Error ? error.message : String(error)}`);
      console.error('Creation error:', error);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-6">Firestore Diagnostics</h1>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">1. Test Firestore Connection</h2>
            <p className="mb-4 text-gray-700">
              This test will try to write a document to a test collection and then delete it.
            </p>
            
            <button
              onClick={runFirestoreTest}
              disabled={testStatus === 'loading'}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 mb-4"
            >
              {testStatus === 'loading' ? 'Testing...' : 'Test Firestore Connection'}
            </button>
            
            {testResult && (
              <div className={`p-4 rounded-md ${
                testStatus === 'success' ? 'bg-green-100 text-green-800' : 
                testStatus === 'error' ? 'bg-red-100 text-red-800' : 
                'bg-gray-100 text-gray-800'
              }`}>
                {testResult}
              </div>
            )}
          </div>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">2. Create Test Listing</h2>
            <p className="mb-4 text-gray-700">
              This will attempt to create a test listing in the gameListings collection.
            </p>
            
            <button
              onClick={createTestListing}
              disabled={createStatus === 'loading' || !user}
              className="bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-50 mb-4"
            >
              {createStatus === 'loading' ? 'Creating...' : 'Create Test Listing'}
            </button>
            
            {!user && (
              <div className="text-amber-600 mb-4">
                You need to be logged in to create a test listing.
              </div>
            )}
            
            {createResult && (
              <div className={`p-4 rounded-md ${
                createStatus === 'success' ? 'bg-green-100 text-green-800' : 
                createStatus === 'error' ? 'bg-red-100 text-red-800' : 
                'bg-gray-100 text-gray-800'
              }`}>
                {createResult}
              </div>
            )}
          </div>
          
          <div className="text-sm text-gray-500">
            <p>Check your browser console (F12) for detailed logs and errors.</p>
            <p className="mt-2">
              Firebase Project ID: <code>{process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'Not configured'}</code>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
} 