import mongoose from "mongoose";

const adminLogSchema = new mongoose.Schema(
  {
    // Who did the action (admin / superadmin)
    actionBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // On which user
    actionOn: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
},

actionOnName: {
  type: String,
  required: true,
},


    // What action
    actionType: {
      type: String,
      enum: ["DELETE_USER", "MAKE_ADMIN", "REMOVE_ADMIN", "CHANGE_ROLE"],
      required: true,
    },

    // Human readable message
    message: {
      type: String,
      required: true,
    },
  },

  { timestamps: true }
);

const AdminLog = mongoose.model("AdminLog", adminLogSchema);

export default AdminLog;
