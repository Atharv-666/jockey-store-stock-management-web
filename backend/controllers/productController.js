import Product from '../models/Product.js';
import SaleHistory from '../models/SaleHistory.js';
import mongoose from 'mongoose';
import { mockProducts, mockSaleHistory } from '../utils/mockStore.js';

// Helper to check if Mongoose is connected
const isMongoConnected = () => mongoose.connection.readyState === 1;

// Sample Jockey Inventory Seed Data
const defaultJockeyProducts = [
  {
    name: 'Jockey Modern Classic Super Combed Cotton Polo',
    category: "Men's",
    subCategory: 'Polos',
    price: 1299.00,
    imageUrl: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&q=80&w=800',
    minRequiredStock: 20,
    isFreeSize: false,
    variants: [
      { color: 'Navy Blue', size: 'M', stockQuantity: 18, soldQuantity: 24 },
      { color: 'Navy Blue', size: 'L', stockQuantity: 14, soldQuantity: 30 },
      { color: 'White', size: 'M', stockQuantity: 5, soldQuantity: 28 },
      { color: 'Black', size: 'L', stockQuantity: 0, soldQuantity: 20 }
    ]
  },
  {
    name: 'Jockey USA Premium Athletic Trackpants',
    category: "Men's",
    subCategory: 'Trackpants',
    price: 1899.00,
    imageUrl: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&q=80&w=800',
    minRequiredStock: 15,
    isFreeSize: false,
    variants: [
      { color: 'Charcoal Grey', size: 'M', stockQuantity: 12, soldQuantity: 18 },
      { color: 'Charcoal Grey', size: 'L', stockQuantity: 8, soldQuantity: 14 },
      { color: 'Black', size: 'XL', stockQuantity: 3, soldQuantity: 10 }
    ]
  },
  {
    name: 'Jockey Super Combed Cotton Trunk (Pack of 3)',
    category: "Men's",
    subCategory: 'Innerwear',
    price: 899.00,
    imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=800',
    minRequiredStock: 25,
    isFreeSize: false,
    variants: [
      { color: 'Assorted Dark', size: 'M', stockQuantity: 28, soldQuantity: 45 },
      { color: 'Assorted Dark', size: 'L', stockQuantity: 20, soldQuantity: 38 }
    ]
  },
  {
    name: 'Jockey Seamless Padded Active Bra',
    category: "Women's",
    subCategory: 'Activewear',
    price: 1499.00,
    imageUrl: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&q=80&w=800',
    minRequiredStock: 15,
    isFreeSize: false,
    variants: [
      { color: 'Rose Pink', size: 'S', stockQuantity: 6, soldQuantity: 16 },
      { color: 'Rose Pink', size: 'M', stockQuantity: 2, soldQuantity: 22 },
      { color: 'Black', size: 'M', stockQuantity: 0, soldQuantity: 19 }
    ]
  },
  {
    name: 'Jockey Soft Cotton Printed Lounge Dress',
    category: "Women's",
    subCategory: 'Dresses',
    price: 1699.00,
    imageUrl: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=80&w=800',
    minRequiredStock: 12,
    isFreeSize: false,
    variants: [
      { color: 'Teal Blue', size: 'S', stockQuantity: 10, soldQuantity: 12 },
      { color: 'Teal Blue', size: 'M', stockQuantity: 7, soldQuantity: 15 }
    ]
  },
  {
    name: 'Jockey Junior Boys Printed Cotton Tee',
    category: "Kids",
    subCategory: 'Boys',
    price: 699.00,
    imageUrl: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&q=80&w=800',
    minRequiredStock: 15,
    isFreeSize: false,
    variants: [
      { color: 'Bright Red', size: 'S', stockQuantity: 14, soldQuantity: 10 },
      { color: 'Bright Red', size: 'M', stockQuantity: 9, soldQuantity: 12 }
    ]
  },
  {
    name: 'Jockey Girls Soft Stretch Leggings',
    category: "Kids",
    subCategory: 'Girls',
    price: 799.00,
    imageUrl: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=800',
    minRequiredStock: 10,
    isFreeSize: false,
    variants: [
      { color: 'Navy Blue', size: 'S', stockQuantity: 4, soldQuantity: 14 },
      { color: 'Navy Blue', size: 'M', stockQuantity: 0, soldQuantity: 11 }
    ]
  },
  {
    name: 'Jockey Cushion Sole Ankle Socks (Pack of 3)',
    category: "Accessories",
    subCategory: 'Socks',
    price: 499.00,
    imageUrl: 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?auto=format&fit=crop&q=80&w=800',
    minRequiredStock: 30,
    isFreeSize: true,
    variants: [
      { color: 'White & Grey', size: 'Free-Size', stockQuantity: 42, soldQuantity: 60 },
      { color: 'All Black', size: 'Free-Size', stockQuantity: 12, soldQuantity: 48 }
    ]
  },
  {
    name: 'Jockey Adjustable Athletic Sports Cap',
    category: "Accessories",
    subCategory: 'Caps',
    price: 899.00,
    imageUrl: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=800',
    minRequiredStock: 15,
    isFreeSize: true,
    variants: [
      { color: 'Black USA Logo', size: 'Free-Size', stockQuantity: 18, soldQuantity: 25 },
      { color: 'White Sports', size: 'Free-Size', stockQuantity: 3, soldQuantity: 17 }
    ]
  },
  {
    name: 'Jockey Leather Executive Belt',
    category: "Accessories",
    subCategory: 'Belts',
    price: 1499.00,
    imageUrl: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&q=80&w=800',
    minRequiredStock: 15,
    isFreeSize: true,
    variants: [
      { color: 'Black Leather', size: 'Free-Size', stockQuantity: 16, soldQuantity: 22 },
      { color: 'Brown Leather', size: 'Free-Size', stockQuantity: 4, soldQuantity: 19 }
    ]
  }
];

