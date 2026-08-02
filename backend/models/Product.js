import mongoose from 'mongoose';

const variantSchema = new mongoose.Schema({
  color: {
    type: String,
    required: true,
    default: 'Standard',
    trim: true,
  },
  size: {
    type: String,
    required: true,
    default: 'Free-Size',
    trim: true,
  },
  stockQuantity: {
    type: Number,
    required: true,
    default: 0,
    min: [0, 'Stock quantity cannot be negative'],
  },
  soldQuantity: {
    type: Number,
    required: true,
    default: 0,
    min: [0, 'Sold quantity cannot be negative'],
  },
});

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ["Men's", "Women's", "Kids", "Accessories"],
    },
    subCategory: {
      type: String,
      required: [true, 'Sub-category is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative'],
    },
    imageUrl: {
      type: String,
      required: [true, 'Product image URL is compulsory'],
      trim: true,
    },
    minRequiredStock: {
      type: Number,
      required: [true, 'Minimum required stock threshold is required'],
      default: 10,
      min: [0, 'Minimum required stock cannot be negative'],
    },
    isFreeSize: {
      type: Boolean,
      default: false,
    },
    variants: [variantSchema],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual calculation for total stock across all variants
productSchema.virtual('totalStock').get(function () {
  if (!this.variants || this.variants.length === 0) return 0;
  return this.variants.reduce((sum, v) => sum + (v.stockQuantity || 0), 0);
});

// Virtual calculation for total sold across all variants
productSchema.virtual('totalSold').get(function () {
  if (!this.variants || this.variants.length === 0) return 0;
  return this.variants.reduce((sum, v) => sum + (v.soldQuantity || 0), 0);
});

// Virtual calculation for overall stock status badge
productSchema.virtual('stockStatus').get(function () {
  const total = this.totalStock;
  if (total === 0) return 'Out of Stock';
  if (total < this.minRequiredStock) return 'Low Stock';
  return 'In Stock';
});

// Virtual calculation for reorder quantity needed
productSchema.virtual('reorderNeeded').get(function () {
  const total = this.totalStock;
  const minNeeded = this.minRequiredStock || 0;
  return total < minNeeded ? minNeeded - total : 0;
});

const Product = mongoose.model('Product', productSchema);
export default Product;
