"use client";
import Hero9 from "@/Components/Home/Hero9";
import { useEffect } from "react";
import { io } from "socket.io-client";

const Page = () => {
  useEffect(() => {
    const socket = io("http://localhost:3001"); // اتصال بالسيرفر الجديد

    socket.on("connect", () => {
      console.log("✅ Connected to WebSocket Server");
    });

    socket.on("commentNotification", (data) => {
      console.log("📢 New Comment Notification:", data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);
  return (
    <div className="overflow-hidden">
      <Hero9 />
    </div>
  );
};

export default Page;
