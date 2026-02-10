import express from "express";
import {
  getUserAlerts,
  markAlertAsRead,
} from "../controllers/alert.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

// =======================
// GET ALL ALERTS FOR USER
// =======================
router.get("/", verifyToken, getUserAlerts);

// =======================
// MARK ALERT AS READ
// =======================
router.put("/:alertId/read", verifyToken, markAlertAsRead);

export default router;
