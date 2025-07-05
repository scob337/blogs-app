'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Pencil, LogOut, Settings, BookOpen, User, Search, Menu, X } from 'lucide-react';
import { useUser } from '../../../contexts/UserContext';
import Logo from '../Logo';
import Notifications from './Noti';
const AuthNav = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const menuRef = useRef<HTMLDivElement>(null);
  const {logout, user} = useUser();

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
  };
  
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
  
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  return (
    <header className={`w-full shadow-sm sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white text-gray-800 py-2' : 'bg-gradient-to-r from-indigo-600 to-indigo-800 text-white py-3'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/auth" className="flex-shrink-0">
              <Logo />
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1 mr-4 rtl:space-x-reverse rtl:ml-4 rtl:mr-0">
              <Link 
                href="/auth" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${scrolled ? 'text-gray-700 hover:text-indigo-600 hover:bg-gray-100' : 'text-white hover:bg-indigo-500'}`}
              >
                الرئيسية
              </Link>
              <Link 
                href="/stories" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${scrolled ? 'text-gray-700 hover:text-indigo-600 hover:bg-gray-100' : 'text-white hover:bg-indigo-500'}`}
              >
                المقالات
              </Link>
              <Link 
                href="/authors" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${scrolled ? 'text-gray-700 hover:text-indigo-600 hover:bg-gray-100' : 'text-white hover:bg-indigo-500'}`}
              >
                الكتّاب
              </Link>
            </nav>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            {/* Search Button */}
            <button 
              onClick={() => setSearchOpen(!searchOpen)}
              className={`p-2 rounded-full transition-colors ${scrolled ? 'hover:bg-gray-100 text-gray-600' : 'hover:bg-indigo-500 text-white'}`}
            >
              <Search className="w-5 h-5" />
            </button>
            
            {/* Notifications */}
            <div className="relative">
              <Notifications />
            </div>
            
            {/* Write Blog Button */}
            <Link 
              href="/auth/articles/create" 
              className={`hidden md:flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${scrolled ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-white text-indigo-600 hover:bg-gray-100'}`}
            >
              <Pencil className="h-4 w-4 ml-2 rtl:mr-0" />
              اكتب مقالاً
            </Link>

            {/* Mobile Write Button (Icon Only) */}
            <Link 
              href="/auth/articles/create" 
              className={`md:hidden p-2 rounded-lg transition-colors ${scrolled ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-white text-indigo-600 hover:bg-gray-100'}`}
            >
              <Pencil className="h-5 w-5" />
            </Link>

            {/* Profile Image + Dropdown Menu */}
            <div className="relative" ref={menuRef}>
              <button
                className={`flex text-sm rounded-full focus:outline-none ${scrolled ? 'focus:ring-2 focus:ring-indigo-500' : 'focus:ring-2 focus:ring-white'}`}
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <Image
                  className="h-8 w-8 rounded-full object-cover border-2 border-white shadow-sm"
                  src={user?.img || "/placeholder-avatar.jpg"}
                  alt={`${user?.fName || 'User'} Profile`}
                  width={32}
                  height={32}
                />
              </button>

              {/* Dropdown Menu */}
              {menuOpen && (
                <div className="absolute left-0 rtl:right-0 rtl:left-auto top-full mt-2 w-56 bg-white text-black rounded-md shadow-lg py-2 z-50 animate-fade-in-down">
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{user?.fName} {user?.lName}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  </div>
                  
                  {/* User Profile Link */}
                  {user && (
                    <Link href={`/author/${user.id}`} className="flex hover:bg-gray-100 transition items-center px-4 py-2 text-sm cursor-pointer">
                      <User className="w-4 h-4 ml-2 rtl:mr-2 rtl:ml-0" /> الملف الشخصي
                    </Link>
                  )}
                  
                  <Link href="/stories" className="flex hover:bg-gray-100 transition items-center px-4 py-2 text-sm cursor-pointer">
                    <BookOpen className="w-4 h-4 ml-2 rtl:mr-2 rtl:ml-0" /> المقالات
                  </Link>
                  <Link href="/settings" className="flex hover:bg-gray-100 transition items-center px-4 py-2 text-sm cursor-pointer">
                    <Settings className="w-4 h-4 ml-2 rtl:mr-2 rtl:ml-0" /> الإعدادات
                  </Link>
                  <button 
                    onClick={() => handleLogout()}
                    className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-right rtl:text-right cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 ml-2 rtl:mr-2 rtl:ml-0" /> تسجيل الخروج
                  </button>
                </div>
              )}
            </div>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-md focus:outline-none"
              aria-expanded={mobileMenuOpen}
            >
              <span className="sr-only">افتح القائمة</span>
              {mobileMenuOpen ? (
                <X className={`h-6 w-6 ${scrolled ? 'text-gray-800' : 'text-white'}`} />
              ) : (
                <Menu className={`h-6 w-6 ${scrolled ? 'text-gray-800' : 'text-white'}`} />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Search Bar - Conditional Rendering */}
      {searchOpen && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-md p-4 animate-slide-down">
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="ابحث عن مقالات، كتّاب، مواضيع..."
                className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
          </div>
        </div>
      )}
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t border-gray-200 animate-slide-down">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              href="/auth"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              الرئيسية
            </Link>
            <Link
              href="/stories"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              المقالات
            </Link>
            <Link
              href="/authors"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              الكتّاب
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default AuthNav;
