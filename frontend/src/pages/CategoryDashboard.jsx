import React, { useState, useEffect } from 'react';
import { useStock } from '../context/StockContext';
import axiosClient from '../api/axiosClient';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import { Layers, ArrowLeft, Shirt, Package } from 'lucide-react';
import toast from 'react-hot-toast';

const CategoryDashboard = () => {
  const { selectedCategory, setSelectedCategory, setActiveTab, formatCurrency, theme } = useStock();
  const [categoryData, setCategoryData] = useState(null);
  const [loadingCategory, setLoadingCategory] = useState(true);

  const categories = ["Men's", "Women's", "Kids", "Accessories"];
  const isLight = theme === 'light';

  useEffect(() => {
    fetchCategoryAnalytics(selectedCategory);
  }, [selectedCategory]);

  const fetchCategoryAnalytics = async (catName) => {
    try {
      setLoadingCategory(true);
      const { data } = await axiosClient.get(`/sales/analytics/category/${encodeURIComponent(catName)}`);
      if (data.success) {
        setCategoryData(data.data);
      }
    } catch (error) {
      console.error('Error loading category analytics:', error);
      toast.error('Failed to fetch category analytics');
    } finally {
      setLoadingCategory(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Category Header Selector */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl border ${
        isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
      }`}>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`p-2 rounded-xl transition-colors ${
              isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className={`text-2xl font-bold tracking-tight flex items-center gap-2 ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}>
              <Layers className="w-6 h-6 text-indigo-500" />
              {selectedCategory} Department Dashboard (INR ₹)
            </h2>
            <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Sub-category sales performance and live stock status breakdown
            </p>
          </div>
        </div>

        <div className={`flex items-center gap-2 p-1.5 rounded-xl border overflow-x-auto ${
          isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-800/80 border-slate-700/60'
        }`}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : isLight
                  ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loadingCategory || !categoryData ? (
        <div className="flex items-center justify-center min-h-[300px] text-slate-400">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-medium">Loading {selectedCategory} Metrics...</span>
          </div>
        </div>
      ) : (
        <>
          {/* Sub-category Graph */}
          <div className={`p-5 rounded-2xl border ${
            isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/90 border-slate-800'
          }`}>
            <div className="mb-4">
              <h3 className={`text-base font-bold flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                <Shirt className="w-4 h-4 text-indigo-500" />
                Sub-Category Breakdown ({selectedCategory})
              </h3>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Stock count vs units sold per sub-category</p>
            </div>

            <div className="h-72 w-full">
              {categoryData.subCategoryBreakdown.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData.subCategoryBreakdown} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isLight ? '#e2e8f0' : '#334155'} opacity={0.5} />
                    <XAxis dataKey="subCategory" stroke={isLight ? '#64748b' : '#94a3b8'} fontSize={11} tickLine={false} />
                    <YAxis stroke={isLight ? '#64748b' : '#94a3b8'} fontSize={11} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: isLight ? '#ffffff' : '#0f172a',
                        borderColor: isLight ? '#cbd5e1' : '#334155',
                        borderRadius: '0.75rem',
                        color: isLight ? '#0f172a' : '#f8fafc'
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                    <Bar dataKey="stock" name="Live Stock" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="sold" name="Units Sold" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                  No sub-category data available yet.
                </div>
              )}
            </div>
          </div>

          {/* Live Stock Table for selected category */}
          <div className={`border rounded-2xl overflow-hidden ${
            isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/90 border-slate-800'
          }`}>
            <div className={`p-5 border-b flex items-center justify-between ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
              <div>
                <h3 className={`text-base font-bold flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  <Package className="w-4 h-4 text-indigo-500" />
                  Live Stock Inventory Table - {selectedCategory} (INR ₹)
                </h3>
                <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Total items, sold count, and live remaining quantity in ₹</p>
              </div>
              <button
                onClick={() => setActiveTab('products')}
                className="text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-2 rounded-xl shadow-md shadow-indigo-600/20"
              >
                + Add / Manage Products
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className={`uppercase tracking-wider text-[10px] ${
                  isLight ? 'bg-slate-100 text-slate-600' : 'bg-slate-800/60 text-slate-400'
                }`}>
                  <tr>
                    <th className="px-5 py-3 font-bold">Product</th>
                    <th className="px-5 py-3 font-bold">Sub-Category</th>
                    <th className="px-5 py-3 font-bold">Unit Price (₹)</th>
                    <th className="px-5 py-3 font-bold">Total Stock</th>
                    <th className="px-5 py-3 font-bold">Total Sold</th>
                    <th className="px-5 py-3 font-bold">Min Required</th>
                    <th className="px-5 py-3 font-bold">Stock Status</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${
                  isLight ? 'divide-slate-200 text-slate-800' : 'divide-slate-800 text-slate-300'
                }`}>
                  {categoryData.liveStockTable.length > 0 ? (
                    categoryData.liveStockTable.map((item) => (
                      <tr key={item._id} className={`transition-colors ${isLight ? 'hover:bg-slate-50' : 'hover:bg-slate-800/40'}`}>
                        <td className="px-5 py-3.5 flex items-center gap-3">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-10 h-10 rounded-lg object-cover border border-slate-300"
                          />
                          <div>
                            <p className={`font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>{item.name}</p>
                            <p className="text-[10px] text-slate-400">{item.variants?.length || 0} variant options</p>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 font-medium">{item.subCategory}</td>
                        <td className="px-5 py-3.5 font-semibold text-emerald-600">{formatCurrency(item.price)}</td>
                        <td className={`px-5 py-3.5 font-bold text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>{item.totalStock}</td>
                        <td className="px-5 py-3.5 text-emerald-500 font-semibold">{item.totalSold}</td>
                        <td className="px-5 py-3.5 text-slate-400">{item.minRequiredStock}</td>
                        <td className="px-5 py-3.5">
                          {item.status === 'Out of Stock' && (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-500 border border-rose-500/30">
                              Out of Stock
                            </span>
                          )}
                          {item.status === 'Low Stock' && (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-500 border border-amber-500/30">
                              Low Stock
                            </span>
                          )}
                          {item.status === 'In Stock' && (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-500 border border-emerald-500/30">
                              In Stock
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-5 py-8 text-center text-slate-400">
                        No products listed in {selectedCategory} yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CategoryDashboard;
