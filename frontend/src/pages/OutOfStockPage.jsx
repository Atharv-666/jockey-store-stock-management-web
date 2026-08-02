import React, { useState } from 'react';
import { useStock } from '../context/StockContext';
import {
  XCircle,
  RefreshCw,
  Search,
  CheckCircle
} from 'lucide-react';

const OutOfStockPage = () => {
  const { reports, restockProduct, loading, formatCurrency, theme } = useStock();

  const isLight = theme === 'light';
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');

  const categories = ['All', "Men's", "Women's", "Kids", "Accessories"];
  const rawOutOfStockList = reports.outOfStockList || [];

  // Filter list
  const filteredList = rawOutOfStockList.filter((item) => {
    const matchesCat = selectedCat === 'All' || item.category.toLowerCase() === selectedCat.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.subCategory?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.color?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const totalDepletedItems = filteredList.length;
  const totalReorderUnits = filteredList.reduce((acc, i) => acc + (i.reorderQty || 15), 0);
  const totalLostRevenuePotential = filteredList.reduce((acc, i) => acc + (i.price || 0) * (i.minRequiredStock || 10), 0);

  const handleQuickRestock = async (item, defaultQty = null) => {
    const qtyInput = defaultQty || prompt(`Enter restock quantity for ${item.productName} (${item.color} / ${item.size}):`, item.minRequiredStock || 15);
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
        isLight ? 'bg-rose-50/80 border-rose-200 shadow-sm text-slate-900' : 'bg-gradient-to-r from-slate-900 via-rose-950/20 to-slate-900 border-rose-500/30 text-white'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-rose-500/20 text-rose-500 rounded-xl border border-rose-500/30 shrink-0">
              <XCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Out of Stock (Sold Out Items)
              </h2>
              <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-600' : 'text-rose-200/80'}`}>
                Items with 0 remaining stock in store. Require immediate restock order.
              </p>
            </div>
          </div>
        </div>

        {/* Summary Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className={`p-4 rounded-xl border ${
            isLight ? 'bg-white border-rose-200 text-slate-900' : 'bg-slate-900/90 border-rose-500/20 text-white'
          }`}>
            <p className="text-xs font-semibold text-rose-600 dark:text-rose-400">Sold Out Line Items</p>
            <p className="text-2xl font-bold mt-1 text-rose-500">{totalDepletedItems}</p>
          </div>

          <div className={`p-4 rounded-xl border ${
            isLight ? 'bg-white border-rose-200 text-slate-900' : 'bg-slate-900/90 border-rose-500/20 text-white'
          }`}>
            <p className="text-xs font-semibold text-rose-600 dark:text-rose-400">Total Units to Replenish</p>
            <p className="text-2xl font-bold text-rose-500 mt-1">+{totalReorderUnits} garments</p>
          </div>

          <div className={`p-4 rounded-xl border ${
            isLight ? 'bg-white border-rose-200 text-slate-900' : 'bg-slate-900/90 border-rose-500/20 text-white'
          }`}>
            <p className="text-xs font-semibold text-rose-600 dark:text-rose-400">Est. Replenishment Cost (INR)</p>
            <p className="text-2xl font-bold text-emerald-500 mt-1">{formatCurrency(totalLostRevenuePotential)}</p>
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
            placeholder="Filter by sold out item name, color, or size..."
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
                  ? 'bg-rose-600 text-white font-bold shadow-md shadow-rose-600/20'
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
          <span className="font-bold text-sm">Sold Out Items Table (0 Left)</span>
          <span className="font-bold text-rose-500">{filteredList.length} Items Completely Sold Out</span>
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
                <th className="px-6 py-4 font-extrabold">Min Target</th>
                <th className="px-6 py-4 font-extrabold text-rose-500">Status</th>
                <th className="px-6 py-4 font-extrabold text-right">Action</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${
              isLight ? 'divide-slate-200 text-slate-800' : 'divide-slate-800 text-slate-200'
            }`}>
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-6 py-10 text-center text-slate-400 font-medium">
                    Checking sold out stock items...
                  </td>
                </tr>
              ) : filteredList.length > 0 ? (
                filteredList.map((item, idx) => (
                  <tr key={idx} className={`transition-colors ${isLight ? 'hover:bg-rose-50/40' : 'hover:bg-slate-800/40'}`}>
                    <td className="px-6 py-4 flex items-center gap-3 min-w-[240px]">
                      <img
                        src={item.imageUrl}
                        alt={item.productName}
                        className="w-11 h-11 rounded-lg object-cover border border-slate-300 opacity-60 shrink-0 shadow-sm"
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
                      <span className="px-3 py-1 rounded-lg text-xs font-extrabold bg-rose-600 text-white shadow-md shadow-rose-600/20">
                        0 Left (Sold Out)
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-700 dark:text-slate-300 text-sm whitespace-nowrap">
                      {item.minRequiredStock}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30">
                        Sold Out
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleQuickRestock(item, item.minRequiredStock || 15)}
                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-bold text-xs shadow-md shadow-rose-600/20 flex items-center gap-1.5 ml-auto transition-all"
                      >
                        <RefreshCw className="w-3.5 h-3.5" /> Restock +{item.minRequiredStock || 15}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center">
                      <CheckCircle className="w-10 h-10 text-emerald-500 mb-2" />
                      <p className={`font-bold text-base ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>Zero Sold Out Items!</p>
                      <p className="text-xs text-slate-400 mt-1">Every single garment size and color has stock available.</p>
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

export default OutOfStockPage;
