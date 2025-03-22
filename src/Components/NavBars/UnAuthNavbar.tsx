"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const Links = [
  { id: 1, name: "Home", href: "/" },
  { id: 2, name: "About", href: "/about" },
  { id: 3, name: "Contact", href: "/contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="absolute top-0 left-0 z-50 w-full shadow-lg ">
      <div className="container mx-auto">
        <div className="relative flex items-center justify-between px-5 w-full">
          <div className="w-full px-4 ">
            <Link href="/">
              <Image
                src="https://cdn.tailgrids.com/2.0/image/assets/images/logo/logo-white.svg"
                alt="logo"
                width={150}
                height={50}
                priority
              />
            </Link>
          </div>
          <div className="flex items-center justify-between w-full px-4">
            <div>
              <button
                onClick={() => setOpen(!open)}
                className="absolute right-4 top-1/2 block -translate-y-1/2 rounded-lg px-3 py-[6px] ring-primary focus:ring-2 lg:hidden"
              >
                <span className="block h-[2px] w-[30px] bg-black my-[6px]"></span>
                <span className="block h-[2px] w-[30px] bg-black my-[6px]"></span>
                <span className="block h-[2px] w-[30px] bg-black my-[6px]"></span>
              </button>
              <nav
                className={`absolute right-4 top-full w-full max-w-[250px] rounded-lg bg-white px-6 py-5 shadow dark:bg-dark-2 lg:static lg:block lg:w-full lg:max-w-full lg:bg-transparent lg:shadow-none lg:dark:bg-transparent ${
                  open ? "block" : "hidden"
                }`}
              >
                <ul className="block lg:flex">
                  {Links.map((link) => (
                    <li key={link.id}>
                      <Link href={link.href} className="block rounded-lg px-4 py-2 text-sm font-medium text-white hover:text-gray-300 lg:ml-8 lg:inline-block lg:py-6 lg:px-0">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
          <button>Click</button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
