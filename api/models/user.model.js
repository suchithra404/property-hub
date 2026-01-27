import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    avatar: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
    },

    // 🔐 Role for Admin System
    role: {
      type: String,
      enum: ["user", "admin", "superadmin"],
      default: "user",
    },

    // ✅ Buyer / Seller / Both
    accountType: {
      type: String,
      enum: ["buyer", "seller", "both"],
      default: "buyer",
    },
    // ❤️ Wishlist
// ❤️ Wishlist
wishlist: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Listing",
  },
],



  },

  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;
