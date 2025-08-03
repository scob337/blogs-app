"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation"
import { authenticatedFetch, authenticatedPost } from "../utils/fetch";

interface User {
  id: string;
  fName: string;
  lName: string;
  email: string;
  img: string;
  bio:string;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  login: (userData: User) => void; // Login function
  logout: () => void;
  refreshUser: () => Promise<void>; // Add refresh function
}

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  login: () => {}, // Add `login`
  logout: () => {},
  refreshUser: async () => {}, // Add refresh function
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter()

  // Function to fetch user data
  const fetchUser = async () => {
    try {
      const res = await authenticatedFetch("/api/me");
      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Function to refresh user data
  const refreshUser = async () => {
    setLoading(true);
    await fetchUser();
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Improved login function with better error handling and redirection
  const login = async (userData: User) => {
    setUser(userData);
    setLoading(false);
    
    // Use router.replace to avoid history issues
    // Add a small timeout to ensure state is updated before redirecting
    setTimeout(() => {
      router.replace("/auth");
      // Force reload to ensure all components are updated
      window.location.reload();
    }, 500); // Increased timeout to ensure token is properly set
  };

  const logout = async () => {
    try {
      await authenticatedPost("/api/auth/logout", {});
      
      setUser(null);
      router.push("/") 
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <UserContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
