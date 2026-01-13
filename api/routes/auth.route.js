import express from 'express';
import { signup, signin } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);

router.post('/google', async (req, res) => {
  const { name, email, photo } = req.body;
  res.status(200).json({ name, email, photo });
});

export default router;
