import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import toast from 'react-hot-toast';
import { X, ShoppingCart, Calendar, Shirt, Check } from 'lucide-react';

const AddSaleModal = ({ isOpen, onClose, onSaleAdded }) => {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);

  const now = new Date();
  const defaultMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const [month, setMonth] = useState(defaultMonth);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchProductsList();
    }
  }, [isOpen]);

  const fetchProductsList = async () => {
    try {
      const { data } = await axiosClient.get('/products');
      if (data.success && data.data.length > 0) {
        setProducts(data.data);
        if (!selectedProductId) {
          setSelectedProductId(data.data[0]._id);
        }
      }
    } catch (error) {
      toast.error('Failed to load products list for sales entry');
    }
  };

  const selectedProduct = products.find((p) => p._id === selectedProductId);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProductId || !selectedProduct) {
      toast.error('Please select a product');
      return;
    }

    const availableStock = selectedProduct.sizes ? selectedProduct.sizes[selectedSize] || 0 : 0;
    if (availableStock < quantity) {
      toast.error(`Only ${availableStock} units available in size ${selectedSize}`);
      return;
    }

    setLoading(true);
    try {
      const { data } = await axiosClient.post('/sales', {
        productId: selectedProductId,
        size: selectedSize,
        quantity: Number(quantity),
        month,
      });

      if (data.success) {
        toast.success(`Successfully recorded sale of ${quantity}x ${selectedProduct.name} (${selectedSize})!`);
        if (onSaleAdded) onSaleAdded();
        onClose();
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to log manual sale';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-600/20 text-emerald-400 rounded-2xl border border-emerald-500/30">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-white">Record Manual Sale</h3>
              <p className="text-slate-400 text-xs mt-0.5">Log sales report & deduct stock live</p>
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
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Select Product */}
          <div>
            <label className="block text-slate-400 font-semibold mb-1 uppercase tracking-wider">
              Select Garment / Product *
            </label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-slate-100 text-sm font-semibold focus:outline-none focus:border-indigo-500"
            >
              {products.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name} ({p.category}) — ₹{p.price} (Stock: {p.totalStock})
                </option>
              ))}
            </select>
          </div>

          {/* Month & Size in 2 columns */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-semibold mb-1 uppercase tracking-wider">
                Sales Month *
              </label>
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-slate-100 text-xs font-semibold focus:outline-none focus:border-indigo-500"
              >
                <option value="2026-08">August 2026</option>
                <option value="2026-07">July 2026</option>
                <option value="2026-06">June 2026</option>
                <option value="2026-05">May 2026</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1 uppercase tracking-wider">
                Select Size *
              </label>
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-slate-100 text-xs font-bold focus:outline-none focus:border-indigo-500"
              >
                {['S', 'M', 'L', 'XL', 'XXL'].map((sz) => {
                  const avail = selectedProduct?.sizes ? selectedProduct.sizes[sz] || 0 : 0;
                  return (
                    <option key={sz} value={sz}>
                      Size {sz} ({avail} units left)
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {/* Quantity Sold & Price Calculation */}
          <div className="p-4 bg-slate-950/40 border border-slate-800 rounded-2xl flex items-center justify-between">
            <div>
              <label className="block text-slate-400 font-semibold mb-1 uppercase tracking-wider">
                Quantity Sold *
              </label>
              <input
                type="number"
                min="1"
                max={selectedProduct?.sizes ? selectedProduct.sizes[selectedSize] || 1 : 1}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-24 text-center py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm font-bold text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="text-right">
              <span className="text-[11px] text-slate-400 block font-medium">Calculated Total</span>
              <span className="text-xl font-extrabold text-emerald-400">
                ₹{((selectedProduct?.price || 0) * quantity).toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-slate-950 font-bold rounded-xl text-sm shadow-xl shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 mt-4"
          >
            {loading ? 'Logging Sale Report...' : 'Save & Calculate Sales Report'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddSaleModal;
