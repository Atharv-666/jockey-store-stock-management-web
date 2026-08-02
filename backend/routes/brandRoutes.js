import express from 'express';
import {
  getBrands,
  createBrand,
  updateBrand,
  deleteBrand,
} from '../controllers/brandController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router
  .route('/')
  .get(getBrands)
  .post(protect, authorize('Admin', 'Manager'), createBrand);

router
  .route('/:id')
  .put(protect, authorize('Admin', 'Manager'), updateBrand)
  .delete(protect, authorize('Admin'), deleteBrand);

export default router;
