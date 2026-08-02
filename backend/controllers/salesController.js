import Product from '../models/Product.js';
import SaleHistory from '../models/SaleHistory.js';
import mongoose from 'mongoose';
import { mockProducts, mockSaleHistory } from '../utils/mockStore.js';

const isMongoConnected = () => mongoose.connection.readyState === 1;

// @desc    Get all sales history
// @route   GET /api/sales
// @access  Public
export const getSaleHistory = async (req, res) => {
  try {
    const { category, search } = req.query;

    if (isMongoConnected()) {
      let query = {};
      if (category && category !== 'All') {
        query.category = category;
      }
      if (search) {
        query.$or = [
          { productName: { $regex: search, $options: 'i' } },
          { subCategory: { $regex: search, $options: 'i' } },
          { color: { $regex: search, $options: 'i' } },
        ];
      }

      const history = await SaleHistory.find(query).sort({ date: -1 });
      return res.json({ success: true, count: history.length, data: history });
    } else {
      let list = [...mockSaleHistory];
      if (category && category !== 'All') {
        list = list.filter((s) => s.category.toLowerCase() === category.toLowerCase());
      }
      if (search) {
        const q = search.toLowerCase();
        list = list.filter(
          (s) =>
            s.productName.toLowerCase().includes(q) ||
            s.subCategory.toLowerCase().includes(q) ||
            s.color.toLowerCase().includes(q)
        );
      }
      return res.json({ success: true, count: list.length, data: list });
    }
  } catch (error) {
    console.error('getSaleHistory Error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching sale history' });
  }
};

// @desc    Get Main Dashboard Analytics (Sales trends & category breakdown)
// @route   GET /api/sales/analytics/dashboard
// @access  Public
export const getDashboardAnalytics = async (req, res) => {
  try {
    let salesData = [];
    let productsData = [];

    if (isMongoConnected()) {
      salesData = await SaleHistory.find().sort({ date: 1 });
      productsData = await Product.find();
    } else {
      salesData = mockSaleHistory;
      productsData = mockProducts;
    }

    // 1. Sales Trend Graph (Grouped by Date)
    const salesByDateMap = {};
    salesData.forEach((item) => {
      const d = new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (!salesByDateMap[d]) {
        salesByDateMap[d] = { date: d, revenue: 0, itemsSold: 0 };
      }
      salesByDateMap[d].revenue += item.totalPrice;
      salesByDateMap[d].itemsSold += item.quantity;
    });

    const salesTrend = Object.values(salesByDateMap);
    // If empty or small, pad with standard days for smooth graph visualization
    if (salesTrend.length === 0) {
      const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      salesTrend.push({ date: today, revenue: 0, itemsSold: 0 });
    }

    // 2. Category Breakdown Chart (Men's, Women's, Kids, Accessories)
    const categoryTotals = {
      "Men's": 0,
      "Women's": 0,
      "Kids": 0,
      "Accessories": 0,
    };

    salesData.forEach((s) => {
      if (categoryTotals[s.category] !== undefined) {
        categoryTotals[s.category] += s.totalPrice;
      }
    });

    const categoryBreakdown = Object.keys(categoryTotals).map((cat) => ({
      name: cat,
      value: Number(categoryTotals[cat].toFixed(2)),
    }));

    // 3. Overall Inventory Summary Numbers
    let totalInventoryItems = 0;
    let totalItemsSold = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;

    productsData.forEach((p) => {
      let prodStock = 0;
      let prodSold = 0;

      if (p.variants && p.variants.length > 0) {
        p.variants.forEach((v) => {
          prodStock += v.stockQuantity || 0;
          prodSold += v.soldQuantity || 0;
        });
      }

      totalInventoryItems += prodStock;
      totalItemsSold += prodSold;

      const minReq = p.minRequiredStock || 10;
      if (prodStock === 0) {
        outOfStockCount++;
      } else if (prodStock < minReq) {
        lowStockCount++;
      }
    });

    // 4. Recent Sales (Top 10)
    const recentSales = salesData.slice(0, 10);

    return res.json({
      success: true,
      data: {
        salesTrend,
        categoryBreakdown,
        summary: {
          totalInventoryItems,
          totalItemsSold,
          lowStockCount,
          outOfStockCount,
          totalRevenue: Number(salesData.reduce((acc, s) => acc + s.totalPrice, 0).toFixed(2)),
        },
        recentSales,
      },
    });
  } catch (error) {
    console.error('getDashboardAnalytics Error:', error);
    res.status(500).json({ success: false, message: 'Server error generating dashboard analytics' });
  }
};

