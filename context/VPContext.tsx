'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getUserProfile } from '@/lib/firestore';

type VPContextType = {
  userVPs: number;
  refreshVPs: () => Promise<void>;
};

const VPContext = createContext<VPContextType | null>(null);

export const VPProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [userVPs, setUserVPs] = useState<number>(0);
  const [hasLoaded, setHasLoaded] = useState(false);

  // Get VP points from localStorage on initial render
  useEffect(() => {
    if (user && !hasLoaded) {
      // Try to get cached VP count from localStorage
      const cachedVPs = localStorage.getItem(`vp_${user.uid}`);
      if (cachedVPs) {
        setUserVPs(parseInt(cachedVPs, 10));
      }
      
      // Then fetch fresh data from Firestore
      refreshVPs();
    } else if (!user) {
      // Reset if user logs out
      setUserVPs(0);
      setHasLoaded(false);
    }
  }, [user]);
  
  const refreshVPs = async () => {
    if (!user) return;
    
    try {
      const profile = await getUserProfile(user.uid);
      if (profile && profile.vps !== undefined) {
        // Only update if different from current value (prevents flashing)
        if (profile.vps !== userVPs) {
          setUserVPs(profile.vps);
          // Cache the value in localStorage
          localStorage.setItem(`vp_${user.uid}`, profile.vps.toString());
        }
      }
      setHasLoaded(true);
    } catch (error) {
      console.error('Error fetching user VPs:', error);
    }
  };

  return (
    <VPContext.Provider value={{ userVPs, refreshVPs }}>
      {children}
    </VPContext.Provider>
  );
};

export const useVP = () => {
  const context = useContext(VPContext);
  if (!context) {
    throw new Error('useVP must be used within a VPProvider');
  }
  return context;
}; 