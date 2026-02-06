import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    // 👤 Username
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    // 📧 Email (Optional - for Gmail Login)
    email: {
      type: String,
      unique: true,
      sparse: true, // allows multiple null values
    },

    // 📱 Phone (Optional - for Mobile Login)
    phone: {
      type: String,
      unique: true,
      sparse: true, // allows multiple null values
    },

    // 🔐 Password (For Normal Login)
    password: {
      type: String,
      required: true,
    },

    // 🖼️ Profile Picture
    avatar: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
    },

    // 🔐 Role
    role: {
      type: String,
      enum: ["user", "admin", "superadmin"],
      default: "user",
    },

    // 🏷️ Account Type
    accountType: {
      type: String,
      enum: ["buyer", "seller", "both"],
      default: "buyer",
    },

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
