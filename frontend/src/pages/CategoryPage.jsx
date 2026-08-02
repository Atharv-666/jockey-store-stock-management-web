import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import toast from 'react-hot-toast';
import ProductCard from '../components/product/ProductCard';
import AddProductModal from '../components/product/AddProductModal';
import ReorderSheetModal from '../components/analytics/ReorderSheetModal';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { Plus, Shirt, Sparkles, Watch, Baby, Package, FileSpreadsheet } from 'lucide-react';

const CategoryPage = () => {
  const { categoryName: rawCategory } = useParams();
  const categoryName = rawCategory ? decodeURIComponent(rawCategory) : "Men's Wear";

  const [products, setProducts] = useState([]);
  const [categoryData, setCategoryData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isReorderOpen, setIsReorderOpen] = useState(false);

  useEffect(() => {
    fetchCategoryData();
  }, [categoryName]);

  const fetchCategoryData = async () => {
    setLoading(true);
    try {
      // Fetch category analytics
      const { data: analyticsRes } = await axiosClient.get(
        `/analytics/category/${encodeURIComponent(categoryName)}`
      );
      if (analyticsRes.success) {
        setCategoryData(analyticsRes.data);
      }

      // Fetch products in this category
      const { data: productsRes } = await axiosClient.get(
        `/products?category=${encodeURIComponent(categoryName)}`
      );
      if (productsRes.success) {
        setProducts(productsRes.data);
      }
    } catch (error) {
      toast.error(`Failed to load ${categoryName} category data`);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = () => {
    switch (categoryName) {
      case "Women's Wear":
        return Sparkles;
      case 'Accessories':
        return Watch;
      case "Kid's Wear":
        return Baby;
      default:
        return Shirt;
    }
  };

  const CategoryIcon = getCategoryIcon();

  return (
    <div className="space-y-8 pb-12">
      {/* Category Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-6 rounded-3xl backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-600/20 text-indigo-400 rounded-2xl border border-indigo-500/30">
            <CategoryIcon className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              {categoryName} Department
            </h1>
            <p className="text-slate-400 text-xs md:text-sm mt-0.5">
              Category-specific sales analytics and size-wise inventory management.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsReorderOpen(true)}
            className="px-4 py-2.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold text-xs rounded-2xl transition-all flex items-center gap-2"
          >
            <FileSpreadsheet className="w-4 h-4 text-amber-400" />
            Reorder Sheet
          </button>

          <button
            onClick={() => setIsAddProductOpen(true)}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-2xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add {categoryName} Item
          </button>
        </div>
      </div>

      {/* Category Specific Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Total Products
          </span>
          <span className="text-2xl font-extrabold text-white">
            {categoryData?.productCount || 0}
          </span>
        </div>

        <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Available Inventory
          </span>
          <span className="text-2xl font-extrabold text-emerald-400">
            {categoryData?.totalStock || 0} units
          </span>
        </div>

        <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Units Sold (Revenue)
          </span>
          <span className="text-2xl font-extrabold text-indigo-400">
            {categoryData?.totalSold || 0} (₹{categoryData?.totalRevenue ? categoryData.totalRevenue.toLocaleString('en-IN') : '0'})
          </span>
        </div>
      </div>

      {/* Category Analytics Graph (Size distribution of sales vs stock) */}
      <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-3xl backdrop-blur-xl">
        <h3 className="text-base font-bold text-white mb-1">
          {categoryName} Size Performance Breakdown
        </h3>
        <p className="text-slate-400 text-xs mb-4">
          Units sold vs remaining in stock across sizes (`S`, `M`, `L`, `XL`, `XXL`)
        </p>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={categoryData?.sizeSalesChartData || []}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="size" stroke="#64748b" tick={{ fontSize: 12 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
              />
              <Bar dataKey="inStock" name="In Stock" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="sold" name="Units Sold" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Products Grid */}
      <div>
        <h3 className="text-lg font-bold text-white mb-4">
          {categoryName} Garments ({products.length})
        </h3>

        {loading ? (
          <div className="py-16 text-center text-slate-400 text-sm">
            Loading department items...
          </div>
        ) : products.length === 0 ? (
          <div className="py-16 text-center bg-slate-900/40 border border-slate-800 rounded-2xl">
            <Package className="w-12 h-12 text-slate-600 mx-auto mb-2" />
            <p className="text-base font-bold text-slate-300">No items in {categoryName} yet.</p>
            <button
              onClick={() => setIsAddProductOpen(true)}
              className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold"
            >
              Add First {categoryName} Product
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onProductChange={() => fetchCategoryData()}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <AddProductModal
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        onProductCreated={() => fetchCategoryData()}
      />

      <ReorderSheetModal
        isOpen={isReorderOpen}
        onClose={() => setIsReorderOpen(false)}
      />
    </div>
  );
};

export default CategoryPage;
