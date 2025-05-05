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
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { GameListing, UserProfile } from './models';

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
    await updateDoc(doc(db, 'users', userId), data);
    return true;
  } catch (error) {
    console.error('Error updating user profile:', error);
    return false;
  }
};

// Game listing functions
export const createGameListing = async (data: Omit<GameListing, 'id' | 'createdAt'>): Promise<string | null> => {
  try {
    const listingData = {
      ...data,
      createdAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, 'gameListings'), listingData);
    return docRef.id;
  } catch (error) {
    console.error('Error creating game listing:', error);
    return null;
  }
};

export const updateGameListing = async (listingId: string, data: Partial<GameListing>): Promise<boolean> => {
  try {
    await updateDoc(doc(db, 'gameListings', listingId), data);
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