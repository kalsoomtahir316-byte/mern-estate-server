// server/src/index.js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import listingRoutes from "./routes/listings.js";

dotenv.config();
const app = express();

// --- DB connect (runs once on first import) ---
let isConnected = false;
export async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGODB_URI);
  isConnected = true;
  console.log("Mongo connected");
}

// --- middleware ---
app.use(
  cors({
    origin: (origin, cb) => {
      const allow = (process.env.CLIENT_URLS || "")
        .split(",")
        .map(s => s.trim())
        .filter(Boolean);
      if (!origin || allow.includes(origin)) return cb(null, true);
      cb(new Error("CORS blocked"));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "2mb" }));
app.use(cookieParser());
app.use(morgan("dev"));

// health
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// routes
app.use("/api/auth", authRoutes);
app.use("/api/listings", listingRoutes);

// ❗ no app.listen here (serverless export below file)
// export default app for Vercel wrapper and dev server
export default app;