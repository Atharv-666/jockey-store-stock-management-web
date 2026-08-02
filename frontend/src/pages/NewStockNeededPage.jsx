import React, { useState } from 'react';
import { useStock } from '../context/StockContext';
import { ShoppingCart, Printer, Search, CheckCircle, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const NewStockNeededPage = () => {
  const { reports, loading, fetchAllData, formatCurrency, theme } = useStock();

  const isLight = theme === 'light';
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const categories = ['All', "Men's", "Women's", "Kids", "Accessories"];
  const rawReorderList = reports.reorderList || [];

  // Filter list
  const filteredList = rawReorderList.filter((item) => {
    const matchesCat = selectedCat === 'All' || item.category.toLowerCase() === selectedCat.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.subCategory?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.color?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const totalLineItems = filteredList.length;
  const totalReorderUnits = filteredList.reduce((acc, item) => acc + (item.reorderQty || 0), 0);
  const totalEstimatedCost = filteredList.reduce((acc, item) => acc + (item.reorderQty || 0) * (item.price || 0), 0);

  const handlePrintSheet = async () => {
    setIsRefreshing(true);
    toast.loading('Syncing latest stock data before printing...', { id: 'print-sync' });
    await fetchAllData();
    toast.dismiss('print-sync');
    setIsRefreshing(false);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  return (
    <div className="space-y-6 pb-12 print-container">
      {/* 1. Header Banner */}
      <div className={`p-6 rounded-2xl border transition-all ${
        isLight ? 'bg-indigo-50/70 border-indigo-200 shadow-sm text-slate-900' : 'bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border-indigo-900/30 text-white'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-500/20 text-indigo-500 rounded-xl border border-indigo-500/30 shrink-0">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                New Stock Needed - Store Purchase Order Table
              </h2>
              <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                Auto-calculated reorder quantity = <code className="font-bold text-indigo-600 dark:text-indigo-400">Minimum Required - Remaining Stock</code>
              </p>
            </div>
          </div>

          <button
            onClick={handlePrintSheet}
            disabled={isRefreshing}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2 self-start md:self-auto no-print"
          >
            {isRefreshing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Printer className="w-4 h-4" />}
            <span>Print / Export Purchase Sheet</span>
          </button>
        </div>

        {/* Metric Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className={`p-4 rounded-xl border ${
            isLight ? 'bg-white border-indigo-200 text-slate-900' : 'bg-slate-900/90 border-indigo-500/20 text-white'
          }`}>
            <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">Re-Order Line Items</p>
            <p className="text-2xl font-bold mt-1">{totalLineItems}</p>
          </div>

          <div className={`p-4 rounded-xl border ${
            isLight ? 'bg-white border-indigo-200 text-slate-900' : 'bg-slate-900/90 border-indigo-500/20 text-white'
          }`}>
            <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">Total Garment Units Required</p>
            <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">{totalReorderUnits} garments</p>
          </div>

          <div className={`p-4 rounded-xl border ${
            isLight ? 'bg-white border-indigo-200 text-slate-900' : 'bg-slate-900/90 border-indigo-500/20 text-white'
          }`}>
            <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">Est. Purchase Cost (INR ₹)</p>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{formatCurrency(totalEstimatedCost)}</p>
          </div>
        </div>
      </div>

      {/* 2. Control Bar */}
      <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl border no-print ${
        isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
      }`}>
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Filter reorder item, color, or size..."
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
                  ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/20'
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
          <span className="font-bold text-sm">Store Purchase Order Shopping Manifest</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-extrabold text-xs">Total Purchase Cost: {formatCurrency(totalEstimatedCost)}</span>
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
                <th className="px-6 py-4 font-extrabold text-indigo-600 dark:text-indigo-400">Reorder Qty Needed</th>
                <th className="px-6 py-4 font-extrabold">Est. Cost (₹)</th>
                <th className="px-6 py-4 font-extrabold">Status Reason</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${
              isLight ? 'divide-slate-200 text-slate-800' : 'divide-slate-800 text-slate-200'
            }`}>
              {loading ? (
                <tr>
                  <td colSpan="9" className="px-6 py-10 text-center text-slate-400 font-medium">
                    Calculating reorder sheet...
                  </td>
                </tr>
              ) : filteredList.length > 0 ? (
                filteredList.map((item, idx) => (
                  <tr key={idx} className={`transition-colors ${isLight ? 'hover:bg-slate-50' : 'hover:bg-slate-800/40'}`}>
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
                      <span className={`px-3 py-1 rounded-lg text-xs font-extrabold border ${
                        item.currentStock === 0
                          ? 'bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30'
                      }`}>
                        {item.currentStock} rem
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-700 dark:text-slate-300 text-sm whitespace-nowrap">
                      {item.minRequiredStock}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-extrabold bg-indigo-600 text-white shadow-md shadow-indigo-600/20">
                        Buy +{item.reorderQty} units
                      </span>
                    </td>
                    <td className="px-6 py-4 font-extrabold text-emerald-600 dark:text-emerald-400 text-sm whitespace-nowrap">
                      {formatCurrency((item.reorderQty || 0) * (item.price || 0))}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-[11px] font-extrabold border whitespace-nowrap ${
                        item.reason === 'Out of Stock'
                          ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30'
                      }`}>
                        {item.reason}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="px-6 py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center">
                      <CheckCircle className="w-10 h-10 text-emerald-500 mb-2" />
                      <p className={`font-bold text-base ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>Re-Order Shopping List is Empty!</p>
                      <p className="text-xs text-slate-400 mt-1">All garment stock levels satisfy minimum store requirements.</p>
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

export default NewStockNeededPage;
