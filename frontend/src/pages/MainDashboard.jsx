import React from 'react';
import { useStock } from '../context/StockContext';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import {
  TrendingUp,
  Package,
  AlertTriangle,
  XCircle,
  IndianRupee,
  ArrowUpRight,
  Clock,
  Shirt
} from 'lucide-react';

const COLORS = ['#6366f1', '#ec4899', '#10b981', '#f59e0b'];

const MainDashboard = () => {
  const { analytics, loading, setActiveTab, setSelectedCategory, formatCurrency, theme } = useStock();

  if (loading || !analytics) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-slate-400">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-medium">Synchronizing Jockey Analytics...</span>
        </div>
      </div>
    );
  }

  const { salesTrend, categoryBreakdown, summary, recentSales } = analytics;
  const isLight = theme === 'light';

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl border ${
        isLight
          ? 'bg-gradient-to-r from-slate-50 via-indigo-50/50 to-slate-50 border-indigo-200 shadow-sm'
          : 'bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border-indigo-900/30'
      }`}>
        <div>
          <h2 className={`text-2xl font-bold tracking-tight flex items-center gap-2 ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>
            JOCKEY Store Inventory & Sales Overview
          </h2>
          <p className={`text-xs mt-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            Real-time stock tracking, automated re-order thresholds, and live daily transactions in Indian Rupees (₹).
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('products')}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2"
          >
            <Package className="w-4 h-4" />
            Manage Inventory
          </button>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`p-5 rounded-2xl border transition-all ${
          isLight ? 'bg-white border-slate-200 text-slate-900 shadow-sm' : 'bg-slate-900/90 border-slate-800 text-white'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-xs font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Total Stock Items</p>
              <p className="text-2xl font-bold mt-1">{summary.totalInventoryItems}</p>
            </div>
            <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-xl border border-indigo-500/20">
              <Shirt className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-3 text-[11px] text-indigo-500 font-medium">
            Live garment count across sizes
          </div>
        </div>

        <div className={`p-5 rounded-2xl border transition-all ${
          isLight ? 'bg-white border-slate-200 text-slate-900 shadow-sm' : 'bg-slate-900/90 border-slate-800 text-white'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-xs font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Total Revenue (INR)</p>
              <p className="text-2xl font-bold mt-1 text-emerald-500">{formatCurrency(summary.totalRevenue)}</p>
            </div>
            <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl border border-emerald-500/20">
              <IndianRupee className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-3 text-[11px] text-emerald-500 font-medium">
            {summary.totalItemsSold} total garments sold
          </div>
        </div>

        <div
          onClick={() => setActiveTab('low-stock')}
          className={`p-5 rounded-2xl border cursor-pointer hover:border-amber-500/40 transition-all ${
            isLight ? 'bg-white border-slate-200 text-slate-900 shadow-sm' : 'bg-slate-900/90 border-slate-800 text-white'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-xs font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Low Stock Warnings</p>
              <p className="text-2xl font-bold text-amber-500 mt-1">{summary.lowStockCount}</p>
            </div>
            <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl border border-amber-500/20">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-3 text-[11px] text-amber-500 font-medium">
            Below minimum threshold
          </div>
        </div>

        <div
          onClick={() => setActiveTab('out-of-stock')}
          className={`p-5 rounded-2xl border cursor-pointer hover:border-rose-500/40 transition-all ${
            isLight ? 'bg-white border-slate-200 text-slate-900 shadow-sm' : 'bg-slate-900/90 border-slate-800 text-white'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-xs font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Out of Stock Items</p>
              <p className="text-2xl font-bold text-rose-500 mt-1">{summary.outOfStockCount}</p>
            </div>
            <div className="p-3 bg-rose-500/10 text-rose-500 rounded-xl border border-rose-500/20">
              <XCircle className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-3 text-[11px] text-rose-500 font-medium">
            Urgent re-order required
          </div>
        </div>
      </div>

      {/* Analytics Section: Sales Trend & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Sales Trend Chart */}
        <div className={`lg:col-span-2 p-5 rounded-2xl border ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/90 border-slate-800'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className={`text-base font-bold flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                <TrendingUp className="w-4 h-4 text-indigo-500" />
                Sales Revenue Trend (₹ INR)
              </h3>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Daily sales performance & volume in INR</p>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesTrend} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isLight ? '#e2e8f0' : '#334155'} opacity={0.5} />
                <XAxis dataKey="date" stroke={isLight ? '#64748b' : '#94a3b8'} fontSize={11} tickLine={false} />
                <YAxis stroke={isLight ? '#64748b' : '#94a3b8'} fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isLight ? '#ffffff' : '#0f172a',
                    borderColor: isLight ? '#cbd5e1' : '#334155',
                    borderRadius: '0.75rem',
                    color: isLight ? '#0f172a' : '#f8fafc'
                  }}
                  formatter={(val, name) => [name === 'Sales (₹)' ? formatCurrency(val) : val, name]}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="revenue" name="Sales (₹)" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="itemsSold" name="Garments Sold" fill="#ec4899" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown Circle Chart */}
        <div className={`p-5 rounded-2xl border flex flex-col justify-between ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/90 border-slate-800'
        }`}>
          <div>
            <h3 className={`text-base font-bold mb-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>Category Share (INR)</h3>
            <p className={`text-xs mb-4 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Sales breakdown across departments in ₹</p>

            <div className="h-56 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categoryBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isLight ? '#ffffff' : '#0f172a',
                      borderColor: isLight ? '#cbd5e1' : '#334155',
                      borderRadius: '0.75rem',
                      color: isLight ? '#0f172a' : '#f8fafc'
                    }}
                    formatter={(value) => formatCurrency(value)}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className={`grid grid-cols-2 gap-2 pt-2 border-t ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
            {categoryBreakdown.map((item, index) => (
              <div
                key={item.name}
                onClick={() => {
                  setSelectedCategory(item.name);
                  setActiveTab('category');
                }}
                className={`flex items-center gap-2 p-1.5 rounded-lg cursor-pointer transition-colors ${
                  isLight ? 'hover:bg-slate-100' : 'hover:bg-slate-800'
                }`}
              >
                <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                ></div>
                <div className="truncate">
                  <p className={`text-xs font-semibold truncate ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>{item.name}</p>
                  <p className="text-[10px] text-indigo-500 font-bold">{formatCurrency(item.value)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Sales Table */}
      <div className={`border rounded-2xl overflow-hidden ${
        isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/90 border-slate-800'
      }`}>
        <div className={`p-5 border-b flex items-center justify-between ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
          <div>
            <h3 className={`text-base font-bold flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              <Clock className="w-4 h-4 text-indigo-500" />
              Recent Sales Activity (INR ₹)
            </h3>
            <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Live feed of transactions in Indian Rupees</p>
          </div>
          <button
            onClick={() => setActiveTab('sales')}
            className="text-xs font-semibold text-indigo-500 hover:text-indigo-600 flex items-center gap-1"
          >
            View All Sales <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className={`uppercase tracking-wider text-[10px] ${
              isLight ? 'bg-slate-100 text-slate-600' : 'bg-slate-800/60 text-slate-400'
            }`}>
              <tr>
                <th className="px-5 py-3 font-bold">Item Name</th>
                <th className="px-5 py-3 font-bold">Category</th>
                <th className="px-5 py-3 font-bold">Color</th>
                <th className="px-5 py-3 font-bold">Size</th>
                <th className="px-5 py-3 font-bold">Qty Sold</th>
                <th className="px-5 py-3 font-bold">Unit Price (₹)</th>
                <th className="px-5 py-3 font-bold">Total Price (₹)</th>
                <th className="px-5 py-3 font-bold">Timestamp</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${
              isLight ? 'divide-slate-200 text-slate-800' : 'divide-slate-800 text-slate-300'
            }`}>
              {recentSales && recentSales.length > 0 ? (
                recentSales.map((sale) => (
                  <tr key={sale._id || Math.random()} className={`transition-colors ${isLight ? 'hover:bg-slate-50' : 'hover:bg-slate-800/40'}`}>
                    <td className={`px-5 py-3.5 font-medium ${isLight ? 'text-slate-900' : 'text-white'}`}>{sale.productName}</td>
                    <td className="px-5 py-3.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                        {sale.category}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">{sale.color || 'Standard'}</td>
                    <td className="px-5 py-3.5 font-bold text-indigo-500">{sale.size || 'M'}</td>
                    <td className={`px-5 py-3.5 font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>{sale.quantity}</td>
                    <td className="px-5 py-3.5 font-medium">{formatCurrency(sale.unitPrice)}</td>
                    <td className="px-5 py-3.5 font-bold text-emerald-500">{formatCurrency(sale.totalPrice)}</td>
                    <td className={isLight ? 'px-5 py-3.5 text-slate-500' : 'px-5 py-3.5 text-slate-400'}>
                      {new Date(sale.date).toLocaleString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-5 py-8 text-center text-slate-400">
                    No sales recorded yet. Log a sale from the Products page!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MainDashboard;
