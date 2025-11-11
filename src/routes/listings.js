import { Router } from "express";
import { create, getOne, update, remove, search } from "../controllers/listing.controller.js";
import { requireAuth } from "../middleware/auth.js";

const r = Router();
r.get("/", search);
r.get("/:id", getOne);
r.post("/", requireAuth, create);
r.patch("/:id", requireAuth, update);
r.delete("/:id", requireAuth, remove);
export default r;