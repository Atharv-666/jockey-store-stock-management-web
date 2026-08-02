import React, { useState } from 'react';
import { useStock } from '../context/StockContext';
import {
  AlertTriangle,
  RefreshCw,
  Search,
  CheckCircle,
  Plus,
  ArrowRight
} from 'lucide-react';
import toast from 'react-hot-toast';

const LowStockWarningPage = () => {
  const { reports, restockProduct, loading, formatCurrency, theme } = useStock();

  const isLight = theme === 'light';
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');

  const categories = ['All', "Men's", "Women's", "Kids", "Accessories"];
  const rawLowStockList = reports.lowStockList || [];

  // Filter list
  const filteredList = rawLowStockList.filter((item) => {
    const matchesCat = selectedCat === 'All' || item.category.toLowerCase() === selectedCat.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.subCategory?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.color?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const totalLowStockItems = filteredList.length;
  const totalDeficitUnits = filteredList.reduce((acc, i) => acc + (i.needed || 0), 0);
  const totalRestockValue = filteredList.reduce((acc, i) => acc + (i.needed || 0) * (i.price || 0), 0);

  const handleQuickRestock = async (item, defaultQty = null) => {
    const qtyInput = defaultQty || prompt(`Enter restock quantity for ${item.productName} (${item.color} / ${item.size}):`, item.needed || 10);
    if (!qtyInput || isNaN(qtyInput) || Number(qtyInput) <= 0) return;

    await restockProduct({
      productId: item.productId,
      color: item.color,
      size: item.size,
      quantity: Number(qtyInput),
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header Banner */}
      <div className={`p-6 rounded-2xl border transition-all ${
        isLight ? 'bg-amber-50/80 border-amber-200 shadow-sm text-slate-900' : 'bg-gradient-to-r from-slate-900 via-amber-950/20 to-slate-900 border-amber-500/30 text-white'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/20 text-amber-500 rounded-xl border border-amber-500/30 shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Low Stock Warnings Table
              </h2>
              <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-600' : 'text-amber-200/80'}`}>
                Garment variants running below store minimum safety threshold (Current Stock {`<`} Required Minimum).
              </p>
            </div>
          </div>
        </div>

        {/* Summary Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className={`p-4 rounded-xl border ${
            isLight ? 'bg-white border-amber-200 text-slate-900' : 'bg-slate-900/90 border-amber-500/20 text-white'
          }`}>
            <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">Low Stock Line Items</p>
            <p className="text-2xl font-bold mt-1">{totalLowStockItems}</p>
          </div>

          <div className={`p-4 rounded-xl border ${
            isLight ? 'bg-white border-amber-200 text-slate-900' : 'bg-slate-900/90 border-amber-500/20 text-white'
          }`}>
            <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">Total Shortage Units Needed</p>
            <p className="text-2xl font-bold text-amber-500 mt-1">+{totalDeficitUnits} garments</p>
          </div>

          <div className={`p-4 rounded-xl border ${
            isLight ? 'bg-white border-amber-200 text-slate-900' : 'bg-slate-900/90 border-amber-500/20 text-white'
          }`}>
            <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">Est. Restock Cost (INR)</p>
            <p className="text-2xl font-bold text-emerald-500 mt-1">{formatCurrency(totalRestockValue)}</p>
          </div>
        </div>
      </div>

      {/* 2. Control Bar */}
      <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl border ${
        isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
      }`}>
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Filter by garment name, color, or size..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full border rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-indigo-500 ${
              isLight ? 'bg-slate-100 border-slate-300 text-slate-900 placeholder-slate-400' : 'bg-slate-800 border-slate-700 text-white placeholder-slate-400'
            }`}
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCat === cat
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : isLight
                  ? 'bg-slate-100 text-slate-600 hover:text-slate-900'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 3. CLEAN HIGH-CONTRAST DATA TABLE */}
      <div className={`border rounded-2xl overflow-hidden shadow-xl ${
        isLight ? 'bg-white border-slate-200' : 'bg-slate-900/90 border-slate-800'
      }`}>
        <div className={`p-4 border-b flex justify-between items-center text-xs ${
          isLight ? 'border-slate-200 text-slate-700' : 'border-slate-800 text-slate-300'
        }`}>
          <span className="font-bold text-sm">Low Stock Inventory Audit Table</span>
          <span className="font-semibold text-amber-600 dark:text-amber-400">{filteredList.length} Items Below Threshold</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className={`uppercase tracking-wider text-[11px] ${
              isLight ? 'bg-slate-100 text-slate-700 border-b border-slate-200' : 'bg-slate-800/80 text-slate-300 border-b border-slate-700'
            }`}>
              <tr>
                <th className="px-6 py-4 font-extrabold">Product / Garment Name</th>
                <th className="px-6 py-4 font-extrabold">Category</th>
                <th className="px-6 py-4 font-extrabold">Color Option</th>
                <th className="px-6 py-4 font-extrabold">Size</th>
                <th className="px-6 py-4 font-extrabold">Current Stock</th>
                <th className="px-6 py-4 font-extrabold">Min Required</th>
                <th className="px-6 py-4 font-extrabold text-rose-500">Shortage Needed</th>
                <th className="px-6 py-4 font-extrabold text-right">Quick Restock</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${
              isLight ? 'divide-slate-200 text-slate-800' : 'divide-slate-800 text-slate-200'
            }`}>
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-6 py-10 text-center text-slate-400 font-medium">
                    Evaluating low stock quantities...
                  </td>
                </tr>
              ) : filteredList.length > 0 ? (
                filteredList.map((item, idx) => (
                  <tr key={idx} className={`transition-colors ${isLight ? 'hover:bg-amber-50/40' : 'hover:bg-slate-800/40'}`}>
                    <td className="px-6 py-4 flex items-center gap-3 min-w-[240px]">
                      <img
                        src={item.imageUrl}
                        alt={item.productName}
                        className="w-11 h-11 rounded-lg object-cover border border-slate-300 shrink-0 shadow-sm"
                      />
                      <div>
                        <p className={`font-bold text-sm leading-snug ${isLight ? 'text-slate-900' : 'text-white'}`}>
                          {item.productName}
                        </p>
                        <p className="text-[11px] text-slate-500 font-medium mt-0.5">{item.subCategory}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-500/20">
                        {item.category}
                      </span>
                    </td>
                    <td className={`px-6 py-4 font-bold whitespace-nowrap ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                      {item.color}
                    </td>
                    <td className="px-6 py-4 font-extrabold text-indigo-600 dark:text-indigo-400 text-sm whitespace-nowrap">
                      {item.size}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 rounded-lg text-xs font-extrabold bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                        {item.currentStock} rem
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-700 dark:text-slate-300 text-sm whitespace-nowrap">
                      {item.minRequiredStock}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 rounded-lg text-xs font-extrabold bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30">
                        +{item.needed} units
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleQuickRestock(item, item.needed)}
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold text-xs shadow-md shadow-indigo-600/20 flex items-center gap-1.5 transition-all"
                        >
                          <Plus className="w-3.5 h-3.5" /> Restock +{item.needed}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center">
                      <CheckCircle className="w-10 h-10 text-emerald-500 mb-2" />
                      <p className={`font-bold text-base ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>Zero Low Stock Warnings!</p>
                      <p className="text-xs text-slate-400 mt-1">All store garment stock level quantities are healthy.</p>
                    </div>
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

export default LowStockWarningPage;
