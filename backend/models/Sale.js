import mongoose from 'mongoose';

const saleSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product reference is required'],
    },
    productName: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["Men's Wear", "Women's Wear", "Accessories", "Kid's Wear"],
    },
    size: {
      type: String,
      required: [true, 'Size is required'],
      enum: ['S', 'M', 'L', 'XL', 'XXL'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1'],
    },
    unitPrice: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    month: {
      type: String,
      required: true, // Format: "YYYY-MM" e.g. "2026-08"
    },
    date: {
      type: Date,
      default: Date.now,
    },
    soldBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const Sale = mongoose.model('Sale', saleSchema);
export default Sale;
