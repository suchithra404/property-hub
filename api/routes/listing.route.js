import express from "express";
import {
  createListing,
  deleteListing,
  updateListing,
  getListing,
  getListings,
  getUserListings, // 🔥 ADD THIS
} from "../controllers/listing.controller.js";

import { verifyToken } from "../utils/verifyUser.js";
import upload from "../utils/multer.js";
import cloudinary from "../utils/cloudinary.js";

const router = express.Router();

/* ================= IMAGE UPLOAD ================= */

router.post("/upload", upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    cloudinary.uploader.upload_stream(
      {
        folder: "propertyhub",
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary error:", error);
          return res.status(500).json({
            success: false,
            message: "Cloudinary upload failed",
          });
        }

        return res.status(200).json({
          success: true,
          imageUrl: result.secure_url,
        });
      }
    ).end(req.file.buffer);
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Upload crashed",
    });
  }
});

/* ================= LISTING ROUTES ================= */

router.post("/create", verifyToken, createListing);
router.delete("/delete/:id", verifyToken, deleteListing);
router.post("/update/:id", verifyToken, updateListing);
router.get("/get/:id", getListing);
router.get("/get", getListings);

// 🔥🔥🔥 THIS LINE FIXES YOUR 3-DAY BUG
router.get("/user/:id", verifyToken, getUserListings);

export default router;
