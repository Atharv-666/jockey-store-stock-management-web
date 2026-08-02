import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  recordSale,
  restockProduct,
  deleteProduct,
  seedSampleData,
} from '../controllers/productController.js';

const router = express.Router();

router.get('/', getProducts);
router.post('/', createProduct);
router.post('/seed', seedSampleData);
router.post('/sale', recordSale);
router.post('/restock', restockProduct);
router.get('/:id', getProductById);
router.delete('/:id', deleteProduct);

export default router;
