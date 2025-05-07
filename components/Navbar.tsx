'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useVP } from '@/context/VPContext';
import { useRouter } from 'next/navigation';
import VPBadge from './VPBadge';

type NavLinkProps = {
  href: string;
  isActive?: boolean;
  children: React.ReactNode;
};

const NavLink = ({ href, isActive, children }: NavLinkProps) => {
  return (
    <Link href={href}>
      <span className={`px-4 py-2 text-lg ${isActive ? 'border-b-4 border-white font-semibold' : 'text-white/80 hover:text-white'}`}>
        {children}
      </span>
    </Link>
  );
};

type NavbarProps = {
  activePage?: 'offering' | 'looking' | 'selling';
};

export default function Navbar({ activePage = 'offering' }: NavbarProps) {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { userVPs } = useVP();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Handle logout
  const handleLogout = async () => {
    await signOut();
    setDropdownOpen(false);
    router.push('/');
  };

  return (
    <nav className="flex items-center justify-between px-4 py-2 bg-amber-600">
      <div className="flex items-center">
        <Link href="/" className="flex items-center">
          {/* <Image src="/bgslist-logo.png" alt="BGSLIST Logo" width={32} height={32} className="mr-2" /> */}  
          <span className="font-pixelify-sans text-xl font-bold text-white">BGSLIST</span>
        </Link>
      </div>
      
      <div className="flex space-x-4">
        <NavLink href="/" isActive={activePage === 'offering'}>
          Offering
        </NavLink>
        <NavLink href="/looking-for" isActive={activePage === 'looking'}>
          Looking for
        </NavLink>
        <NavLink href="/selling" isActive={activePage === 'selling'}>
          Selling
        </NavLink>
      </div>
      
      <div className="flex items-center space-x-4">
        {user ? (
          <>
            <Link href="/create-listing">
              <span className="text-white hover:text-white/80">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </span>
            </Link>
            
            {/* VP Badge */}
            <VPBadge vps={userVPs} size="sm" />
            
            {/* Profile dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="text-white hover:text-white/80 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
              
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                  <div className="py-1">
                    <Link href="/profile">
                      <span className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Profile
                      </span>
                    </Link>
                    <Link href="/my-listings">
                      <span className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        My Listings
                      </span>
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <Link href="/auth/signin">
            <span className="text-white hover:text-white/80 px-3 py-1 border border-white rounded">
              Sign In
            </span>
          </Link>
        )}
      </div>
    </nav>
  );
} 