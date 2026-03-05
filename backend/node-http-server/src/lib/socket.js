const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

let ioInstance = null;

const asToken = (value = "") => {
  const raw = String(value || "").trim();
  if (!raw) return "";
  return raw.startsWith("Bearer ") ? raw.slice(7).trim() : raw;
};

const toRoom = (userId = "") => `user:${String(userId || "").trim()}`;

const initSocket = ({ server, corsOrigins = [], jwtSecret = "dev-secret" }) => {
  if (!server) {
    throw new Error("Socket init requires an HTTP server instance");
  }

  ioInstance = new Server(server, {
    cors: {
      origin(origin, callback) {
        if (!origin || corsOrigins.includes(origin)) {
          return callback(null, true);
        }

        if (process.env.NODE_ENV !== "production" && /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) {
          return callback(null, true);
        }

        return callback(null, false);
      },
      credentials: true,
    },
  });

  ioInstance.use((socket, next) => {
    try {
      const token = asToken(socket?.handshake?.auth?.token || socket?.handshake?.query?.token || "");
      if (!token) {
        return next(new Error("Unauthorized"));
      }

      const payload = jwt.verify(token, jwtSecret);
      if (!payload?.userId) {
        return next(new Error("Unauthorized"));
      }

      socket.userId = String(payload.userId);
      return next();
    } catch (_) {
      return next(new Error("Unauthorized"));
    }
  });

  ioInstance.on("connection", (socket) => {
    const userRoom = toRoom(socket.userId);
    socket.join(userRoom);

    socket.on("chat:join", (conversationId = "") => {
      const room = String(conversationId || "").trim();
      if (!room) return;
      socket.join(room);
    });

    socket.on("chat:leave", (conversationId = "") => {
      const room = String(conversationId || "").trim();
      if (!room) return;
      socket.leave(room);
    });
  });

  return ioInstance;
};

const getIO = () => ioInstance;

const emitToUsers = (userIds = [], event = "", payload = {}) => {
  if (!ioInstance || !event) return;
  const uniqueUserIds = Array.from(new Set(userIds.map((id) => String(id || "").trim()).filter(Boolean)));
  uniqueUserIds.forEach((id) => {
    ioInstance.to(toRoom(id)).emit(event, payload);
  });
};

module.exports = {
  initSocket,
  getIO,
  emitToUsers,
};
