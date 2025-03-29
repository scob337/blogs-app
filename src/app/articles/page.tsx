"use client";

import { useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// ✅ تعريف الـ Type للمستخدم
interface User {
  name?: string | null;
  email: string;
  image?: string | null;
  password?: string | null;
}

// ✅ تعريف الـ Type للـ Session علشان يطابق الـ NextAuth
interface AuthSession {
  user?: User;
}

export default function AuthChecker() {
  const { data: session } = useSession() as { data: AuthSession | null }; // ✅ تحديد نوع البيانات
  const router = useRouter();

  // ✅ لفّ الفانكشن داخل useCallback علشان ما تتغيرش في كل ريندر
  const registerUser = useCallback(async (user: User) => {
    try {
      const res = await fetch("/api/register", {
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
  }, [router]); // علشان نفس السبب، من الأفضل لفها بـ useCallback

  const checkUser = useCallback(
    async (user: User) => {
      try {
        const res = await fetch("/api/check-user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: user.email, password: user.password }),
        });

        const data = await res.json();

        if (data.exists) {
          console.log("User exists, logging in...");
          router.push("/dashboard");
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
    [router, registerUser] // ✅ كده مش هيتغير إلا لما أحد التابعين يتغير
  );

  // ✅ `useEffect` مش هيعمل ريندر كل شوية دلوقتي
  useEffect(() => {
    if (session?.user) {
      checkUser(session.user); // ✅ تصحيح الخطأ هنا
    }
  }, [session, checkUser]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <p>Checking user authentication...</p>
    </div>
  );
}
