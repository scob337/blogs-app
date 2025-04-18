"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation"

interface User {
  id: string;
  fName: string;
  lName: string;
  email: string;
  img: string;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  login: (userData: User) => void; // ⬅️ دالة تسجيل الدخول
  logout: () => void;
}

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  login: () => {}, // ⬅️ إضافة `login`
  logout: () => {},
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const Router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/me");
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // ✅ دالة تسجيل الدخول
  const login = (userData: User) => {
    setUser(userData);
    Router.push("/auth")
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      // هنا ممكن تحذف الكوكيز أو أي شيء آخر حسب الحاجة
      
      setUser(null);
      Router.push("/") // تحويل المستخدم إلى الصفحة الرئيسية
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <UserContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
