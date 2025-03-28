import { Server } from "socket.io";
import { createServer } from "http";

if (!global._io) {
  const httpServer = createServer();

  global._io = new Server(httpServer, {
    cors: { origin: "*" },
  });

  global._io.on("connection", (socket) => {
    console.log("✅ WebSocket: Client Connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("❌ WebSocket: Client Disconnected:", socket.id);
    });
  });

  httpServer.listen(3002, () => {
    console.log("🚀 WebSocket Server running on port 3002");
  });
}

// ✅ تصدير WebSocket بحيث يكون متاحًا في باقي المشروع
export const io = global._io;
