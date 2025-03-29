"use client";

import { useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Session } from "next-auth"; // ✅ استيراد نوع الـ Session من NextAuth

// ✅ تعريف الـ Type للمستخدم
interface User {
  name?: string | null;
  email: string;
  image?: string | null;
  password?: string | null;
}

export default function AuthChecker() {
  const { data: session, status } = useSession() as {
    data: Session | null;
    status: "loading" | "authenticated" | "unauthenticated";
  }; // ✅ تصحيح النوع

  const router = useRouter();

  // ✅ لفّ الفانكشن داخل useCallback علشان ما تتغيرش في كل ريندر
  const registerUser = useCallback(
    async (user: User) => {
      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        });

        if (res.ok) {
          console.log("User registered successfully");
          router.push("/dashboard");
        } else {
          console.error("Error registering user");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    },
    [router]
  );

  const checkUser = useCallback(
    async (user: User) => {
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: user.email, password: user.password }),
        });

        const data = await res.json();

        if (data.exists) {
          console.log("User exists, logging in...");
          router.push("/");
        } else {
          console.log("User not found, creating account...");
          await registerUser({
            name: user.name || user.email.split("@")[0],
            email: user.email,
            image: user.image,
          });
        }
      } catch (error) {
        console.error("Error checking user:", error);
      }
    },
    [router, registerUser]
  );

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      checkUser({
        ...session.user,
        email: session.user.email ?? "",
      });
    }
  }, [session, status, checkUser]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <p>Checking user authentication...</p>
    </div>
  );
}
