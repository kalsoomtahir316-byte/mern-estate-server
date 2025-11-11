import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

export async function connectDB() {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("✅ MongoDB connected");
}

// test route
app.get("/api/health", (req, res) => res.json({ ok: true }));

app.get("/", (req, res) => {
  res.send("MERN Estate Server is running successfully 🚀");
});

// export for vercel
export default app;

// local run
if (!process.env.VERCEL) {
  const port = process.env.PORT || 5000;
  connectDB().then(() => {
    app.listen(port, () => console.log(`Local server running on ${port}`));
  });
}