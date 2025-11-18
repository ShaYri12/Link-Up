import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import cookieParser from "cookie-parser";
import chatRoutes from "./routes/chatRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import jobRoutes from "./routes/jobs.js";
import commentRoutes from "./routes/comments.js";
import likeRoutes from "./routes/likes.js";
import storyRoutes from "./routes/stories.js";
import relationshipRoutes from "./routes/relationships.js";
import http from "http"; // Import HTTP module
import { Server } from "socket.io"; // Import Server class from socket.io
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
dotenv.config();

const app = express();
const server = http.createServer(app); // Create HTTP server
// trust proxy so secure cookies work behind proxies (e.g., Vercel)
app.set("trust proxy", 1);

const CLIENT_ORIGINS = (process.env.CORS_ORIGINS || "http://localhost:3000,https://link-up-sage.vercel.app,https://linkup-lemon.vercel.app")
  .split(",")
  .map((s) => s.trim());

const corsOrigin = (origin, callback) => {
  // allow requests with no origin (like mobile apps or curl)
  if (!origin) return callback(null, true);
  try {
    const url = new URL(origin);
    const host = url.hostname;
    if (CLIENT_ORIGINS.includes(origin)) return callback(null, true);
    // allow any vercel.app subdomain
    if (/\.vercel\.app$/.test(host)) return callback(null, true);
    // allow localhost dev
    if (host === "localhost") return callback(null, true);
  } catch (e) {
    // fallthrough
  }
  return callback(new Error("CORS not allowed for origin: " + origin), false);
};

const io = new Server(server, {
  cors: {
    origin: corsOrigin,
    credentials: true,
  },
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB database");
});

//middlewares
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  next();
});
const JSON_LIMIT = process.env.JSON_LIMIT || "3mb";
app.use(express.json({ limit: JSON_LIMIT }));
app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
  })
);
// Explicitly handle preflight requests for all routes
app.options("*", cors({ origin: corsOrigin, credentials: true }));
app.use(cookieParser());

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer in-memory storage for streaming to Cloudinary
const upload = multer({ storage: multer.memoryStorage() });

app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Upload buffer to Cloudinary
    const folder = process.env.CLOUDINARY_FOLDER || "link-up";
    const isVideo = /video\//.test(req.file.mimetype);

    const result = await cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: isVideo ? "video" : "image",
      },
      (error, uploadResult) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          return res.status(500).json({ error: "Upload failed" });
        }
        // Return the secure URL to client
        return res.status(200).json(uploadResult.secure_url);
      }
    );

    // Write the buffer to the upload stream
    const stream = result;
    stream.end(req.file.buffer);
  } catch (e) {
    console.error("Upload error:", e);
    res.status(500).json({ error: "Upload failed" });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/stories", storyRoutes);
app.use("/api/relationships", relationshipRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

const PORT = process.env.PORT || 8800;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Socket.IO integration
io.on("connection", (socket) => {
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User joined room: " + room);
  });

  socket.on("typing", (room) => {
    socket.in(room).emit("typing");
  });

  socket.on("stop typing", (room) => {
    socket.in(room).emit("stop typing");
  });

  socket.on("new message", (newMessageReceived) => {
    const { chat } = newMessageReceived;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageReceived.sender._id) return;

      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});
