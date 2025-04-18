'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Pencil, LogOut, Settings, BookOpen } from 'lucide-react';
import { useUser } from '../../../contexts/UserContext';
import Logo from '../Logo';
const AuthNav = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const {logout , user} = useUser()

  const handleLogout = ()=>{
setMenuOpen(false);
logout()
  }
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-gray-900 text-white shadow-lg relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center relative">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/auth">
              <Logo/>
            </Link>
          </div>


          {/* Profile & Actions */}
          <div className="flex items-center space-x-4">
            {/* Write Blog Button (Responsive) */}
            <button className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg hidden lg:flex items-center">
              <Link href="/auth/articles/create" className="lg:flex items-center">
              <Pencil className="h-5 w-5 mr-2" />
              Write Blog
              </Link>
            </button>

            {/* Mobile & Tablet Button (Icon Only) */}
            <button className="bg-indigo-500 hover:bg-indigo-600 text-white p-2 rounded-lg lg:hidden">
              <Pencil className="h-5 w-5" />
            </button>

            {/* Profile Image + Dropdown Menu */}
            <div className="relative" ref={menuRef}>
              <button
                className="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-white"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <Image
                  className="h-8 w-8 rounded-full"
                  src={user?.img || ""}
                  alt="User Profile"
                  width={32}
                  height={32}
                />
              </button>

              {/* Dropdown Menu */}
              {menuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white text-black rounded-md shadow-lg py-2 z-50">
                  <Link href="/stories" className="flex hover:bg-gray-300 transition items-center px-4 py-2 text-sm cursor-pointer">
                    <BookOpen className="w-4 h-4 mr-2" /> Stories
                  </Link>
                  <Link href="/settings" className="flex hover:bg-gray-300 transition items-center px-4 py-2 text-sm cursor-pointer">
                    <Settings className="w-4 h-4 mr-2" /> Settings
                  </Link>
                  <button 
                  onClick={()=> handleLogout()}
                  className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-300 w-full text-left cursor-pointer">
                    <LogOut className="w-4 h-4 mr-2" /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AuthNav;
