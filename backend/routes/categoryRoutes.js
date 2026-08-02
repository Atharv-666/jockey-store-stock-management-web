import express from 'express';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router
  .route('/')
  .get(getCategories)
  .post(protect, authorize('Admin', 'Manager'), createCategory);

router
  .route('/:id')
  .put(protect, authorize('Admin', 'Manager'), updateCategory)
  .delete(protect, authorize('Admin'), deleteCategory);

export default router;
