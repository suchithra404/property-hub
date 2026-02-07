import User from '../models/user.model.js';
import AdminLog from '../models/adminLog.model.js';
import Listing from '../models/listing.model.js';
import { errorHandler } from '../utils/error.js';


// =======================
// Get all users (Admin)
// =======================
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};


// =======================
// Get all listings (Admin)
// =======================
export const getAllListings = async (req, res, next) => {
  try {
    const listings = await Listing.find();
    res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};


// =======================
// Delete user (Admin)
// =======================
export const deleteUserByAdmin = async (req, res, next) => {
  try {

    const user = await User.findById(req.params.id);

    if (!user) {
      return next(errorHandler(404, 'User not found'));
    }

    // ❗ Protect admin & superadmin
    if (user.role === 'admin' || user.role === 'superadmin') {
      return next(
        errorHandler(403, 'Admin / Superadmin account cannot be deleted')
      );
    }

    // ✅ Save data BEFORE delete
    const deletedUserId = user._id;
    const deletedUsername = user.username;

    await User.findByIdAndDelete(req.params.id);

    // ✅ SAVE LOG (IMPORTANT FIX)
    await AdminLog.create({
      actionBy: req.user._id,

      actionOn: deletedUserId,
      actionOnName: deletedUsername, // ✅ REQUIRED

      actionType: 'DELETE_USER',

      message: `User ${deletedUsername} deleted by ${req.user.role}`,
    });

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });

  } catch (error) {
    next(error);
  }
};




// =======================
// Change user role (Superadmin only)
// =======================
export const changeUserRole = async (req, res, next) => {
  try {

    // 🔐 Only superadmin
    if (req.user.role !== 'superadmin') {
      return next(
        errorHandler(403, 'Only superadmin can change user roles')
      );
    }

    const { role } = req.body;

    if (!role) {
      return next(errorHandler(400, 'Role is required'));
    }

    if (!['user', 'admin'].includes(role)) {
      return next(errorHandler(400, 'Invalid role'));
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return next(errorHandler(404, 'User not found'));
    }

    // ❗ Protect superadmin
    if (user.role === 'superadmin') {
      return next(
        errorHandler(403, 'Superadmin role cannot be changed')
      );
    }

    const oldRole = user.role;

    user.role = role;

    await user.save();

    // ✅ SAVE LOG (IMPORTANT FIX)
    await AdminLog.create({
      actionBy: req.user._id,

      actionOn: user._id,
      actionOnName: user.username, // ✅ REQUIRED

      actionType: 'CHANGE_ROLE',

      message: `Role changed from ${oldRole} to ${role}`,
    });

    res.status(200).json({
      success: true,
      message: 'User role updated successfully',
      user,
    });

  } catch (error) {
    next(error);
  }
};



// =======================
// ✅ Get Admin Logs (Admin + Superadmin)
// =======================
export const getAdminLogs = async (req, res, next) => {
  try {

    const logs = await AdminLog.find()
      .populate('actionBy', 'username email role')
      .populate('actionOn', 'username email role')
      .sort({ createdAt: -1 });

    res.status(200).json(logs);

  } catch (error) {
    next(error);
  }
};

