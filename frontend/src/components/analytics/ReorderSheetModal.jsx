import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import toast from 'react-hot-toast';
import { X, Download, FileSpreadsheet, AlertTriangle, RefreshCw, CheckCircle2 } from 'lucide-react';

const ReorderSheetModal = ({ isOpen, onClose }) => {
  const [reorderData, setReorderData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [month, setMonth] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchReorderSheet();
    }
  }, [isOpen]);

  const fetchReorderSheet = async () => {
    setLoading(true);
    try {
      const { data } = await axiosClient.get('/analytics/reorder-sheet');
      if (data.success) {
        setReorderData(data.data);
        setMonth(data.month);
      }
    } catch (error) {
      toast.error('Failed to fetch supplier reorder sheet data');
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (reorderData.length === 0) {
      toast.error('No items to export');
      return;
    }

    const headers = [
      'Product Name',
      'Category',
      'Unit Price (₹)',
      'Current Total Stock',
      'Min Required Threshold',
      'Sold This Month',
      'Current Deficit',
      'Recommended Reorder Qty',
    ];

    const rows = reorderData.map((item) => [
      `"${item.name}"`,
      `"${item.category}"`,
      item.price,
      item.currentStock,
      item.minRequiredStock,
      item.totalSoldThisMonth,
      item.currentDeficit,
      item.recommendedOrder,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Supplier_Reorder_Sheet_${month || 'Report'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Supplier Reorder CSV sheet exported!');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl text-slate-100 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Automated Supplier Reorder Sheet
                <span className="text-xs bg-slate-800 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-mono">
                  {month}
                </span>
              </h2>
              <p className="text-slate-400 text-xs mt-0.5">
                Calculated Reorder Need: (Total Sold This Month + Min Required Stock) - Current Stock
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

        {/* Action Toolbar */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-xs text-slate-400">
            Items Requiring Stock Replenishment:{' '}
            <span className="font-bold text-amber-400">{reorderData.length}</span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={fetchReorderSheet}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>

            <button
              onClick={exportToCSV}
              disabled={reorderData.length === 0}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              1-Click Export CSV
            </button>
          </div>
        </div>

        {/* Content Table */}
        <div className="overflow-y-auto flex-1 border border-slate-800 rounded-xl bg-slate-950/50">
          {loading ? (
            <div className="p-12 text-center text-slate-400 text-sm">
              Calculating reorder quantities...
            </div>
          ) : reorderData.length === 0 ? (
            <div className="p-12 text-center text-slate-400 flex flex-col items-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mb-2 opacity-80" />
              <p className="text-base font-bold text-slate-200">All Stock Levels Healthy!</p>
              <p className="text-xs text-slate-500 mt-1">
                No items are currently below minimum stock threshold or deficit.
              </p>
            </div>
          ) : (
            <table className="w-full text-left text-xs text-slate-300 border-collapse">
              <thead className="bg-slate-900 sticky top-0 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="p-3">Product</th>
                  <th className="p-3">Category</th>
                  <th className="p-3 text-right">Current Stock</th>
                  <th className="p-3 text-right">Min Stock</th>
                  <th className="p-3 text-right">Sold This Month</th>
                  <th className="p-3 text-right">Deficit</th>
                  <th className="p-3 text-right text-amber-400">Rec. Order</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {reorderData.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3 font-semibold text-slate-100 flex items-center gap-2">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-8 h-8 rounded-lg object-cover border border-slate-800"
                      />
                      <span>{item.name}</span>
                    </td>
                    <td className="p-3 text-slate-400">{item.category}</td>
                    <td className="p-3 text-right font-medium">
                      <span className={item.currentStock === 0 ? 'text-rose-400 font-bold' : 'text-amber-400'}>
                        {item.currentStock}
                      </span>
                    </td>
                    <td className="p-3 text-right text-slate-400">{item.minRequiredStock}</td>
                    <td className="p-3 text-right text-indigo-400 font-medium">{item.totalSoldThisMonth}</td>
                    <td className="p-3 text-right text-rose-400 font-bold">
                      {item.currentDeficit > 0 ? `-${item.currentDeficit}` : '0'}
                    </td>
                    <td className="p-3 text-right">
                      <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-lg font-bold">
                        +{item.recommendedOrder} units
                      </span>
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

export default ReorderSheetModal;
