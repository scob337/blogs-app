'use client';

import Link from 'next/link';
import Logo from '../Logo';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-indigo-900 to-indigo-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and About */}
          <div className="space-y-4">
            <div className="mb-4">
              <Logo />
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              منصة المدونات العربية هي منصة حديثة للتدوين توفر محتوى غني ومتنوع
              في مختلف المجالات، تتيح للكتاب مشاركة أفكارهم ومقالاتهم الملهمة مع الجميع.
            </p>
            <div className="flex space-x-4 rtl:space-x-reverse pt-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white relative pb-2 after:content-[''] after:absolute after:bottom-0 after:right-0 after:h-0.5 after:w-12 after:bg-indigo-500">روابط سريعة</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/categories" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  <span className="ml-2">•</span> التصنيفات
                </Link>
              </li>
              <li>
                <Link href="/popular" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  <span className="ml-2">•</span> المقالات الشائعة
                </Link>
              </li>
              <li>
                <Link href="/authors" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  <span className="ml-2">•</span> الكتّاب
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  <span className="ml-2">•</span> من نحن
                </Link>
              </li>
            </ul>
          </div>

          {/* Latest Articles */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 relative before:content-[''] before:absolute before:bottom-0 before:left-0 before:w-12 before:h-0.5 after:content-[''] after:absolute after:bottom-0 after:left-12 after:w-12 after:h-0.5 after:bg-indigo-500">Latest Articles</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/article/html-css" className="text-gray-300 hover:text-white transition-colors block">
                  دليل المبتدئين إلى HTML و CSS
                </Link>
              </li>
              <li>
                <Link href="/article/flexbox" className="text-gray-300 hover:text-white transition-colors block">
                  ما هو Flexbox وكيفية استخدامه؟
                </Link>
              </li>
              <li>
                <Link href="/article/tailwindcss" className="text-gray-300 hover:text-white transition-colors block">
                  كيف يعزز TailwindCSS الإنتاجية؟
                </Link>
              </li>
              <li>
                <Link href="/article/responsive-tips" className="text-gray-300 hover:text-white transition-colors block">
                  5 نصائح لموقع ويب متجاوب
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white relative pb-2 after:content-[''] after:absolute after:bottom-0 after:right-0 after:h-0.5 after:w-12 after:bg-indigo-500">تواصل معنا</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 text-indigo-400 ml-3 mt-0.5" />
                <span className="text-gray-300">القاهرة، مصر</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 text-indigo-400 ml-3" />
                <span className="text-gray-300">+20 123 456 7890</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 text-indigo-400 ml-3" />
                <span className="text-gray-300">info@blogs-app.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-indigo-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} منصة المدونات العربية. جميع الحقوق محفوظة.
            </p>
            <div className="mt-4 md:mt-0">
              <ul className="flex space-x-6 rtl:space-x-reverse">
                <li>
                  <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                    سياسة الخصوصية
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                    شروط الاستخدام
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="text-gray-400 hover:text-white text-sm transition-colors">
                    سياسة ملفات تعريف الارتباط
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
