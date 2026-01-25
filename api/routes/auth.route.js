import express from 'express';

import {
  signup,
  signin,
  google,
  signOut,
} from '../controllers/auth.controller.js';

const router = express.Router();

// Sign Up
router.post('/signup', signup);

// Sign In
router.post('/signin', signin);

// Google Auth
router.post('/google', google);

// Logout
router.post('/logout', signOut);

export default router;
