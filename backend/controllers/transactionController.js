import asyncHandler from 'express-async-handler';
import Transaction from '../models/Transaction.js';
import Product from '../models/Product.js';

// @desc    Get stock transactions with filters
// @route   GET /api/transactions
// @access  Private
export const getTransactions = asyncHandler(async (req, res) => {
  const { type, search } = req.query;

  let query = {};
  if (type) query.transactionType = type;
  if (search) {
    query.$or = [
      { referenceNo: { $regex: search, $options: 'i' } },
      { notes: { $regex: search, $options: 'i' } },
    ];
  }

  const transactions = await Transaction.find(query)
    .populate('handledBy', 'name email role')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: transactions.length,
    data: transactions,
  });
});

// @desc    Create new stock movement transaction (SALE, RESTOCK, RETURN)
// @route   POST /api/transactions
// @access  Private
export const createTransaction = asyncHandler(async (req, res) => {
  const { transactionType, items, notes } = req.body;

  if (!items || items.length === 0) {
    res.status(400);
    throw new Error('No items provided in transaction request');
  }

  let calculatedTotal = 0;

  // Process stock adjustments for each item
  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product) {
      res.status(404);
      throw new Error(`Product ${item.title} not found`);
    }

    const variant = product.variants.find(
      (v) => (v._id && v._id.toString() === item.variantId) || v.sku === item.sku
    );

    if (!variant) {
      res.status(400);
      throw new Error(`Variant ${item.size} - ${item.color} not found for ${product.title}`);
    }

    // Atomic quantity update based on transaction type
    if (transactionType === 'SALE') {
      if (variant.stockQuantity < item.quantity) {
        res.status(400);
        throw new Error(
          `Insufficient stock for ${product.title} (${item.size}). Required: ${item.quantity}, Available: ${variant.stockQuantity}`
        );
      }
      variant.stockQuantity -= item.quantity;
    } else if (transactionType === 'RESTOCK' || transactionType === 'RETURN') {
      variant.stockQuantity += item.quantity;
    }

    await product.save();
    calculatedTotal += item.price * item.quantity;
  }

  const refNo = `TXN-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

  const transaction = await Transaction.create({
    referenceNo: refNo,
    transactionType,
    items,
    totalAmount: calculatedTotal,
    handledBy: req.user?._id,
    notes: notes || '',
  });

  res.status(201).json({
    success: true,
    data: transaction,
  });
});
