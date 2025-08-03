"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/Components/NavBars/UnAuthNavbar";
import Footer from "@/Components/Footer/Footer";
import { SessionProvider } from "next-auth/react";
import { UserProvider, useUser } from "../../contexts/UserContext";
import Loading from "@/Components/Loading";
import { useRedirectBasedOnUser } from "../../contexts/useRedirectBasedOnUser";
import SEO from "@/Components/SEO";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <UserProvider>
          <MainLayout>{children}</MainLayout>
        </UserProvider>
      </body>
    </html>
  );
}

function MainLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUser();
  useRedirectBasedOnUser({ check: "auth", redirectIfNotAuthenticated: "/login" });
  
  if (loading) return <Loading />;

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        {!user && <Navbar />}
      </header>
      <main className="flex-grow">
        <SessionProvider>{children}</SessionProvider>
      </main>
      <Footer />
    </div>
  );
}
