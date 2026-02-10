import VisitRequest from "../models/visitRequest.model.js";
import Listing from "../models/listing.model.js";
import Alert from "../models/alert.model.js";


// ================================
// 1. Create Visit Request (User)
// ================================
export const createVisitRequest = async (req, res) => {
  try {
    const newRequest = new VisitRequest({
      userId: req.user.id, // from auth middleware
      listingId: req.body.listingId,
      visitDate: req.body.visitDate,
      visitTime: req.body.visitTime,
      message: req.body.message,
    });

    await newRequest.save();

    res.status(201).json({
      success: true,
      message: "Visit request sent successfully",
      data: newRequest,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================================
// 2. Get Visit Requests
// (User / Owner / Admin)
// ================================
export const getVisitRequests = async (req, res) => {
  try {
    let requests = [];

    // ================= ADMIN / SUPERADMIN =================
    if (
      req.user.role === "admin" ||
      req.user.role === "superadmin" ||
      req.user.isAdmin === true
    ) {
      // Can see ALL requests
      requests = await VisitRequest.find()
        .populate("userId", "username email")
        .populate("listingId", "name userRef address price");
    }

    // ================= NORMAL USER =================
    else {
      // Get all listings of this user (owner)
      const myListings = await Listing.find({
        userRef: req.user.id,
      }).select("_id");

      const myListingIds = myListings.map((l) => l._id);

      requests = await VisitRequest.find({
        $or: [
          { userId: req.user.id }, // sent by user
          { listingId: { $in: myListingIds } }, // for owner
        ],
      })
        .populate("userId", "username email")
        .populate("listingId", "name userRef address price");
    }

    res.status(200).json(requests);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================================
// 3. Update Status (Approve / Reject)
// ================================
export const updateVisitStatus = async (req, res) => {
  try {
    const updatedRequest = await VisitRequest.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status, // approved / rejected
      },
      { new: true }
    )
      .populate("userId", "username email")
      .populate("listingId", "name userRef");

    // =======================
    // CREATE ALERT FOR BUYER
    // =======================
    await Alert.create({
      userId: updatedRequest.userId._id, // buyer
      title: "Visit Request Update",
      message: `Your visit request for "${updatedRequest.listingId.name}" has been ${updatedRequest.status}.`,
      type: "visit",
    });

    res.status(200).json({
      success: true,
      message: "Status updated",
      data: updatedRequest,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
