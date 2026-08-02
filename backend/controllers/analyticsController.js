import asyncHandler from 'express-async-handler';
import Product from '../models/Product.js';
import Sale from '../models/Sale.js';

// @desc    Get main store overview metrics and visual chart data
// @route   GET /api/analytics/overview
// @access  Private
export const getOverviewAnalytics = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  const sales = await Sale.find({});

  const totalProducts = products.length;

  let totalUnitsSold = 0;
  let totalSalesRevenue = 0;
  sales.forEach((s) => {
    totalUnitsSold += s.quantity || 0;
    totalSalesRevenue += s.totalAmount || 0;
  });

  let lowStockCount = 0;
  let totalStockDeficit = 0;
  let totalRemainingStock = 0;

  products.forEach((p) => {
    const stock = p.totalStock;
    totalRemainingStock += stock;
    if (stock < p.minRequiredStock) {
      lowStockCount += 1;
      totalStockDeficit += (p.minRequiredStock - stock);
    }
  });

  // Categories list
  const categories = ["Men's Wear", "Women's Wear", "Accessories", "Kid's Wear"];

  // Category breakdown for Recharts chart: Monthly Sales vs Remaining Stock
  const categoryAnalytics = categories.map((cat) => {
    const catProducts = products.filter((p) => p.category === cat);
    const catSales = sales.filter((s) => s.category === cat);

    const remainingStock = catProducts.reduce((acc, p) => acc + p.totalStock, 0);
    const unitsSold = catSales.reduce((acc, s) => acc + s.quantity, 0);
    const totalRevenue = catSales.reduce((acc, s) => acc + s.totalAmount, 0);

    return {
      category: cat,
      remainingStock,
      unitsSold,
      totalRevenue,
      productCount: catProducts.length,
    };
  });

  res.json({
    success: true,
    data: {
      metrics: {
        totalProducts,
        totalRemainingStock,
        totalUnitsSold,
        totalSalesRevenue,
        lowStockCount,
        totalStockDeficit,
      },
      categoryChartData: categoryAnalytics,
    },
  });
});

// @desc    Get category-specific analytics & performance
// @route   GET /api/analytics/category/:categoryName
// @access  Private
export const getCategoryAnalytics = asyncHandler(async (req, res) => {
  const categoryName = decodeURIComponent(req.params.categoryName);
  const products = await Product.find({ category: categoryName });
  const sales = await Sale.find({ category: categoryName });

  // Size distribution of sales
  const sizeSales = { S: 0, M: 0, L: 0, XL: 0, XXL: 0 };
  sales.forEach((s) => {
    if (sizeSales[s.size] !== undefined) {
      sizeSales[s.size] += s.quantity;
    }
  });

  // Size distribution of current stock
  const sizeStock = { S: 0, M: 0, L: 0, XL: 0, XXL: 0 };
  products.forEach((p) => {
    sizeStock.S += p.sizes.S || 0;
    sizeStock.M += p.sizes.M || 0;
    sizeStock.L += p.sizes.L || 0;
    sizeStock.XL += p.sizes.XL || 0;
    sizeStock.XXL += p.sizes.XXL || 0;
  });

  const totalSold = sales.reduce((acc, s) => acc + s.quantity, 0);
  const totalRevenue = sales.reduce((acc, s) => acc + s.totalAmount, 0);
  const totalStock = products.reduce((acc, p) => acc + p.totalStock, 0);

  res.json({
    success: true,
    data: {
      category: categoryName,
      productCount: products.length,
      totalSold,
      totalRevenue,
      totalStock,
      sizeSalesChartData: Object.keys(sizeSales).map((k) => ({ size: k, sold: sizeSales[k], inStock: sizeStock[k] })),
    },
  });
});

// @desc    Generate 1-Click Supplier Reorder Sheet Calculation
// @route   GET /api/analytics/reorder-sheet
// @access  Private
export const getReorderSheet = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  const sales = await Sale.find({});

  // Current month string "YYYY-MM"
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const reorderList = products.map((product) => {
    const currentStock = product.totalStock;
    const minRequired = product.minRequiredStock;

    // Filter sales for this product in current month
    const thisMonthSales = sales.filter((s) => s.product.toString() === product._id.toString() && s.month === currentMonth);
    const totalSoldThisMonth = thisMonthSales.reduce((acc, s) => acc + s.quantity, 0);

    const currentDeficit = currentStock < minRequired ? minRequired - currentStock : 0;
    
    // Recommended Order Formula: (Total Sold This Month + Minimum Required Stock) - Current Stock
    const recommendedOrderCalculated = (totalSoldThisMonth + minRequired) - currentStock;
    const recommendedOrder = Math.max(0, recommendedOrderCalculated);

    return {
      _id: product._id,
      name: product.name,
      category: product.category,
      price: product.price,
      currentStock,
      minRequiredStock: minRequired,
      sizesStock: product.sizes,
      totalSoldThisMonth,
      currentDeficit,
      recommendedOrder,
      needsRestock: currentStock < minRequired || recommendedOrder > 0,
      imageUrl: product.imageUrl,
    };
  });

  // Filter only items that need reorder or deficit > 0
  const priorityItems = reorderList.filter((item) => item.needsRestock);

  res.json({
    success: true,
    count: priorityItems.length,
    month: currentMonth,
    data: priorityItems,
  });
});
