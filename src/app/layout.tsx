"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/Components/NavBars/UnAuthNavbar";
import Footer from "@/Components/Footer/Footer";
import { SessionProvider } from "next-auth/react";
import { UserProvider, useUser } from "../../contexts/UserContext";
import Loading from "@/Components/Loading";
import { useRedirectBasedOnUser } from "../../contexts/useRedirectBasedOnUser";
import Head from "next/head";

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
        <meta name="description" content="Blogs Platform - Share your ideas and articles with the world" />
        <meta name="keywords" content="blogs, articles, writing, content, blog" />
        <meta name="author" content="Blogs App" />
        <meta property="og:title" content="Blogs Platform" />
        <meta property="og:description" content="Share your ideas and articles with the world through our platform" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://blogs-app.com" />
        <meta property="og:image" content="/logo.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="icon" href="/favicon.ico" />
        <title>Blogs Platform</title>
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
