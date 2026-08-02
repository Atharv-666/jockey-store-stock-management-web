import React, { useState } from 'react';
import QuickSaleForm from './QuickSaleForm';
import ProductDetailModal from './ProductDetailModal';
import { Shirt, Info, AlertTriangle, ShieldCheck } from 'lucide-react';

const ProductCard = ({ product: initialProduct, onProductChange }) => {
  const [product, setProduct] = useState(initialProduct);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Sync state if initialProduct prop updates
  React.useEffect(() => {
    setProduct(initialProduct);
  }, [initialProduct]);

  const handleProductUpdated = (updated) => {
    setProduct(updated);
    if (onProductChange) {
      onProductChange(updated);
    }
  };

  const getStatusBadge = () => {
    const total = product.totalStock || 0;
    const minNeeded = product.minRequiredStock || 0;

    if (total === 0) {
      return { label: 'Out of Stock', bg: 'bg-rose-500/20 text-rose-300 border-rose-500/40' };
    }
    if (total < minNeeded) {
      return { label: 'Low Stock', bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
    }
    return { label: 'Healthy Stock', bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' };
  };

  const badge = getStatusBadge();

  return (
    <>
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 hover:border-slate-700 transition-all duration-200 flex flex-col justify-between shadow-xl group">
        {/* Top Header & Image Preview */}
        <div>
          <div
            onClick={() => setIsDetailOpen(true)}
            className="relative h-44 w-full rounded-xl overflow-hidden cursor-pointer mb-3 border border-slate-800 group-hover:scale-[1.01] transition-transform"
          >
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <span
              className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full border backdrop-blur-md ${badge.bg}`}
            >
              {badge.label}
            </span>
            <div className="absolute top-2 right-2 p-1.5 bg-slate-950/60 backdrop-blur-md rounded-full text-slate-300 hover:text-white hover:bg-indigo-600 transition-colors">
              <Info className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Product Meta */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">
                {product.category}
              </span>
              <h3
                onClick={() => setIsDetailOpen(true)}
                className="text-sm font-bold text-white hover:text-indigo-300 cursor-pointer line-clamp-1 transition-colors"
              >
                {product.name}
              </h3>
            </div>
            <span className="text-sm font-extrabold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-lg whitespace-nowrap">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
          </div>

          {/* Total Stock vs Min Threshold Summary */}
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400 bg-slate-950/50 p-2 rounded-xl border border-slate-800/60">
            <span>Total Stock: <strong className="text-white">{product.totalStock}</strong></span>
            <span>Min Threshold: <strong className="text-slate-300">{product.minRequiredStock}</strong></span>
          </div>

          {/* Size-wise stock breakdown pills */}
          <div className="mt-2.5">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Available Stock per Size:
            </span>
            <div className="grid grid-cols-5 gap-1 text-center">
              {['S', 'M', 'L', 'XL', 'XXL'].map((sz) => {
                const count = product.sizes ? product.sizes[sz] || 0 : 0;
                return (
                  <div
                    key={sz}
                    className={`py-1 rounded-md border text-[10px] font-bold ${
                      count === 0
                        ? 'bg-rose-950/30 border-rose-800/40 text-rose-400'
                        : count < 3
                        ? 'bg-amber-950/30 border-amber-800/40 text-amber-300'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div>{sz}</div>
                    <div className="text-[9px] text-slate-400 font-normal">{count}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Embedded Quick Sales Logger Form */}
        <QuickSaleForm product={product} onSaleSuccess={handleProductUpdated} />
      </div>

      {/* Modal Detail view */}
      <ProductDetailModal
        product={product}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onProductUpdated={handleProductUpdated}
      />
    </>
  );
};

export default ProductCard;
