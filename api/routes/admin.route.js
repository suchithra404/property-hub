import express from 'express';

import {
  getAllUsers,
  getAllListings,
  deleteUserByAdmin,
  changeUserRole,
  getAdminLogs, // ✅ ADD
} from '../controllers/admin.controller.js';

import { verifyToken, verifyAdmin } from "../utils/verifyUser.js";

const router = express.Router();


// Admin: get all users
router.get('/users', verifyToken, getAllUsers);

// Admin: get all listings
router.get('/listings', verifyToken, getAllListings);

// Admin: delete user
router.delete('/delete/:id', verifyToken, deleteUserByAdmin);

// Admin: change user role (Superadmin only)
router.put('/role/:id', verifyToken, changeUserRole);

// ✅ Superadmin: get logs
router.get("/logs", verifyToken, verifyAdmin, getAdminLogs);


export default router;
