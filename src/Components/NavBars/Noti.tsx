"use client";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import Link from "next/link";
import { useUser } from "../../../contexts/UserContext";

const socket = io(); // Connect to the server

interface Notification {
  id: string;
  postId: string;
  postTitle?: string;
  commentId?: string;
  commentContent?: string;
  createdAt: string;
  read: boolean;
  type: 'like' | 'comment' | 'post';
  senderName?: string;
  senderId?: string;
  senderImg?: string;
  recipientId?: string;
}

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useUser();

  useEffect(() => {
    if (!user) return;

    // استمع لإشعارات الإعجاب
    socket.on("likeNotification", (data) => {
      // تحقق من أن الإشعار موجه للمستخدم الحالي
      if (data.recipientId === user.id) {
        const newNotification: Notification = {
          id: Math.random().toString(36).substring(2, 9),
          postId: data.postId,
          postTitle: data.postTitle,
          createdAt: data.createdAt,
          read: false,
          type: 'like',
          senderName: data.likerName,
          senderId: data.likerId,
          senderImg: data.likerImg,
          recipientId: data.recipientId
        };
        
        setNotifications(prev => [newNotification, ...prev]);
        setUnreadCount(count => count + 1);
      }
    });

    // استمع لإشعارات التعليقات
    socket.on("commentNotification", (data) => {
      // تحقق من أن الإشعار موجه للمستخدم الحالي
      if (data.recipientId === user.id) {
        const newNotification: Notification = {
          id: Math.random().toString(36).substring(2, 9),
          postId: data.postId,
          postTitle: data.postTitle,
          commentId: data.commentId,
          commentContent: data.commentContent,
          createdAt: data.createdAt,
          read: false,
          type: 'comment',
          senderName: data.commenterName,
          senderId: data.commenterId,
          senderImg: data.commenterImg,
          recipientId: data.recipientId
        };
        
        setNotifications(prev => [newNotification, ...prev]);
        setUnreadCount(count => count + 1);
      }
    });

    // استمع لإشعارات المنشورات الجديدة
    socket.on("newPostNotification", (data) => {
      // لا نحتاج للتحقق من المستلم هنا لأن الإشعار يُرسل للجميع
      // لكن نتجاهل الإشعارات من المستخدم نفسه
      if (data.authorId !== user.id) {
        const newNotification: Notification = {
          id: Math.random().toString(36).substring(2, 9),
          postId: data.postId,
          postTitle: data.title,
          createdAt: data.createdAt,
          read: false,
          type: 'post',
          senderName: data.authorName,
          senderId: data.authorId
        };
        
        setNotifications(prev => [newNotification, ...prev]);
        setUnreadCount(count => count + 1);
      }
    });

    return () => {
      socket.off("likeNotification");
      socket.off("commentNotification");
      socket.off("newPostNotification");
    };
  }, [user]);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
    setUnreadCount(count => Math.max(0, count - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
    setUnreadCount(0);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="relative">
      {/* Notification Bell Icon */}
      <button 
        onClick={() => {
          setShowNotifications(!showNotifications);
          if (!showNotifications) markAllAsRead();
        }}
        className="p-2 rounded-full hover:bg-gray-100 relative"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown */}
      {showNotifications && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-50 max-h-96 overflow-y-auto">
          <div className="p-3 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-medium">Notifications</h3>
            {notifications.length > 0 && (
              <button 
                onClick={markAllAsRead}
                className="text-sm text-blue-500 hover:text-blue-700"
              >
                Mark all as read
              </button>
            )}
          </div>
          
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No notifications yet
            </div>
          ) : (
            <div>
              {notifications.map((notif) => (
                <Link 
                  href={notif.postId ? `/post/${notif.postId}${notif.commentId ? `#comment-${notif.commentId}` : ''}` : '#'}
                  key={notif.id}
                  onClick={() => markAsRead(notif.id)}
                >
                  <div className={`p-4 border-b border-gray-100 hover:bg-gray-50 ${!notif.read ? 'bg-blue-50' : ''}`}>
                    <div className="flex items-start">
                      <div className={`mr-3 p-2 rounded-full ${notif.type === 'like' ? 'bg-red-100 text-red-500' : notif.type === 'comment' ? 'bg-green-100 text-green-500' : 'bg-blue-100 text-blue-500'}`}>
                        {notif.type === 'like' && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                          </svg>
                        )}
                        {notif.type === 'comment' && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                          </svg>
                        )}
                        {notif.type === 'post' && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1">
                        {notif.type === 'like' && (
                          <p className="text-sm font-medium">
                            <span className="font-semibold">{notif.senderName}</span> liked your post {`"${notif.postTitle}"`}
                          </p>
                        )}
                        {notif.type === 'comment' && (
                          <p className="text-sm font-medium">
                            <span className="font-semibold">{notif.senderName}</span> commented on your post {`"${notif.postTitle}"`}
                          </p>
                        )}
                        {notif.type === 'post' && (
                          <p className="text-sm font-medium">
                            <span className="font-semibold">{notif.senderName}</span> published a new post {`"${notif.postTitle}"`}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">{formatTime(notif.createdAt)}</p>
                      </div>
                      {!notif.read && (
                        <span className="h-2 w-2 bg-blue-500 rounded-full"></span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Notifications;