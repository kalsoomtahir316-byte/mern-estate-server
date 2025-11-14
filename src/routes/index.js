// server/src/routes/index.js
import { Router } from "express";
import authRoutes from "./auth.js";
import listingsRoutes from "./listings.js";

const router = Router();

// /api/auth/...
router.use("/auth", authRoutes);

// /api/listings/...
router.use("/listings", listingsRoutes);

export default router;