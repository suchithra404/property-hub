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

// SIGN OUT
router.get('/signout', (req, res) => {
  res.clearCookie('access_token');
  res.status(200).json('Signout success');
});


// Google Auth
router.post('/google', google);

// Logout
router.post('/logout', signOut);

export default router;
