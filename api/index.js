import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";

import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors";

// Routes
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import listingRouter from "./routes/listing.route.js";
import adminRouter from "./routes/admin.route.js"; // ✅ ADD THIS

const app = express();
const __dirname = path.resolve();

/* ========== MIDDLEWARE ========== */

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 🔥 Allow uploaded images to be accessed
app.use("/uploads", express.static("uploads"));

/* ========== DATABASE ========== */

mongoose
  .connect(process.env.MONGO)
  .then(() => console.log("Connected to MongoDB!"))
  .catch((err) => console.error("MongoDB connection error:", err));

/* ========== API ROUTES ========== */

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);
app.use("/api/admin", adminRouter); // ✅ ADD THIS

/* ========== FRONTEND ========== */

app.use(express.static(path.join(__dirname, "/client/dist")));

app.get("/:catchAll(.*)", (req, res) => {
  res.sendFile(path.join(__dirname, "/client/dist", "index.html"));
});

/* ========== ERROR HANDLER ========== */

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

/* ========== START SERVER ========== */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
