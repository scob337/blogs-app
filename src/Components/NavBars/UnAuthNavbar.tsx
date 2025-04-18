"use client";
import Link from "next/link";
import { useState } from "react";
import Logo from "../Logo";

const Links = [
  { id: 1, name: "Home", href: "/" },
  { id: 2, name: "About", href: "/about" },
  { id: 3, name: "Write", href: "/auth" },
];


const UnAuthNavbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className=" w-full shadow-lg p-3 bg-indigo-600 text-white fixed top-0 z-50">
      <div className="container mx-auto w-full">
        <div className="relative flex items-center justify-between px-5 w-full">
          <div className="w-[10%] flex justify-end px-4">
          <Logo/>
          </div>
          <nav className="hidden lg:flex w-[50%] justify-center">
            <ul className="flex space-x-8">
              {Links.map((link) => (
                <li key={link.id}>
                  <Link
                    href={link.href}
                    className="text-white font-medium hover:text-black"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="w-[20%] hidden justify-start space-x-4  lg:flex">
            <button className="btn btn-soft">
              <Link href="/login">Sign in</Link>
            </button>
            
            <button className="btn btn-neutral">
              
              <Link href="/register">Get Start</Link>
            </button>
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden absolute right-4 top-1/2 -translate-y-1/2 px-3 py-2 rounded-lg
            cursor-pointer text-white
            "
          >
            <span className="block h-[2px] w-[30px] bg-white my-[6px]"></span>
            <span className="block h-[2px] w-[30px] bg-white my-[6px]"></span>
            <span className="block h-[2px] w-[30px] bg-white my-[6px]"></span>
          </button>

          {open && (
            <div className="absolute top-full right-4 w-[250px] bg-white shadow-lg rounded-lg px-6 py-5">
              <ul className="block space-y-4">
                {Links.map((link) => (
                  <li key={link.id}>
                    <Link
                      href={link.href}
                      className="block text-black font-medium hover:text-gray-600"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-4 space-y-2">
              <button className="btn btn-soft">
              <Link href="/login">Sign in</Link>
            </button>
            
            <button className="btn btn-neutral">
              
              <Link href="/register">Get Start</Link>
            </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default UnAuthNavbar;



