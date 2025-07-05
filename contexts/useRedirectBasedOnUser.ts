"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "./UserContext";

export const useRedirectBasedOnUser = ({
  redirectIfAuthenticated = "/auth",
  redirectIfNotAuthenticated = "/login",
  check = "any", // "auth" | "guest" | "any"
}: {
  redirectIfAuthenticated?: string;
  redirectIfNotAuthenticated?: string;
  check?: "auth" | "guest" | "any";
}) => {
  const { user, loading } = useUser();
  const router = useRouter();

  // ✅ تحسين الاستماع للتغيرات على المستخدم
  useEffect(() => {
    // إذا كان التحميل قد انتهى، نقوم بالتوجيه بناءً على حالة المستخدم
    if (!loading) {
      if (check === "auth" && !user) {
        console.log("Redirecting to:", redirectIfNotAuthenticated);
        router.replace(redirectIfNotAuthenticated);
      } else if (check === "guest" && user) {
        console.log("Redirecting to:", redirectIfAuthenticated);
        router.replace(redirectIfAuthenticated);
      } else if (check === "any") {
        // لا نقوم بأي إعادة توجيه في حالة "any"
        console.log("No redirection needed for 'any' check");
      }
    }
  }, [user, loading, router, check, redirectIfAuthenticated, redirectIfNotAuthenticated]); 
};
