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

  // ✅ بيسمع التغيرات على المستخدم
  useEffect(() => {
    if (loading) return;

    if (check === "auth" && !user) {
      router.push(redirectIfNotAuthenticated);
    } else if (check === "guest" && user) {
      router.push(redirectIfAuthenticated);
    }
  }, [user, loading , router, check, redirectIfAuthenticated, redirectIfNotAuthenticated]); 
};
