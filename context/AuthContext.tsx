'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  sendPasswordResetEmail,
  User
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { updateUserProfile } from '@/lib/firestore';

type SignUpData = {
  email: string;
  name: string;
  location?: string;
  favoriteGameId?: string;
  favoriteGenreId?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, profileData: SignUpData) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, profileData: SignUpData) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Initialize user profile with VP points
    if (userCredential.user) {
      const newUser = userCredential.user;
      await updateUserProfile(newUser.uid, {
        name: profileData.name || email.split('@')[0] || 'User',
        email: email,
        joinedDate: new Date().toISOString(),
        vps: 1, // 1 point for creating an account
        postCount: 0,
        location: profileData.location || '',
        bio: '',
        avatar: '',
        favoriteGameId: profileData.favoriteGameId || '',
        favoriteGenreId: profileData.favoriteGenreId || ''
      });
    }
  };

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 