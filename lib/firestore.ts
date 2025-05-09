import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp,
  Timestamp,
  increment
} from 'firebase/firestore';
import { db } from './firebase';
import { GameListing, UserProfile } from './models';
import { updateProfileVPs } from './points';

// Debug function to check Firestore connection
export const testFirestore = async (): Promise<boolean> => {
  try {
    console.log('Testing Firestore connection...');
    console.log('Firestore initialized with:', db);
    
    // Try to write to a test collection
    const testData = { test: true, timestamp: serverTimestamp() };
    
    // Log that we're about to create a document
    console.log('Attempting to create test document with data:', testData);
    
    const docRef = await addDoc(collection(db, 'test_collection'), testData);
    
    console.log('Test document created successfully with ID:', docRef.id);
    
    // Delete the test document to clean up
    await deleteDoc(docRef);
    
    console.log('Test document deleted successfully');
    return true;
  } catch (error) {
    console.error('Error testing Firestore:', error);
    return false;
  }
};

// User profile functions
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return { id: userDoc.id, ...userDoc.data() } as UserProfile;
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

export const updateUserProfile = async (userId: string, data: Partial<UserProfile>): Promise<boolean> => {
  try {
    console.log('Updating user profile for:', userId, 'with data:', data);
    
    // Check if the user document exists
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      // Update existing document
      console.log('User document exists, updating it');
      await updateDoc(userDocRef, data);
    } else {
      // Create a new document if it doesn't exist
      console.log('User document does not exist, creating it');
      const timestamp = serverTimestamp();
      const newUserData = {
        ...data,
        joinedDate: data.joinedDate || timestamp,
        vps: data.vps || 1, // 1 point for creating an account
        postCount: data.postCount || 0
      };
      
      // Import setDoc if not already imported
      const { setDoc } = await import('firebase/firestore');
      await setDoc(userDocRef, newUserData);
    }
    
    console.log('User profile updated successfully');
    return true;
  } catch (error) {
    console.error('Error updating user profile:', error);
    console.error('Error details:', JSON.stringify(error));
    return false;
  }
};

// Update user VPs
export const updateUserVPs = async (userId: string): Promise<boolean> => {
  try {
    // Get user profile
    const profile = await getUserProfile(userId);
    if (!profile) return false;
    
    // Get user listings to count posts
    const listings = await getUserListings(userId);
    
    // For now, we don't have a rating system, so highRatedListings is 0
    // This will be updated once we implement listing ratings
    const highRatedListings = 0;
    
    // Calculate updated profile with VPs
    const updatedProfile = updateProfileVPs(profile, listings, highRatedListings);
    
    // Update the profile in Firestore
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, { 
      vps: updatedProfile.vps,
      postCount: updatedProfile.postCount 
    });
    
    return true;
  } catch (error) {
    console.error('Error updating user VPs:', error);
    return false;
  }
};

// Increment user's post count and recalculate VPs
export const incrementUserPostCount = async (userId: string): Promise<boolean> => {
  try {
    const userDocRef = doc(db, 'users', userId);
    
    // Get current profile to check milestone achievements
    const profile = await getUserProfile(userId);
    if (!profile) return false;
    
    // Calculate current post count and vps
    const currentPostCount = profile.postCount || 0;
    const newPostCount = currentPostCount + 1;
    
    // Check if we've reached a milestone for VP awards
    const oldVPs = profile.vps || 1; // Default 1 for account creation
    let vpDelta = 0;
    
    if (newPostCount === 1) vpDelta = 1; // 1st post
    else if (newPostCount === 2) vpDelta = 2; // 2nd post
    else if (newPostCount === 3) vpDelta = 3; // 3rd post
    else if (newPostCount === 4) vpDelta = 4; // 4th post
    else if (newPostCount === 5) vpDelta = 5; // 5th post
    else if (newPostCount === 10) vpDelta = 10; // 10th post (3 -> 5)
    
    // Update the document
    await updateDoc(userDocRef, { 
      postCount: increment(1),
      vps: oldVPs + vpDelta
    });
    
    return true;
  } catch (error) {
    console.error('Error incrementing post count:', error);
    return false;
  }
};

// Game listing functions
export const createGameListing = async (data: Omit<GameListing, 'id' | 'createdAt'>): Promise<string | null> => {
  try {
    console.log('Creating game listing with data:', data);
    console.log('Listing type:', data.type);
    
    // Make sure we handle undefined values
    const cleanedData = {
      ...data,
      title: data.title || 'Untitled Listing',
      description: data.description || 'No description provided',
      condition: data.condition || 'unknown',
      location: data.location || 'Unknown location',
      type: data.type || 'offering',
      userId: data.userId,
      tradeOnly: !!data.tradeOnly,
      createdAt: serverTimestamp(),
      starCount: 0,
      starredBy: []
    };
    
    // Only include imageUrl if it exists in the data
    if ('imageUrl' in data && data.imageUrl) {
      cleanedData.imageUrl = data.imageUrl;
    }
    
    console.log('Cleaned game listing data:', cleanedData);
    console.log('Creating game listing collection if it doesn\'t exist');
    const gameListingsRef = collection(db, 'gameListings');
    
    console.log('Adding document to gameListings collection');
    const docRef = await addDoc(gameListingsRef, cleanedData);
    
    console.log('Game listing created with ID:', docRef.id);
    
    // Increment user's post count and update VPs
    await incrementUserPostCount(data.userId);
    
    // Verify the document was created
    const createdDoc = await getDoc(docRef);
    console.log('Created document exists:', createdDoc.exists());
    console.log('Created document data:', createdDoc.data());
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating game listing:', error);
    throw error; // Re-throw to ensure the error is propagated
  }
};

