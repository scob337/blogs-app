'use client';

import Link from 'next/link';
import Logo from '../Logo';

const Footer = () => {
  return (
    <footer>
      <div className="bg-[#090E34] py-6 text-gray-400">
        <div className="container px-6 mx-auto">
          <div className="-mx-4 flex flex-wrap justify-between">
            <div className="px-4 my-4 w-full xl:w-1/4">
            <Logo/>
              <p className="text-justify">
                Gspot is a modern blogging platform that provides rich and diverse content 
                in various fields, allowing writers to share their thoughts and inspiring articles with everyone.
              </p>
            </div>

            <div className="px-4 my-4 w-full sm:w-auto">
              <h2 className="text-xl pb-3 mb-3 border-b-4 border-blue-600">Explore</h2>
              <ul className="leading-8">
                <li><Link href="/categories" className="hover:text-blue-400">Categories</Link></li>
                <li><Link href="/popular" className="hover:text-blue-400">Popular Articles</Link></li>
                <li><Link href="/authors" className="hover:text-blue-400">Authors</Link></li>
                <li><Link href="/about" className="hover:text-blue-400">About Us</Link></li>
              </ul>
            </div>

            <div className="px-4 my-4 w-full sm:w-auto">
              <h2 className="text-xl pb-3 mb-3 border-b-4 border-blue-600">Latest Articles</h2>
              <ul className="leading-8">
                <li><Link href="/article/html-css" className="hover:text-blue-400">{"Beginner's"} Guide to HTML & CSS</Link></li>
                <li><Link href="/article/flexbox" className="hover:text-blue-400">What is Flexbox and How to Use It?</Link></li>
                <li><Link href="/article/tailwindcss" className="hover:text-blue-400">How TailwindCSS Boosts Productivity?</Link></li>
                <li><Link href="/article/responsive-tips" className="hover:text-blue-400">5 Tips for a Responsive Website</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[#060A24] py-4 text-gray-100 text-center">
        <p>&copy; {new Date().getFullYear()} Gspot. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
