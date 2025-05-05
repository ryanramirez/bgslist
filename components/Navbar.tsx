'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';

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
  const { user, signOut } = useAuth();

  return (
    <nav className="flex items-center justify-between px-4 py-2 bg-amber-600">
      <div className="flex items-center">
        <Link href="/" className="flex items-center">
          <Image src="/bgslist-logo.png" alt="BGSLIST Logo" width={32} height={32} className="mr-2" />
          <span className="text-xl font-bold text-white">BGSLIST</span>
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
            <Link href="/profile">
              <span className="text-white hover:text-white/80">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </span>
            </Link>
            <button 
              onClick={() => signOut()}
              className="text-white hover:text-white/80"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
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