import React, { useState } from 'react';
import Modal from '../common/Modal';
import { ShoppingBag, Plus, Minus, Trash2, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const POSModal = ({ isOpen, onClose, products = [], onCompleteTransaction }) => {
  const [cart, setCart] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedVariantId, setSelectedVariantId] = useState('');

  const selectedProduct = products.find((p) => p._id === selectedProductId);

  const addToCart = () => {
    if (!selectedProduct) {
      toast.error('Select a product first');
      return;
    }
    const variant = selectedProduct.variants?.find((v) => (v._id || v.sku) === selectedVariantId) || selectedProduct.variants[0];
    if (!variant) {
      toast.error('Select size/color variant');
      return;
    }

    const existingIndex = cart.findIndex(
      (item) => item.product === selectedProduct._id && item.variantId === (variant._id || variant.sku)
    );

    if (existingIndex > -1) {
      const updatedCart = [...cart];
      updatedCart[existingIndex].quantity += 1;
      setCart(updatedCart);
    } else {
      setCart([
        ...cart,
        {
          product: selectedProduct._id,
          title: selectedProduct.title,
          variantId: variant._id || variant.sku,
          size: variant.size,
          color: variant.color,
          sku: variant.sku,
          price: variant.price,
          quantity: 1,
        },
      ]);
    }
    toast.success(`Added ${selectedProduct.title} (${variant.size}) to cart`);
  };

  const updateQuantity = (index, delta) => {
    const updated = [...cart];
    const newQty = updated[index].quantity + delta;
    if (newQty <= 0) {
      updated.splice(index, 1);
    } else {
      updated[index].quantity = newQty;
    }
    setCart(updated);
  };

  const totalAmount = cart.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error('Cart is empty');
      return;
    }
    onCompleteTransaction({
      transactionType: 'SALE',
      items: cart,
      notes: 'POS Register Sale',
    });
    setCart([]);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="POS Quick Stock Checkout">
      <div className="space-y-5">
        {/* Item Selector */}
        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
          <label className="block text-xs font-semibold text-indigo-400 uppercase tracking-wider">
            Quick Scan / Select Item
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <select
              value={selectedProductId}
              onChange={(e) => {
                setSelectedProductId(e.target.value);
                setSelectedVariantId('');
              }}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200"
            >
              <option value="">Select Clothing Item...</option>
              {products.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.title} ({p.sku})
                </option>
              ))}
            </select>

            <select
              value={selectedVariantId}
              onChange={(e) => setSelectedVariantId(e.target.value)}
              disabled={!selectedProduct}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 disabled:opacity-40"
            >
              <option value="">Select Size / Color Variant...</option>
              {selectedProduct?.variants?.map((v) => (
                <option key={v._id || v.sku} value={v._id || v.sku}>
                  Size {v.size} ({v.color}) - ${v.price} [{v.stockQuantity} in stock]
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={addToCart}
            disabled={!selectedProduct}
            className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 disabled:opacity-40 transition-all flex items-center justify-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add to Register Cart</span>
          </button>
        </div>

        {/* Cart items */}
        <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Checkout Cart</h4>
          {cart.length === 0 ? (
            <p className="text-xs text-slate-500 py-4 text-center">No items added to checkout cart yet</p>
          ) : (
            cart.map((item, idx) => (
              <div key={idx} className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-slate-200">{item.title}</h5>
                  <p className="text-[11px] text-slate-400">
                    Size: <span className="font-semibold text-indigo-400">{item.size}</span> | Color: {item.color} | ${item.price}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1 bg-slate-950 px-2 py-0.5 rounded-lg border border-slate-800">
                    <button onClick={() => updateQuantity(idx, -1)} className="text-slate-400 hover:text-white">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-bold text-white w-5 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(idx, 1)} className="text-slate-400 hover:text-white">
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <span className="text-xs font-extrabold text-emerald-400 w-14 text-right">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Total & Checkout */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400">Total Payable</p>
            <p className="text-xl font-extrabold text-white">${totalAmount.toFixed(2)}</p>
          </div>

          <button
            type="button"
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 disabled:opacity-40 transition-all flex items-center space-x-2"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Complete Sale</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default POSModal;
