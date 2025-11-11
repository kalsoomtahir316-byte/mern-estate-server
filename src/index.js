import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import morgan from "morgan";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import listingRoutes from "./routes/listings.js";

dotenv.config();

const app = express();

// connect DB (local + vercel)
let isConnected = false;
export async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGODB_URI);
  isConnected = true;
  console.log("Mongo connected");
}

// middleware
app.use(
  cors({
    origin: (origin, cb) => {
      const allow = (process.env.CLIENT_URLS || "").split(",").map(s => s.trim()).filter(Boolean);
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

// Export the app for Vercel
export default app;

// When running locally with `npm run dev`, also start the server:
if (!process.env.VERCEL) {
  const port = process.env.PORT || 5000;
  connectDB().then(() => {
    app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
  });
}