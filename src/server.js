import { Server } from "socket.io";
import { createServer } from "http";

const PORT = process.env.PORT || 2000;

if (!global._serverStarted) {
  global._serverStarted = true;
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

    httpServer.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
}

// ✅ تصدير WebSocket بحيث يكون متاحًا في باقي المشروع
export const io = global._io;
