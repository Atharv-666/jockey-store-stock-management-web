import React, { useState } from 'react';
import { useStock } from '../context/StockContext';
import { History, Search, IndianRupee } from 'lucide-react';

const SaleHistoryPage = () => {
  const { salesHistory, loading, formatCurrency, theme } = useStock();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const isLight = theme === 'light';
  const categories = ['All', "Men's", "Women's", "Kids", "Accessories"];

  const filteredSales = salesHistory.filter((sale) => {
    const matchesCat = categoryFilter === 'All' || sale.category.toLowerCase() === categoryFilter.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      sale.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.subCategory?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.color?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const totalRevenue = filteredSales.reduce((sum, s) => sum + (s.totalPrice || 0), 0);
  const totalUnits = filteredSales.reduce((sum, s) => sum + (s.quantity || 0), 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl border ${
        isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
      }`}>
        <div>
          <h2 className={`text-2xl font-bold tracking-tight flex items-center gap-2 ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>
            <History className="w-6 h-6 text-indigo-500" />
            Complete Sale History Audit Log (INR ₹)
          </h2>
          <p className={`text-xs mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Chronological audit record of every sales transaction logged by store employees in Indian Rupees.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className={`px-4 py-2 rounded-xl border text-right ${
            isLight ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-800/80 border-slate-700/60'
          }`}>
            <p className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Total Filtered Revenue</p>
            <p className="text-lg font-bold text-emerald-600">{formatCurrency(totalRevenue)}</p>
          </div>
        </div>
      </div>

      {/* Control Filters */}
      <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl border ${
        isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
      }`}>
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Filter by product name, color, or sub-category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full border rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-indigo-500 ${
              isLight ? 'bg-slate-100 border-slate-300 text-slate-900 placeholder-slate-400' : 'bg-slate-800 border-slate-700 text-white placeholder-slate-400'
            }`}
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                categoryFilter === cat
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
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

      {/* Sales History Log Table */}
      <div className={`border rounded-2xl overflow-hidden shadow-xl ${
        isLight ? 'bg-white border-slate-200' : 'bg-slate-900/90 border-slate-800'
      }`}>
        <div className={`p-4 border-b flex justify-between items-center text-xs ${
          isLight ? 'border-slate-200 text-slate-600' : 'border-slate-800 text-slate-400'
        }`}>
          <span>Showing {filteredSales.length} sale records</span>
          <span className="font-semibold">{totalUnits} garments sold in filter</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className={`uppercase tracking-wider text-[10px] ${
              isLight ? 'bg-slate-100 text-slate-600' : 'bg-slate-800/60 text-slate-400'
            }`}>
              <tr>
                <th className="px-5 py-3.5 font-bold">Date & Time</th>
                <th className="px-5 py-3.5 font-bold">Item Name</th>
                <th className="px-5 py-3.5 font-bold">Category</th>
                <th className="px-5 py-3.5 font-bold">Color</th>
                <th className="px-5 py-3.5 font-bold">Size</th>
                <th className="px-5 py-3.5 font-bold">Quantity Sold</th>
                <th className="px-5 py-3.5 font-bold">Unit Price (₹)</th>
                <th className="px-5 py-3.5 font-bold">Total Price (₹)</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${
              isLight ? 'divide-slate-200 text-slate-800' : 'divide-slate-800 text-slate-300'
            }`}>
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-5 py-8 text-center text-slate-400">
                    Loading sales logs...
                  </td>
                </tr>
              ) : filteredSales.length > 0 ? (
                filteredSales.map((sale) => (
                  <tr key={sale._id} className={`transition-colors ${isLight ? 'hover:bg-slate-50' : 'hover:bg-slate-800/40'}`}>
                    <td className="px-5 py-3.5 text-slate-400">
                      {new Date(sale.date).toLocaleString([], {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className={`px-5 py-3.5 font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>{sale.productName}</td>
                    <td className="px-5 py-3.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                        {sale.category}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">{sale.color || 'Standard'}</td>
                    <td className="px-5 py-3.5 font-bold text-indigo-500">{sale.size || 'M'}</td>
                    <td className="px-5 py-3.5 font-bold">{sale.quantity}</td>
                    <td className="px-5 py-3.5 font-medium">{formatCurrency(sale.unitPrice)}</td>
                    <td className="px-5 py-3.5 font-bold text-emerald-600">{formatCurrency(sale.totalPrice)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-5 py-8 text-center text-slate-400">
                    No transaction records matching filter.
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

export default SaleHistoryPage;
