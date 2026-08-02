import express from 'express';
import {
  getSaleHistory,
  getDashboardAnalytics,
  getCategoryAnalytics,
  getStockReports,
} from '../controllers/salesController.js';

const router = express.Router();

router.get('/', getSaleHistory);
router.get('/analytics/dashboard', getDashboardAnalytics);
router.get('/analytics/category/:categoryName', getCategoryAnalytics);
router.get('/reports', getStockReports);

export default router;
