import React, { useState } from 'react';
import axiosClient from '../../api/axiosClient';
import toast from 'react-hot-toast';
import { ShoppingCart, Check, Calendar } from 'lucide-react';

const QuickSaleForm = ({ product, onSaleSuccess }) => {
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  // Default to current month "YYYY-MM"
  const now = new Date();
  const defaultMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const [month, setMonth] = useState(defaultMonth);
  const [loading, setLoading] = useState(false);

  const availableSizes = ['S', 'M', 'L', 'XL', 'XXL'];

  const handleQuickDeduct = (amount) => {
    setQuantity((prev) => Math.max(1, prev + amount));
  };

  const handleSaveSale = async (e) => {
    e.preventDefault();
    if (!product._id) return;

    const availableInSize = product.sizes ? product.sizes[selectedSize] || 0 : 0;
    if (availableInSize < quantity) {
      toast.error(`Only ${availableInSize} units available in size ${selectedSize}`);
      return;
    }

    setLoading(true);
    try {
      const { data } = await axiosClient.post('/sales', {
        productId: product._id,
        size: selectedSize,
        quantity: Number(quantity),
        month,
      });

      if (data.success) {
        toast.success(`Logged sale: ${quantity}x (${selectedSize}) ${product.name}`);
        setQuantity(1);
        if (onSaleSuccess) {
          onSaleSuccess(data.data.updatedProduct);
        }
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to record sale';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSaveSale} className="mt-3 pt-3 border-t border-slate-800/80 space-y-2.5">
      <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
        <span>Quick Sales Logger</span>
        <span className="text-indigo-400 flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          Month:
        </span>
      </div>

      {/* Month Dropdown & Size Selector */}
      <div className="grid grid-cols-2 gap-2">
        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="w-full px-2 py-1.5 bg-slate-950/70 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
        >
          <option value="2026-08">August 2026</option>
          <option value="2026-07">July 2026</option>
          <option value="2026-06">June 2026</option>
          <option value="2026-05">May 2026</option>
        </select>

        {/* Size radio selector */}
        <select
          value={selectedSize}
          onChange={(e) => setSelectedSize(e.target.value)}
          className="w-full px-2 py-1.5 bg-slate-950/70 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-bold"
        >
          {availableSizes.map((sz) => (
            <option key={sz} value={sz}>
              Size {sz} ({product.sizes ? product.sizes[sz] || 0 : 0} left)
            </option>
          ))}
        </select>
      </div>

      {/* Quick Action Buttons & Quantity Input */}
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-slate-400 font-medium">Qty:</span>
        <input
          type="number"
          min="1"
          max={product.sizes ? product.sizes[selectedSize] || 1 : 1}
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
          className="w-12 py-1 text-center bg-slate-950/70 border border-slate-800 rounded-lg text-xs font-bold text-white focus:outline-none focus:border-indigo-500"
        />

        <div className="flex gap-1 ml-auto">
          <button
            type="button"
            onClick={() => handleQuickDeduct(1)}
            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md text-[10px] font-bold transition-colors"
          >
            +1
          </button>
          <button
            type="button"
            onClick={() => handleQuickDeduct(5)}
            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md text-[10px] font-bold transition-colors"
          >
            +5
          </button>
          <button
            type="button"
            onClick={() => handleQuickDeduct(10)}
            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md text-[10px] font-bold transition-colors"
          >
            +10
          </button>
        </div>
      </div>

      {/* Save Sales Report Button */}
      <button
        type="submit"
        disabled={loading || (product.sizes && product.sizes[selectedSize] === 0)}
        className="w-full py-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <ShoppingCart className="w-3.5 h-3.5" />
        {loading ? 'Logging Sale...' : 'Save Sales Report'}
      </button>
    </form>
  );
};

export default QuickSaleForm;
