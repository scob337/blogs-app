"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/Components/NavBars/UnAuthNavbar";
import Footer from "@/Components/Footer/Footer"; // Ensure this path is correct and the Footer component exists
import { SessionProvider } from "next-auth/react";
import { UserProvider, useUser } from "../../contexts/UserContext";
import Loading from "@/Components/Loading";
import { useRedirectBasedOnUser } from "../../contexts/useRedirectBasedOnUser";

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
  useRedirectBasedOnUser({ check: "auth", redirectIfNotAuthenticated: "/login" });
  if (loading) return <Loading />;

  return (
    <>
      {!user && <Navbar />}
      <SessionProvider>{children}</SessionProvider>
      <Footer />
    </>
  );
}
