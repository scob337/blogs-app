"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/Components/NavBars/UnAuthNavbar";
import Footer from "@/Components/Footer/Footer";
import { SessionProvider } from "next-auth/react";
import { UserProvider, useUser } from "../../contexts/UserContext";
import AuthNav from "@/Components/NavBars/AuthNavbar";
import Loading from "@/Components/Loading";

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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
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

  if (loading) return <Loading/>;

  return (
    <>
      {user ? <AuthNav /> : <Navbar />}
      <SessionProvider>{children}</SessionProvider>
      <Footer />
    </>
  );
}