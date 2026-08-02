import express from 'express';
import {
  getOverviewAnalytics,
  getCategoryAnalytics,
  getReorderSheet,
} from '../controllers/analyticsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/overview', protect, getOverviewAnalytics);
router.get('/category/:categoryName', protect, getCategoryAnalytics);
router.get('/reorder-sheet', protect, getReorderSheet);

export default router;
