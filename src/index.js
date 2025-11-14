import express from "express";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
import dotenv from "dotenv";
import routes from "./routes/index.js";

dotenv.config();
const app = express();


app.use(express.json());
app.use(morgan("dev"));

app.use("/api", routes);


const DEV_ORIGIN = "http://localhost:5173";
const PROD_ORIGIN = "https://estate-client.netlify.app";

app.use(cors({
  origin: [DEV_ORIGIN, PROD_ORIGIN],
  credentials: false,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.options("*", (req, res) => res.sendStatus(200));


app.get("/api/health", (req, res) => res.json({ ok: true }));

// MongoDB connection
const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("✅ MongoDB connected");
};


if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5089;
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Server running locally on port ${PORT}`);
    });
  });
}
export default app;