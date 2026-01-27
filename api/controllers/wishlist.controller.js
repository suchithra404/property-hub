import User from "../models/user.model.js";

// Add / Remove Wishlist
export const toggleWishlist = async (req, res) => {
  try {

    // ✅ Get correct user ID
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: No user ID" });
    }

    const listingId = req.params.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Ensure wishlist exists
    if (!user.wishlist) {
      user.wishlist = [];
    }

    const isSaved = user.wishlist.includes(listingId);

    if (isSaved) {
      // Remove
      user.wishlist = user.wishlist.filter(
        (id) => id.toString() !== listingId
      );
    } else {
      // Add
      user.wishlist.push(listingId);
    }

    await user.save();

    res.status(200).json({
      success: true,
      wishlist: user.wishlist,
    });

  } catch (error) {
    console.log("Toggle Wishlist Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};


// Get Wishlist
export const getWishlist = async (req, res) => {
  try {

    // ✅ Get correct user ID
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: No user ID" });
    }

    const user = await User.findById(userId)
      .populate("wishlist");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.wishlist || []);

  } catch (error) {
    console.log("Get Wishlist Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};
