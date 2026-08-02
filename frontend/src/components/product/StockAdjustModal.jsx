import React, { useState } from 'react';
import Modal from '../common/Modal';
import { ArrowUpDown, RefreshCw, MinusCircle, PlusCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const StockAdjustModal = ({ isOpen, onClose, product, onAdjust }) => {
  const [selectedVariantId, setSelectedVariantId] = useState('');
  const [adjustType, setAdjustType] = useState('add'); // 'add' or 'subtract'
  const [quantity, setQuantity] = useState(10);
  const [reason, setReason] = useState('Restock Shipment');

  if (!product) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedVariantId && product.variants?.length > 0) {
      toast.error('Please select a variant size/color to adjust');
      return;
    }

    const change = adjustType === 'add' ? Number(quantity) : -Number(quantity);
    onAdjust(product._id, selectedVariantId || product.variants[0]._id, change, reason);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Adjust Stock: ${product.title}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Select Variant */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Select Size / Color Variant
          </label>
          <select
            value={selectedVariantId}
            onChange={(e) => setSelectedVariantId(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
          >
            <option value="">Select Variant...</option>
            {product.variants?.map((v) => (
              <option key={v._id || v.sku} value={v._id || v.sku}>
                Size: {v.size} | Color: {v.color} | Current Stock: {v.stockQuantity} pcs
              </option>
            ))}
          </select>
        </div>

        {/* Action Toggle */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setAdjustType('add')}
            className={`py-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 border transition-all ${
              adjustType === 'add'
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-lg shadow-emerald-500/10'
                : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Restock (+)</span>
          </button>

          <button
            type="button"
            onClick={() => setAdjustType('subtract')}
            className={`py-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 border transition-all ${
              adjustType === 'subtract'
                ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 shadow-lg shadow-rose-500/10'
                : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
          >
            <MinusCircle className="w-4 h-4" />
            <span>Write-off / Loss (-)</span>
          </button>
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Quantity</label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 font-bold"
          />
        </div>

        {/* Reason */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Reason / Note</label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="Restock Shipment">Restock Shipment</option>
            <option value="Store Inventory Audit">Store Inventory Audit</option>
            <option value="Damaged / Stained Item">Damaged / Stained Item</option>
            <option value="Customer Return">Customer Return</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full mt-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center space-x-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Confirm Stock Adjustment</span>
        </button>
      </form>
    </Modal>
  );
};

export default StockAdjustModal;
