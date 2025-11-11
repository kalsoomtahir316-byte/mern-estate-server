// server/src/index.js
import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";

import authRoutes from "./routes/auth.js";
import listingRoutes from "./routes/listings.js";

dotenv.config();

const app = express();

let isConnected = false;
export async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGODB_URI);
  isConnected = true;
  console.log("Mongo connected");
}

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

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.get("/api/health", async (_req, res) => {
  try { await connectDB(); res.json({ ok: true }); }
  catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

app.use("/api/auth", async (req, res, next) => { await connectDB(); next(); }, authRoutes);
app.use("/api/listings", async (req, res, next) => { await connectDB(); next(); }, listingRoutes);

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log("server running on " + PORT));
}

export default app;