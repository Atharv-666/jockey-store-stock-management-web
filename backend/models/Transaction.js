import mongoose from 'mongoose';

const transactionItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  variantId: {
    type: String,
  },
  size: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  sku: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
});

const transactionSchema = new mongoose.Schema(
  {
    referenceNo: {
      type: String,
      required: true,
      unique: true,
    },
    transactionType: {
      type: String,
      enum: ['SALE', 'RESTOCK', 'RETURN', 'ADJUSTMENT'],
      required: true,
    },
    items: [transactionItemSchema],
    totalAmount: {
      type: Number,
      required: true,
    },
    handledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction;