// @desc    Get all products with optional filters
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const { category, subCategory, search } = req.query;

    if (isMongoConnected()) {
      let query = {};
      if (category && category !== 'All') {
        query.category = category;
      }
      if (subCategory && subCategory !== 'All') {
        query.subCategory = subCategory;
      }
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { subCategory: { $regex: search, $options: 'i' } },
        ];
      }

      let products = await Product.find(query).sort({ createdAt: -1 });

      // AUTO-SEED if DB is empty so user ALWAYS sees rich sample data!
      if (products.length === 0 && (!category || category === 'All') && !search) {
        console.log('Database empty. Auto-seeding initial Jockey inventory...');
        products = await Product.create(defaultJockeyProducts);
      }

      return res.json({ success: true, count: products.length, data: products });
    } else {
      // In-Memory Fallback
      let list = [...mockProducts];
      if (category && category !== 'All') {
        list = list.filter((p) => p.category.toLowerCase() === category.toLowerCase());
      }
      if (subCategory && subCategory !== 'All') {
        list = list.filter((p) => p.subCategory.toLowerCase() === subCategory.toLowerCase());
      }
      if (search) {
        const q = search.toLowerCase();
        list = list.filter(
          (p) => p.name.toLowerCase().includes(q) || p.subCategory.toLowerCase().includes(q)
        );
      }
      return res.json({ success: true, count: list.length, data: list });
    }
  } catch (error) {
    console.error('getProducts Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error fetching products' });
  }
};

