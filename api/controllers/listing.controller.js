import Listing from '../models/listing.model.js';
import { errorHandler } from '../utils/error.js';
import Alert from "../models/alert.model.js";
import User from "../models/user.model.js";


/* ================= CREATE ================= */

export const createListing = async (req, res, next) => {
  try {
    // 1️⃣ Create listing
    const listing = await Listing.create({
      ...req.body,
      userRef: req.user._id,
    });

    // =======================
    // 🔔 NEW LISTING ALERT (CITY BASED)
    // =======================

    // Safety check: city must exist
    if (listing.city) {

      // Find users (excluding creator)
      const users = await User.find({
        _id: { $ne: req.user._id },
      }).select("_id");

      // Create alerts
      const alerts = users.map((user) => ({
        userId: user._id,
        title: "New Property Added",
        message: `A new property has been added in ${listing.city}.`,
        type: "listing",
      }));

      // Save alerts
      if (alerts.length > 0) {
        await Alert.insertMany(alerts);
      }
    }

    // 2️⃣ Send response
    return res.status(201).json(listing);

  } catch (error) {
    next(error);
  }
};


/* ================= DELETE ================= */

export const deleteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return next(errorHandler(404, 'Listing not found!'));
    }

    // ✅ FIXED
    if (listing.userRef.toString() !== req.user._id) {
      return next(errorHandler(401, 'You can only delete your own listings!'));
    }

    await Listing.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Listing deleted',
    });
  } catch (error) {
    next(error);
  }
};

/* ================= UPDATE ================= */

export const updateListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return next(errorHandler(404, 'Listing not found!'));
    }

    // ✅ FIXED
    if (listing.userRef.toString() !== req.user._id) {
      return next(errorHandler(401, 'You can only update your own listings!'));
    }

    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};

/* ================= GET ONE ================= */

export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return next(errorHandler(404, 'Listing not found!'));
    }

    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

/* ================= GET ALL ================= */

export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;

    let offer = req.query.offer;
    if (offer === undefined || offer === 'false') {
      offer = { $in: [false, true] };
    }

    let furnished = req.query.furnished;
    if (furnished === undefined || furnished === 'false') {
      furnished = { $in: [false, true] };
    }

    let parking = req.query.parking;
    if (parking === undefined || parking === 'false') {
      parking = { $in: [false, true] };
    }

    let type = req.query.type;
    if (type === undefined || type === 'all') {
      type = { $in: ['sale', 'rent'] };
    }

    const searchTerm = req.query.searchTerm || '';
    const sort = req.query.sort || 'createdAt';
    const order = req.query.order || 'desc';

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: 'i' },
      offer,
      furnished,
      parking,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};

/* ================= GET USER LISTINGS ================= */

export const getUserListings = async (req, res, next) => {
  try {
    console.log('PARAM ID:', req.params.id);
    console.log('TOKEN USER:', req.user);

    // ✅ FIXED
    if (req.user._id !== req.params.id) {
      return next(errorHandler(401, 'Unauthorized'));
    }

    const listings = await Listing.find({ userRef: req.params.id });

    res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};
