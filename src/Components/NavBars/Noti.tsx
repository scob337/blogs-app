"use client";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io(); // الاتصال بالسيرفر

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // استقبال إشعار الإعجاب
    socket.on("likeNotification", () => {
      setNotifications((prev) => [...prev, "🚀 شخص ما أعجب بمنشورك!"]);
    });

    // استقبال إشعار التعليق
    socket.on("commentNotification", () => {
      setNotifications((prev) => [...prev, "💬 لديك تعليق جديد!"]);
    });

    return () => {
      socket.off("likeNotification");
      socket.off("commentNotification");
    };
  }, []);

  return (
    <div className="fixed top-4 right-4 bg-white shadow-lg p-4 rounded-md">
      {notifications.map((notif, index) => (
        <div key={index} className="mb-2 p-2 bg-gray-200 rounded">
          {notif}
        </div>
      ))}
    </div>
  );
};

export default Notifications;