export const updateGameListing = async (listingId: string, data: Partial<GameListing>): Promise<boolean> => {
  try {
    // First, get the existing listing to preserve star data if not provided
    const listingRef = doc(db, 'gameListings', listingId);
    const existingListing = await getDoc(listingRef);
    
    if (!existingListing.exists()) {
      console.error('Listing not found for update:', listingId);
      return false;
    }
    
    // Extract existing star data
    const existingData = existingListing.data();
    const starCount = existingData.starCount || 0;
    const starredBy = existingData.starredBy || [];
    
    // Only override star data if explicitly provided in update
    const updateData = {
      ...data,
      starCount: data.starCount !== undefined ? data.starCount : starCount,
      starredBy: data.starredBy !== undefined ? data.starredBy : starredBy,
    };
    
    await updateDoc(listingRef, updateData);
    return true;
  } catch (error) {
    console.error('Error updating game listing:', error);
    return false;
  }
};

export const deleteGameListing = async (listingId: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, 'gameListings', listingId));
    return true;
  } catch (error) {
    console.error('Error deleting game listing:', error);
    return false;
  }
};

export const getGameListing = async (listingId: string): Promise<GameListing | null> => {
  try {
    const listingDoc = await getDoc(doc(db, 'gameListings', listingId));
    if (listingDoc.exists()) {
      const data = listingDoc.data();
      // Convert Firestore timestamp to string
      const createdAt = data.createdAt instanceof Timestamp 
        ? data.createdAt.toDate().toISOString() 
        : new Date().toISOString();
        
      return { 
        id: listingDoc.id, 
        ...data, 
        createdAt 
      } as GameListing;
    }
    return null;
  } catch (error) {
    console.error('Error getting game listing:', error);
    return null;
  }
};

export const getUserListings = async (userId: string, type?: 'offering' | 'selling' | 'wanting'): Promise<GameListing[]> => {
  try {
    let q;
    if (type) {
      q = query(
        collection(db, 'gameListings'), 
        where('userId', '==', userId),
        where('type', '==', type),
        orderBy('createdAt', 'desc')
      );
    } else {
      q = query(
        collection(db, 'gameListings'), 
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      // Convert Firestore timestamp to string
      const createdAt = data.createdAt instanceof Timestamp 
        ? data.createdAt.toDate().toISOString() 
        : new Date().toISOString();
        
      return { 
        id: doc.id, 
        ...data, 
        createdAt 
      } as GameListing;
    });
  } catch (error) {
    console.error('Error getting user listings:', error);
    return [];
  }
};

export const getAllListings = async (type: 'offering' | 'selling' | 'wanting'): Promise<GameListing[]> => {
  try {
    const q = query(
      collection(db, 'gameListings'), 
      where('type', '==', type),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      // Convert Firestore timestamp to string
      const createdAt = data.createdAt instanceof Timestamp 
        ? data.createdAt.toDate().toISOString() 
        : new Date().toISOString();
        
      return { 
        id: doc.id, 
        ...data, 
        createdAt 
      } as GameListing;
    });
  } catch (error) {
    console.error('Error getting listings:', error);
    return [];
  }
};

// Star/Unstar functions
export const starGameListing = async (listingId: string, userId: string): Promise<boolean> => {
  try {
    console.log(`User ${userId} starring listing ${listingId}`);
    
    // Get the current listing to check if it's already starred
    const listingDoc = await getDoc(doc(db, 'gameListings', listingId));
    if (!listingDoc.exists()) {
      console.error('Listing not found');
      return false;
    }
    
    const listingData = listingDoc.data();
    const starredBy = listingData.starredBy || [];
    
    // If already starred, don't process again
    if (starredBy.includes(userId)) {
      console.log('User already starred this listing');
      return true;
    }
    
    // Add user to starredBy array and increment count
    await updateDoc(doc(db, 'gameListings', listingId), {
      starredBy: [...starredBy, userId],
      starCount: increment(1)
    });
    
    console.log('Listing starred successfully');
    return true;
  } catch (error) {
    console.error('Error starring game listing:', error);
    return false;
  }
};

export const unstarGameListing = async (listingId: string, userId: string): Promise<boolean> => {
  try {
    console.log(`User ${userId} unstarring listing ${listingId}`);
    
    // Get the current listing to check if it's starred
    const listingDoc = await getDoc(doc(db, 'gameListings', listingId));
    if (!listingDoc.exists()) {
      console.error('Listing not found');
      return false;
    }
    
    const listingData = listingDoc.data();
    const starredBy = listingData.starredBy || [];
    
    // If not starred, don't process
    if (!starredBy.includes(userId)) {
      console.log('User had not starred this listing');
      return true;
    }
    
    // Remove user from starredBy array and decrement count
    await updateDoc(doc(db, 'gameListings', listingId), {
      starredBy: starredBy.filter((id: string) => id !== userId),
      starCount: increment(-1)
    });
    
    console.log('Listing unstarred successfully');
    return true;
  } catch (error) {
    console.error('Error unstarring game listing:', error);
    return false;
  }
};

export const hasUserStarredListing = async (listingId: string, userId: string): Promise<boolean> => {
  try {
    if (!userId) return false;
    
    const listingDoc = await getDoc(doc(db, 'gameListings', listingId));
    if (!listingDoc.exists()) return false;
    
    const listingData = listingDoc.data();
    const starredBy = listingData.starredBy || [];
    
    return starredBy.includes(userId);
  } catch (error) {
    console.error('Error checking if user starred listing:', error);
    return false;
  }
}; 