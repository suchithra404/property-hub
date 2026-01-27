import express from "express";
import {
  toggleWishlist,
  getWishlist,
} from "../controllers/wishlist.controller.js";

import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

// Add / Remove
router.put("/:id", verifyToken, toggleWishlist);

// Get all
router.get("/", verifyToken, getWishlist);

export default router;
