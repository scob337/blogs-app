"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import Logo from "../Logo";
import { Menu, X, ChevronDown, Search } from "lucide-react";

const Links = [
  { id: 1, name: "الرئيسية", href: "/" },
  { id: 2, name: "من نحن", href: "/about" },
  { id: 3, name: "المقالات", href: "/stories" },
  { id: 4, name: "الكتّاب", href: "/authors" },
  { id: 5, name: "اكتب مقالاً", href: "/auth" },
];


const UnAuthNavbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

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
    <header className={`w-full shadow-sm sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white text-gray-800 py-2' : 'bg-gradient-to-r from-indigo-600 to-indigo-800 text-white py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <Logo />
            </Link>
          </div>

          <nav className="hidden lg:flex items-center space-x-1 rtl:space-x-reverse">
            <ul className="flex space-x-8 rtl:space-x-reverse">
              {Links.map((link) => (
                <li key={link.id}>
                  <Link
                    href={link.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${scrolled ? 'text-gray-700 hover:text-indigo-600 hover:bg-gray-100' : 'text-white hover:bg-indigo-500'}`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="hidden lg:flex items-center space-x-4 rtl:space-x-reverse">
            <button 
              onClick={() => setSearchOpen(!searchOpen)}
              className={`p-2 rounded-full transition-colors ${scrolled ? 'hover:bg-gray-100 text-gray-600' : 'hover:bg-indigo-500 text-white'}`}
            >
              <Search className="w-5 h-5" />
            </button>
            
            <Link 
              href="/login" 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${scrolled ? 'text-indigo-600 border border-indigo-600 hover:bg-indigo-50' : 'text-white border border-white hover:bg-indigo-500'}`}
            >
              تسجيل الدخول
            </Link>
            
            <Link 
              href="/register" 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${scrolled ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-white text-indigo-600 hover:bg-gray-100'}`}
            >
              إنشاء حساب
            </Link>
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden p-2 rounded-md focus:outline-none"
            aria-expanded={open}
          >
            <span className="sr-only">افتح القائمة</span>
            {open ? (
              <X className={`h-6 w-6 ${scrolled ? 'text-gray-800' : 'text-white'}`} />
            ) : (
              <Menu className={`h-6 w-6 ${scrolled ? 'text-gray-800' : 'text-white'}`} />
            )}
          </button>
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
      {open && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t border-gray-200 animate-slide-down">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {Links.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
                onClick={() => setOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="px-4 flex items-center justify-between">
              <div className="flex flex-col space-y-3">
                <Link
                  href="/login"
                  className="block w-full px-4 py-2 text-center rounded-md text-indigo-600 bg-white border border-indigo-600 hover:bg-indigo-50 transition-colors"
                  onClick={() => setOpen(false)}
                >
                  تسجيل الدخول
                </Link>
                <Link
                  href="/register"
                  className="block w-full px-4 py-2 text-center rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                  onClick={() => setOpen(false)}
                >
                  إنشاء حساب
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default UnAuthNavbar;