// @desc    Get Category-Specific Analytics & Live Stock Table
// @route   GET /api/sales/analytics/category/:categoryName
// @access  Public
export const getCategoryAnalytics = async (req, res) => {
  try {
    const { categoryName } = req.params;

    let products = [];
    let sales = [];

    if (isMongoConnected()) {
      products = await Product.find({ category: categoryName });
      sales = await SaleHistory.find({ category: categoryName });
    } else {
      products = mockProducts.filter((p) => p.category.toLowerCase() === categoryName.toLowerCase());
      sales = mockSaleHistory.filter((s) => s.category.toLowerCase() === categoryName.toLowerCase());
    }

    // Sub-category distribution calculation
    const subCategoryMap = {};
    products.forEach((p) => {
      const sub = p.subCategory || 'General';
      if (!subCategoryMap[sub]) {
        subCategoryMap[sub] = { subCategory: sub, stock: 0, sold: 0, revenue: 0 };
      }

      let pStock = 0;
      let pSold = 0;
      if (p.variants && p.variants.length > 0) {
        p.variants.forEach((v) => {
          pStock += v.stockQuantity || 0;
          pSold += v.soldQuantity || 0;
        });
      }
      subCategoryMap[sub].stock += pStock;
      subCategoryMap[sub].sold += pSold;
    });

    sales.forEach((s) => {
      const sub = s.subCategory || 'General';
      if (subCategoryMap[sub]) {
        subCategoryMap[sub].revenue += s.totalPrice;
      }
    });

    const subCategoryBreakdown = Object.values(subCategoryMap);

    // Live Stock Table for this category
    const liveStockTable = products.map((p) => {
      let totalStock = 0;
      let totalSold = 0;

      if (p.variants && p.variants.length > 0) {
        p.variants.forEach((v) => {
          totalStock += v.stockQuantity || 0;
          totalSold += v.soldQuantity || 0;
        });
      }

      let status = 'In Stock';
      if (totalStock === 0) status = 'Out of Stock';
      else if (totalStock < p.minRequiredStock) status = 'Low Stock';

      return {
        _id: p._id,
        name: p.name,
        subCategory: p.subCategory,
        price: p.price,
        imageUrl: p.imageUrl,
        totalStock,
        totalSold,
        minRequiredStock: p.minRequiredStock,
        status,
        variants: p.variants,
      };
    });

    return res.json({
      success: true,
      category: categoryName,
      data: {
        subCategoryBreakdown,
        liveStockTable,
      },
    });
  } catch (error) {
    console.error('getCategoryAnalytics Error:', error);
    res.status(500).json({ success: false, message: 'Server error generating category analytics' });
  }
};

// @desc    Get Reports: Low Stock, Out of Stock, New Stock Needed Reorder Sheet
// @route   GET /api/sales/reports
// @access  Public
export const getStockReports = async (req, res) => {
  try {
    let products = [];

    if (isMongoConnected()) {
      products = await Product.find();
    } else {
      products = mockProducts;
    }

    const lowStockList = [];
    const outOfStockList = [];
    const reorderList = [];

    products.forEach((p) => {
      const minReq = p.minRequiredStock || 10;

      if (p.variants && p.variants.length > 0) {
        p.variants.forEach((v) => {
          const stock = v.stockQuantity || 0;
          const variantInfo = {
            productId: p._id,
            productName: p.name,
            category: p.category,
            subCategory: p.subCategory,
            color: v.color,
            size: v.size,
            imageUrl: p.imageUrl,
            price: p.price,
            currentStock: stock,
            minRequiredStock: minReq,
          };

          if (stock === 0) {
            outOfStockList.push({
              ...variantInfo,
              status: 'Urgent Restock Needed',
              reorderQty: minReq,
            });
            reorderList.push({
              ...variantInfo,
              reorderQty: minReq,
              reason: 'Out of Stock',
            });
          } else if (stock < minReq) {
            const needed = minReq - stock;
            lowStockList.push({
              ...variantInfo,
              status: 'Low Stock Warning',
              needed,
            });
            reorderList.push({
              ...variantInfo,
              reorderQty: needed,
              reason: 'Below Minimum Threshold',
            });
          }
        });
      }
    });

    return res.json({
      success: true,
      data: {
        lowStockList,
        outOfStockList,
        reorderList,
      },
    });
  } catch (error) {
    console.error('getStockReports Error:', error);
    res.status(500).json({ success: false, message: 'Server error generating stock reports' });
  }
};