// @desc    Seed Sample Data (Explicit Endpoint Trigger)
// @route   POST /api/products/seed
// @access  Public
export const seedSampleData = async (req, res) => {
  try {
    if (isMongoConnected()) {
      await Product.deleteMany({});
      await SaleHistory.deleteMany({});

      const createdProducts = await Product.create(defaultJockeyProducts);

      // Create sample sales history
      const sampleSales = [
        {
          productId: createdProducts[0]._id,
          productName: createdProducts[0].name,
          category: createdProducts[0].category,
          subCategory: createdProducts[0].subCategory,
          color: 'Navy Blue',
          size: 'M',
          quantity: 2,
          unitPrice: createdProducts[0].price,
          totalPrice: createdProducts[0].price * 2,
          date: new Date(Date.now() - 2 * 3600000),
        },
        {
          productId: createdProducts[3]._id,
          productName: createdProducts[3].name,
          category: createdProducts[3].category,
          subCategory: createdProducts[3].subCategory,
          color: 'Rose Pink',
          size: 'M',
          quantity: 1,
          unitPrice: createdProducts[3].price,
          totalPrice: createdProducts[3].price,
          date: new Date(Date.now() - 5 * 3600000),
        },
        {
          productId: createdProducts[7]._id,
          productName: createdProducts[7].name,
          category: createdProducts[7].category,
          subCategory: createdProducts[7].subCategory,
          color: 'White & Grey',
          size: 'Free-Size',
          quantity: 3,
          unitPrice: createdProducts[7].price,
          totalPrice: createdProducts[7].price * 3,
          date: new Date(Date.now() - 12 * 3600000),
        },
      ];

      await SaleHistory.create(sampleSales);
      return res.json({ success: true, message: 'Sample Jockey inventory & sales history seeded into MongoDB successfully!' });
    } else {
      // Refresh memory mock store
      mockProducts.length = 0;
      mockSaleHistory.length = 0;

      defaultJockeyProducts.forEach((p, idx) => {
        mockProducts.push({
          _id: 'jck_' + (100 + idx),
          ...p,
          variants: p.variants.map((v, vIdx) => ({ _id: 'v_' + idx + '_' + vIdx, ...v })),
          createdAt: new Date().toISOString(),
        });
      });

      mockSaleHistory.push({
        _id: 'sale_jck_1',
        productId: mockProducts[0]._id,
        productName: mockProducts[0].name,
        category: mockProducts[0].category,
        subCategory: mockProducts[0].subCategory,
        color: 'Navy Blue',
        size: 'M',
        quantity: 2,
        unitPrice: mockProducts[0].price,
        totalPrice: mockProducts[0].price * 2,
        date: new Date(Date.now() - 2 * 3600000).toISOString(),
      });

      return res.json({ success: true, message: 'Sample Jockey inventory & sales history seeded in memory successfully!' });
    }
  } catch (error) {
    console.error('seedSampleData Error:', error);
    res.status(500).json({ success: false, message: 'Failed to seed sample data' });
  }
};

// @desc    Get single product details
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (isMongoConnected()) {
      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
      return res.json({ success: true, data: product });
    } else {
      const product = mockProducts.find((p) => p._id === id);
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
      return res.json({ success: true, data: product });
    }
  } catch (error) {
    console.error('getProductById Error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching product' });
  }
};

