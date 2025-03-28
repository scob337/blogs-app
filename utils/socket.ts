import { Server } from "socket.io";
import { Server as HttpServer } from "http"; // استيراد التايب المناسب للسيرفر

let io: Server | null = null;

// ✅ دالة إنشاء WebSocket
export const initializeSocket = (server: HttpServer): Server => {
  if (!io) {
    io = new Server(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    io.on("connection", (socket) => {
      console.log(`🔗 New client connected: ${socket.id}`);

      socket.on("disconnect", () => {
        console.log(`❌ Client disconnected: ${socket.id}`);
      });
    });
  }
  return io;
};

// ✅ دالة استرجاع WebSocket
export const getSocket = (): Server | null => {
  if (!io) {
    console.warn("⚠️ WebSocket not initialized!");
  }
  return io;
};
