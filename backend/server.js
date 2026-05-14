import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

dotenv.config();
connectDB();

const app = express();
const httpServer = createServer(app); // wrap express in http server

// Socket.io setup
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});

// Store online users
// { userId: socketId }
const onlineUsers = {};

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // When user comes online
  socket.on("userOnline", (userId) => {
    onlineUsers[userId] = socket.id;
    // Broadcast to all clients who is online
    io.emit("getOnlineUsers", Object.keys(onlineUsers));
    console.log("Online users:", Object.keys(onlineUsers));
  });

  // When user disconnects
  socket.on("disconnect", () => {
    // Find and remove disconnected user
    const userId = Object.keys(onlineUsers).find(
      (key) => onlineUsers[key] === socket.id
    );
    if (userId) {
      delete onlineUsers[userId];
      io.emit("getOnlineUsers", Object.keys(onlineUsers));
    }
    console.log("A user disconnected:", socket.id);
  });
});

// Export io so we can use it in controllers
export { io, onlineUsers };

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);

app.get("/", (req, res) => {
  res.send("Chat API is running...");
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});