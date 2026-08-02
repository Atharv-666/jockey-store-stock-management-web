import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import toast from 'react-hot-toast';
import {
  X,
  FileSpreadsheet,
  Download,
  Calendar,
  DollarSign,
  TrendingUp,
  RefreshCw,
  ShoppingBag,
} from 'lucide-react';

const MonthlySalesReportModal = ({ isOpen, onClose }) => {
  const now = new Date();
  const defaultMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const [selectedMonth, setSelectedMonth] = useState(defaultMonth);

  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchMonthlySales();
    }
  }, [isOpen, selectedMonth]);

  const fetchMonthlySales = async () => {
    setLoading(true);
    try {
      const { data } = await axiosClient.get(`/sales?month=${selectedMonth}`);
      if (data.success) {
        setSales(data.data);
      }
    } catch (error) {
      toast.error('Failed to load monthly sales report');
    } finally {
      setLoading(false);
    }
  };

  // Calculations for selected month
  const totalRevenue = sales.reduce((acc, s) => acc + (s.totalAmount || 0), 0);
  const totalUnitsSold = sales.reduce((acc, s) => acc + (s.quantity || 0), 0);
  const totalTransactions = sales.length;
  const avgOrderValue = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

  const exportMonthlySalesCSV = () => {
    if (sales.length === 0) {
      toast.error('No sales data available for this month');
      return;
    }

    const headers = [
      'Date & Time',
      'Garment Product Name',
      'Category',
      'Size',
      'Quantity Sold',
      'Unit Price (₹)',
      'Total Revenue (₹)',
      'Sales Agent',
    ];

    const rows = sales.map((s) => [
      `"${new Date(s.date || s.createdAt).toLocaleString()}"`,
      `"${s.productName}"`,
      `"${s.category}"`,
      s.size,
      s.quantity,
      s.unitPrice,
      s.totalAmount,
      `"${s.soldBy?.name || 'Store Staff'}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Monthly_Sales_Report_${selectedMonth}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`Exported Monthly Sales CSV for ${selectedMonth}!`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl text-slate-100 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-600/20 text-indigo-400 rounded-2xl border border-indigo-500/30">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                Monthly Sales Calculation & Report
              </h2>
              <p className="text-slate-400 text-xs mt-0.5">
                Aggregated sales performance & transaction breakdown
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white bg-slate-800/50 p-2 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Month Selector & Controls Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Select Month:
            </span>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-indigo-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="2026-08">August 2026</option>
              <option value="2026-07">July 2026</option>
              <option value="2026-06">June 2026</option>
              <option value="2026-05">May 2026</option>
            </select>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={fetchMonthlySales}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>

            <button
              onClick={exportMonthlySalesCSV}
              disabled={sales.length === 0}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/25 transition-all disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              Export Sales CSV Report
            </button>
          </div>
        </div>

        {/* Monthly Metrics Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-2xl">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              Total Revenue
            </span>
            <span className="text-xl font-extrabold text-emerald-400 mt-1 block">
              ₹{totalRevenue.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-2xl">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              Units Sold
            </span>
            <span className="text-xl font-extrabold text-indigo-400 mt-1 block">
              {totalUnitsSold} units
            </span>
          </div>

          <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-2xl">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              Total Sales Logs
            </span>
            <span className="text-xl font-extrabold text-amber-400 mt-1 block">
              {totalTransactions}
            </span>
          </div>

          <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-2xl">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              Avg Transaction
            </span>
            <span className="text-xl font-extrabold text-purple-400 mt-1 block">
              ₹{avgOrderValue.toFixed(0)}
            </span>
          </div>
        </div>

        {/* Sales Table */}
        <div className="overflow-y-auto flex-1 border border-slate-800 rounded-2xl bg-slate-950/50">
          {loading ? (
            <div className="p-12 text-center text-slate-400 text-sm">
              Calculating monthly sales metrics...
            </div>
          ) : sales.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto mb-2" />
              <p className="text-base font-bold text-slate-300">No Sales Recorded for {selectedMonth}</p>
              <p className="text-xs text-slate-500 mt-1">Use the "Record Manual Sale" button to add sales reports.</p>
            </div>
          ) : (
            <table className="w-full text-left text-xs text-slate-300 border-collapse">
              <thead className="bg-slate-900 sticky top-0 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="p-3">Date & Time</th>
                  <th className="p-3">Product</th>
                  <th className="p-3">Category</th>
                  <th className="p-3 text-center">Size</th>
                  <th className="p-3 text-right">Qty</th>
                  <th className="p-3 text-right">Unit Price</th>
                  <th className="p-3 text-right text-emerald-400">Total Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {sales.map((sale) => (
                  <tr key={sale._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3 text-slate-400 text-[11px]">
                      {new Date(sale.date || sale.createdAt).toLocaleDateString()}{' '}
                      <span className="text-slate-500">
                        {new Date(sale.date || sale.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>
                    <td className="p-3 font-semibold text-slate-100">{sale.productName}</td>
                    <td className="p-3 text-slate-400">{sale.category}</td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 bg-slate-800 text-indigo-300 border border-slate-700 rounded-md font-bold text-[10px]">
                        {sale.size}
                      </span>
                    </td>
                    <td className="p-3 text-right font-bold text-white">{sale.quantity}</td>
                    <td className="p-3 text-right text-slate-400">₹{sale.unitPrice}</td>
                    <td className="p-3 text-right font-extrabold text-emerald-400">
                      ₹{sale.totalAmount.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default MonthlySalesReportModal;
