import express from 'express';
import { getInsights } from '../controllers/insight.controller.js';

const router = express.Router();

// GET insights data
router.get('/', getInsights);

export default router;
