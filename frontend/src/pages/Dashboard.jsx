import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import toast from 'react-hot-toast';
import OverviewChart from '../components/analytics/OverviewChart';
import ProductCard from '../components/product/ProductCard';
import AddProductModal from '../components/product/AddProductModal';
import ReorderSheetModal from '../components/analytics/ReorderSheetModal';
import {
  Package,
  ShoppingCart,
  AlertTriangle,
  FileSpreadsheet,
  Plus,
  Search,
  Filter,
  Layers,
  RefreshCw,
  DollarSign,
} from 'lucide-react';

const Dashboard = () => {
  const [overview, setOverview] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStockStatus, setSelectedStockStatus] = useState('All');

  // Modals
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isReorderOpen, setIsReorderOpen] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, [selectedCategory, selectedStockStatus]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch overview metrics & analytics
      const { data: analyticsData } = await axiosClient.get('/analytics/overview');
      if (analyticsData.success) {
        setOverview(analyticsData.data);
      }

      // Fetch products list
      let queryUrl = `/products?category=${selectedCategory}&stockStatus=${selectedStockStatus}`;
      if (search) queryUrl += `&search=${encodeURIComponent(search)}`;

      const { data: productsData } = await axiosClient.get(queryUrl);
      if (productsData.success) {
        setProducts(productsData.data);
      }
    } catch (error) {
      toast.error('Failed to load store inventory dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchDashboardData();
  };

  const metrics = overview?.metrics || {
    totalProducts: 0,
    totalRemainingStock: 0,
    totalUnitsSold: 0,
    totalSalesRevenue: 0,
    lowStockCount: 0,
    totalStockDeficit: 0,
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-6 rounded-3xl backdrop-blur-xl">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Store Inventory Dashboard
          </h1>
          <p className="text-slate-400 text-xs md:text-sm mt-1">
            Real-time size breakdown, sales tracking, and automated reorder calculations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsReorderOpen(true)}
            className="px-4 py-2.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold text-xs rounded-2xl transition-all flex items-center gap-2"
          >
            <FileSpreadsheet className="w-4 h-4 text-amber-400" />
            Supplier Reorder Sheet
          </button>

          <button
            onClick={() => setIsAddProductOpen(true)}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-2xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>
      </div>

      {/* Global Store Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Products</span>
            <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-xl">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white">{metrics.totalProducts}</div>
          <span className="text-[11px] text-slate-500 mt-1 block">Active garments & accessories</span>
        </div>

        <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Units Sold</span>
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
              <ShoppingCart className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-400">{metrics.totalUnitsSold}</div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Revenue: ₹{metrics.totalSalesRevenue ? metrics.totalSalesRevenue.toLocaleString('en-IN') : '0'}
          </span>
        </div>

        <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Low Stock Warning</span>
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-amber-400">{metrics.lowStockCount}</div>
          <span className="text-[11px] text-slate-500 mt-1 block">Items below min threshold</span>
        </div>

        <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Stock Deficit</span>
            <div className="p-2 bg-rose-500/20 text-rose-400 rounded-xl">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-rose-400">-{metrics.totalStockDeficit} units</div>
          <span className="text-[11px] text-slate-500 mt-1 block">Needed to reach min thresholds</span>
        </div>
      </div>

      {/* Analytics Recharts Visual Section */}
      <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-3xl backdrop-blur-xl">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-lg font-bold text-white">Monthly Sales vs Remaining Stock</h2>
            <p className="text-slate-400 text-xs">Category-wise inventory volume and sales velocity performance</p>
          </div>
          <button
            onClick={fetchDashboardData}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <OverviewChart data={overview?.categoryChartData || []} />
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/40 border border-slate-800 p-4 rounded-2xl">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search product name..."
            className="w-full pl-10 pr-4 py-2 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </form>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Category Filter */}
          <div className="flex items-center gap-1.5 bg-slate-950/60 border border-slate-800 px-3 py-1.5 rounded-xl text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-slate-400 font-medium">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent text-slate-200 font-bold focus:outline-none cursor-pointer"
            >
              <option value="All" className="bg-slate-900">All Categories</option>
              <option value="Men's Wear" className="bg-slate-900">Men's Wear</option>
              <option value="Women's Wear" className="bg-slate-900">Women's Wear</option>
              <option value="Accessories" className="bg-slate-900">Accessories</option>
              <option value="Kid's Wear" className="bg-slate-900">Kid's Wear</option>
            </select>
          </div>

          {/* Stock Status Filter */}
          <div className="flex items-center gap-1.5 bg-slate-950/60 border border-slate-800 px-3 py-1.5 rounded-xl text-xs">
            <span className="text-slate-400 font-medium">Status:</span>
            <select
              value={selectedStockStatus}
              onChange={(e) => setSelectedStockStatus(e.target.value)}
              className="bg-transparent text-slate-200 font-bold focus:outline-none cursor-pointer"
            >
              <option value="All" className="bg-slate-900">All Stock Status</option>
              <option value="Healthy Stock" className="bg-slate-900">Healthy Stock</option>
              <option value="Low Stock" className="bg-slate-900">Low Stock</option>
              <option value="Out of Stock" className="bg-slate-900">Out of Stock</option>
            </select>
          </div>
        </div>
      </div>

      {/* Interactive Product Catalog Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-white">
            Garment Catalog Cards ({products.length})
          </h3>
        </div>

        {loading ? (
          <div className="py-16 text-center text-slate-400 text-sm">
            Loading products catalog...
          </div>
        ) : products.length === 0 ? (
          <div className="py-16 text-center bg-slate-900/40 border border-slate-800 rounded-2xl">
            <Package className="w-12 h-12 text-slate-600 mx-auto mb-2" />
            <p className="text-base font-bold text-slate-300">No Products Found</p>
            <p className="text-xs text-slate-500 mt-1">Try adjusting your category or status filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onProductChange={() => fetchDashboardData()}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <AddProductModal
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        onProductCreated={() => fetchDashboardData()}
      />

      <ReorderSheetModal
        isOpen={isReorderOpen}
        onClose={() => setIsReorderOpen(false)}
      />
    </div>
  );
};

export default Dashboard;
