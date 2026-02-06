import express from "express";
import {
  createVisitRequest,
  getVisitRequests,
  updateVisitStatus,
} from "../controllers/visitRequest.controller.js";

import { verifyToken, verifyAdmin } from "../utils/verifyUser.js";

const router = express.Router();

// ===============================
// User → Create request
// ===============================
router.post("/create", verifyToken, createVisitRequest);

// ===============================
// User / Owner / Admin → View requests
// ===============================
router.get("/", verifyToken, getVisitRequests);

// ===============================
// Admin / Owner → Approve / Reject
// ===============================
router.put("/:id", verifyToken, verifyAdmin, updateVisitStatus);

export default router;
