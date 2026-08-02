import React, { useState } from 'react';
import axiosClient from '../../api/axiosClient';
import toast from 'react-hot-toast';
import { X, RefreshCw, PlusCircle } from 'lucide-react';

const RestockModal = ({ product, isOpen, onClose, onRestockSuccess }) => {
  const [sizesToAdd, setSizesToAdd] = useState({ S: 0, M: 0, L: 0, XL: 0, XXL: 0 });
  const [notes, setNotes] = useState('Supplier shipment restock');
  const [loading, setLoading] = useState(false);

  if (!isOpen || !product) return null;

  const handleSizeChange = (size, value) => {
    const val = Math.max(0, parseInt(value) || 0);
    setSizesToAdd((prev) => ({ ...prev, [size]: val }));
  };

  const handleRestockSubmit = async (e) => {
    e.preventDefault();

    const totalAdded =
      (sizesToAdd.S || 0) +
      (sizesToAdd.M || 0) +
      (sizesToAdd.L || 0) +
      (sizesToAdd.XL || 0) +
      (sizesToAdd.XXL || 0);

    if (totalAdded <= 0) {
      toast.error('Please enter at least 1 unit to restock');
      return;
    }

    setLoading(true);
    try {
      const { data } = await axiosClient.post(`/products/${product._id}/restock`, {
        sizesToAdd,
        notes,
      });

      if (data.success) {
        toast.success(`Successfully added ${totalAdded} units to ${product.name}!`);
        if (onRestockSuccess) {
          onRestockSuccess(data.data);
        }
        onClose();
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to restock product';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Add Stock / Restock</h3>
              <p className="text-slate-400 text-xs truncate max-w-[220px]">{product.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white bg-slate-800/50 p-2 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleRestockSubmit} className="space-y-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Enter Units to Add Per Size:
          </p>

          <div className="grid grid-cols-5 gap-2">
            {['S', 'M', 'L', 'XL', 'XXL'].map((sz) => (
              <div key={sz} className="text-center">
                <label className="block text-xs font-bold text-indigo-400 mb-1">{sz}</label>
                <input
                  type="number"
                  min="0"
                  value={sizesToAdd[sz]}
                  onChange={(e) => handleSizeChange(sz, e.target.value)}
                  className="w-full text-center py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-sm font-bold text-white focus:outline-none focus:border-indigo-500"
                />
                <span className="text-[10px] text-slate-500 block mt-1">
                  (Curr: {product.sizes ? product.sizes[sz] || 0 : 0})
                </span>
              </div>
            ))}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 mt-4">
              Restock Notes / Supplier Reference
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Shipment Batch #9402"
              className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 mt-6"
          >
            {loading ? 'Updating Inventory...' : 'Confirm Restock'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RestockModal;
