import React, { useState } from 'react';
import RestockModal from './RestockModal';
import { X, AlertTriangle, ShieldCheck, History, PlusCircle, Calendar } from 'lucide-react';

const ProductDetailModal = ({ product, isOpen, onClose, onProductUpdated }) => {
  const [isRestockOpen, setIsRestockOpen] = useState(false);

  if (!isOpen || !product) return null;

  const getStatusBadge = () => {
    const total = product.totalStock || 0;
    const minNeeded = product.minRequiredStock || 0;

    if (total === 0) {
      return { label: 'Critical / Out of Stock', bg: 'bg-rose-500/20 text-rose-300 border-rose-500/40' };
    }
    if (total < minNeeded) {
      return { label: 'Low Stock Warning', bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
    }
    return { label: 'Healthy Stock', bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' };
  };

  const badge = getStatusBadge();

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fadeIn">
        <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800/50 p-2 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="relative h-48 rounded-xl overflow-hidden border border-slate-800">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <span className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.bg}`}>
                {badge.label}
              </span>
            </div>

            <div className="md:col-span-2 flex flex-col justify-between">
              <div>
                <span className="text-xs uppercase font-bold text-indigo-400 tracking-wider">
                  {product.category}
                </span>
                <h2 className="text-2xl font-extrabold text-white mt-1">{product.name}</h2>
                <p className="text-slate-400 text-xs mt-2 line-clamp-2">
                  {product.description || 'No additional description provided.'}
                </p>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-800">
                <div>
                  <span className="text-xs text-slate-500 block">Unit Price</span>
                  <span className="text-xl font-bold text-emerald-400">₹{product.price.toLocaleString('en-IN')}</span>
                </div>

                <div>
                  <span className="text-xs text-slate-500 block">Min Threshold</span>
                  <span className="text-sm font-bold text-slate-300">{product.minRequiredStock} units</span>
                </div>

                <div>
                  <span className="text-xs text-slate-500 block">Total Stock</span>
                  <span className="text-xl font-bold text-indigo-400">{product.totalStock} units</span>
                </div>
              </div>
            </div>
          </div>

          {/* Size-wise stock breakdown */}
          <div className="mb-6">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Size-Wise Stock Inventory
            </h4>
            <div className="grid grid-cols-5 gap-2">
              {['S', 'M', 'L', 'XL', 'XXL'].map((sz) => {
                const count = product.sizes ? product.sizes[sz] || 0 : 0;
                return (
                  <div
                    key={sz}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      count === 0
                        ? 'bg-rose-950/20 border-rose-800/40 text-rose-400'
                        : count < 5
                        ? 'bg-amber-950/20 border-amber-800/40 text-amber-300'
                        : 'bg-slate-950/50 border-slate-800 text-slate-200'
                    }`}
                  >
                    <span className="text-xs font-bold block">{sz}</span>
                    <span className="text-lg font-extrabold block mt-0.5">{count}</span>
                    <span className="text-[9px] uppercase font-semibold text-slate-500 block mt-1">
                      {count === 0 ? 'Out' : `${count} left`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Restock action bar */}
          <div className="flex items-center justify-between p-4 bg-indigo-950/30 border border-indigo-500/20 rounded-xl mb-6">
            <div>
              <h5 className="text-sm font-bold text-indigo-200">Stock Replenishment</h5>
              <p className="text-xs text-indigo-300/70">Add new inventory batch to size levels</p>
            </div>
            <button
              onClick={() => setIsRestockOpen(true)}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-md"
            >
              <PlusCircle className="w-4 h-4" />
              Restock Item
            </button>
          </div>

          {/* Restock History Timeline */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <History className="w-4 h-4 text-indigo-400" />
              Restock Audit Log
            </h4>

            {product.restockHistory && product.restockHistory.length > 0 ? (
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {product.restockHistory.slice().reverse().map((log, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-950/50 border border-slate-800/80 rounded-xl flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-emerald-400">+{log.totalAdded} units</span>
                      <span className="text-slate-400 ml-2 text-[11px]">{log.notes || 'Restock'}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(log.date).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">No restock logs recorded yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Embedded Restock Modal */}
      <RestockModal
        product={product}
        isOpen={isRestockOpen}
        onClose={() => setIsRestockOpen(false)}
        onRestockSuccess={(updated) => {
          if (onProductUpdated) onProductUpdated(updated);
        }}
      />
    </>
  );
};

export default ProductDetailModal;