// @desc    Create a new product
// @route   POST /api/products
// @access  Public
export const createProduct = async (req, res) => {
  try {
    const { name, category, subCategory, price, imageUrl, minRequiredStock, isFreeSize, variants } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Product name is required' });
    }
    if (!category) {
      return res.status(400).json({ success: false, message: 'Category is required' });
    }
    if (!subCategory || !subCategory.trim()) {
      return res.status(400).json({ success: false, message: 'Sub-category is required' });
    }
    if (price === undefined || Number(price) < 0) {
      return res.status(400).json({ success: false, message: 'Valid positive price is required' });
    }
    if (!imageUrl || !imageUrl.trim()) {
      return res.status(400).json({ success: false, message: 'Product Image URL is compulsory' });
    }

    const minStock = Number(minRequiredStock) >= 0 ? Number(minRequiredStock) : 10;
    const numPrice = Number(price);

    let processedVariants = [];
    if (isFreeSize || category === 'Accessories') {
      if (Array.isArray(variants) && variants.length > 0) {
        processedVariants = variants.map((v) => ({
          color: v.color && v.color.trim() ? v.color.trim() : 'Standard',
          size: 'Free-Size',
          stockQuantity: Math.max(0, Number(v.stockQuantity) || 0),
          soldQuantity: 0,
        }));
      } else {
        processedVariants.push({
          color: 'Standard',
          size: 'Free-Size',
          stockQuantity: 15,
          soldQuantity: 0,
        });
      }
    } else if (Array.isArray(variants) && variants.length > 0) {
      processedVariants = variants.map((v) => ({
        color: v.color && v.color.trim() ? v.color.trim() : 'Standard',
        size: v.size && v.size.trim() ? v.size.trim() : 'M',
        stockQuantity: Math.max(0, Number(v.stockQuantity) || 0),
        soldQuantity: 0,
      }));
    } else {
      processedVariants.push({
        color: 'Standard',
        size: 'M',
        stockQuantity: 10,
        soldQuantity: 0,
      });
    }

    if (isMongoConnected()) {
      const newProduct = await Product.create({
        name,
        category,
        subCategory,
        price: numPrice,
        imageUrl,
        minRequiredStock: minStock,
        isFreeSize: Boolean(isFreeSize || category === 'Accessories'),
        variants: processedVariants,
      });
      return res.status(201).json({ success: true, message: 'Product created successfully', data: newProduct });
    } else {
      const newProduct = {
        _id: 'prod_' + Date.now(),
        name,
        category,
        subCategory,
        price: numPrice,
        imageUrl,
        minRequiredStock: minStock,
        isFreeSize: Boolean(isFreeSize || category === 'Accessories'),
        variants: processedVariants.map((v, i) => ({ ...v, _id: 'v_' + Date.now() + '_' + i })),
        createdAt: new Date().toISOString(),
      };
      mockProducts.unshift(newProduct);
      return res.status(201).json({ success: true, message: 'Product created successfully (Mock)', data: newProduct });
    }
  } catch (error) {
    console.error('createProduct Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error creating product' });
  }
};

// @desc    Record a sale
// @route   POST /api/products/sale
// @access  Public
export const recordSale = async (req, res) => {
  try {
    const { productId, color, size, quantity } = req.body;

    const qty = Number(quantity);
    if (!productId || !qty || qty <= 0 || !Number.isInteger(qty)) {
      return res.status(400).json({ success: false, message: 'Quantity must be a positive integer' });
    }

    const targetColor = color || 'Standard';
    const targetSize = size || 'Free-Size';

    if (isMongoConnected()) {
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }

      const variant = product.variants.find(
        (v) => v.color.toLowerCase() === targetColor.toLowerCase() && v.size.toLowerCase() === targetSize.toLowerCase()
      );

      if (!variant) {
        return res.status(400).json({
          success: false,
          message: `Variant (${targetColor} - ${targetSize}) not available`,
        });
      }

      if (variant.stockQuantity < qty) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock! Only ${variant.stockQuantity} units available for ${targetColor} - ${targetSize}.`,
        });
      }

      const updatedProduct = await Product.findOneAndUpdate(
        {
          _id: productId,
          'variants._id': variant._id,
          'variants.stockQuantity': { $gte: qty },
        },
        {
          $inc: {
            'variants.$.stockQuantity': -qty,
            'variants.$.soldQuantity': qty,
          },
        },
        { new: true, runValidators: true }
      );

      if (!updatedProduct) {
        return res.status(400).json({
          success: false,
          message: 'Stock update failed due to concurrent transactions or insufficient quantity.',
        });
      }

      const unitPrice = product.price;
      const totalPrice = Number((unitPrice * qty).toFixed(2));

      const saleRecord = await SaleHistory.create({
        productId: product._id,
        productName: product.name,
        category: product.category,
        subCategory: product.subCategory,
        color: targetColor,
        size: targetSize,
        quantity: qty,
        unitPrice,
        totalPrice,
        date: new Date(),
      });

      return res.json({
        success: true,
        message: `Sale logged: ${qty}x ${product.name} (${targetColor} / ${targetSize})`,
        data: {
          product: updatedProduct,
          saleRecord,
        },
      });
    } else {
      const product = mockProducts.find((p) => p._id === productId);
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }

      const variant = product.variants.find(
        (v) => v.color.toLowerCase() === targetColor.toLowerCase() && v.size.toLowerCase() === targetSize.toLowerCase()
      );

      if (!variant) {
        return res.status(400).json({
          success: false,
          message: `Variant (${targetColor} - ${targetSize}) not available`,
        });
      }

      if (variant.stockQuantity < qty) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock! Only ${variant.stockQuantity} units available.`,
        });
      }

      variant.stockQuantity -= qty;
      variant.soldQuantity = (variant.soldQuantity || 0) + qty;

      const unitPrice = product.price;
      const totalPrice = Number((unitPrice * qty).toFixed(2));

      const saleRecord = {
        _id: 'sale_' + Date.now(),
        productId: product._id,
        productName: product.name,
        category: product.category,
        subCategory: product.subCategory,
        color: targetColor,
        size: targetSize,
        quantity: qty,
        unitPrice,
        totalPrice,
        date: new Date().toISOString(),
      };

      mockSaleHistory.unshift(saleRecord);

      return res.json({
        success: true,
        message: `Sale logged: ${qty}x ${product.name} (${targetColor} / ${targetSize})`,
        data: {
          product,
          saleRecord,
        },
      });
    }
  } catch (error) {
    console.error('recordSale Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error recording sale' });
  }
};

