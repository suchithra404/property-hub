import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    staff: {
      type: String, // who handles it
      required: true,
    },

    user: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  default: null, // ⭐ important
},

  },
  { timestamps: true }
);

export default mongoose.model("Contact", contactSchema);
