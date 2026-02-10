import mongoose from "mongoose";

const alertSchema = new mongoose.Schema(
  {
    // Who will receive the alert
    userId: {
      type: String,
      required: true,
    },

    // Short heading for alert
    title: {
      type: String,
      required: true,
    },

    // Detailed message
    message: {
      type: String,
      required: true,
    },

    // Type of alert
    type: {
      type: String,
      enum: ["price", "visit", "listing"],
      required: true,
    },

    // Read / Unread status
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Alert = mongoose.model("Alert", alertSchema);

export default Alert;