// @desc    Restock a product variant
// @route   POST /api/products/restock
// @access  Public
export const restockProduct = async (req, res) => {
  try {
    const { productId, color, size, quantity } = req.body;

    const qty = Number(quantity);
    if (!productId || !qty || qty <= 0 || !Number.isInteger(qty)) {
      return res.status(400).json({ success: false, message: 'Added quantity must be a positive integer' });
    }

    const targetColor = color || 'Standard';
    const targetSize = size || 'Free-Size';

    if (isMongoConnected()) {
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }

      const variant = product.variants.find(
        (v) => v.color.toLowerCase() === targetColor.toLowerCase() && v.size.toLowerCase() === targetSize.toLowerCase()
      );

      if (!variant) {
        product.variants.push({
          color: targetColor,
          size: targetSize,
          stockQuantity: qty,
          soldQuantity: 0,
        });
        await product.save();
        return res.json({ success: true, message: `Restocked ${qty} units of new variant`, data: product });
      }

      const updatedProduct = await Product.findOneAndUpdate(
        {
          _id: productId,
          'variants._id': variant._id,
        },
        {
          $inc: {
            'variants.$.stockQuantity': qty,
          },
        },
        { new: true, runValidators: true }
      );

      return res.json({
        success: true,
        message: `Restocked ${qty} units for ${product.name} (${targetColor} / ${targetSize})`,
        data: updatedProduct,
      });
    } else {
      const product = mockProducts.find((p) => p._id === productId);
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }

      let variant = product.variants.find(
        (v) => v.color.toLowerCase() === targetColor.toLowerCase() && v.size.toLowerCase() === targetSize.toLowerCase()
      );

      if (!variant) {
        variant = {
          _id: 'v_' + Date.now(),
          color: targetColor,
          size: targetSize,
          stockQuantity: qty,
          soldQuantity: 0,
        };
        product.variants.push(variant);
      } else {
        variant.stockQuantity += qty;
      }

      return res.json({
        success: true,
        message: `Restocked ${qty} units for ${product.name} (${targetColor} / ${targetSize})`,
        data: product,
      });
    }
  } catch (error) {
    console.error('restockProduct Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error restocking product' });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Public
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (isMongoConnected()) {
      const deleted = await Product.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
      return res.json({ success: true, message: 'Product removed from stock inventory' });
    } else {
      const idx = mockProducts.findIndex((p) => p._id === id);
      if (idx === -1) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
      mockProducts.splice(idx, 1);
      return res.json({ success: true, message: 'Product removed from stock inventory' });
    }
  } catch (error) {
    console.error('deleteProduct Error:', error);
    res.status(500).json({ success: false, message: 'Server error deleting product' });
  }
};
