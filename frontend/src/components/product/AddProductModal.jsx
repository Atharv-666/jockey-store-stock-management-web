import React, { useState } from 'react';
import axiosClient from '../../api/axiosClient';
import toast from 'react-hot-toast';
import {
  X,
  Upload,
  Plus,
  Image as ImageIcon,
  Sparkles,
  Zap,
  CheckCircle2,
} from 'lucide-react';

const PRESET_IMAGES = [
  { name: 'Oxford Shirt', url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=800' },
  { name: 'Denim Jeans', url: 'https://images.unsplash.com/photo-1542272604-780c36856842?auto=format&fit=crop&q=80&w=800' },
  { name: 'Summer Dress', url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=80&w=800' },
  { name: 'Leather Watch', url: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&q=80&w=800' },
];

const AddProductModal = ({ isOpen, onClose, onProductCreated }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState("Men's Wear");
  const [price, setPrice] = useState('');
  const [minRequiredStock, setMinRequiredStock] = useState('15');
  const [description, setDescription] = useState('');
  const [sizes, setSizes] = useState({ S: 10, M: 15, L: 10, XL: 5, XXL: 2 });

  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(PRESET_IMAGES[0].url);
  const [imagePreview, setImagePreview] = useState(PRESET_IMAGES[0].url);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSelectPresetImage = (url) => {
    setImageFile(null);
    setImageUrl(url);
    setImagePreview(url);
  };

  const handleSizeChange = (sz, val) => {
    const qty = Math.max(0, parseInt(val) || 0);
    setSizes((prev) => ({ ...prev, [sz]: qty }));
  };

  // Quick Preset Stock Fillers
  const applyStockPreset = (type) => {
    if (type === 'zero') setSizes({ S: 0, M: 0, L: 0, XL: 0, XXL: 0 });
    if (type === 'balanced') setSizes({ S: 10, M: 15, L: 12, XL: 8, XXL: 5 });
    if (type === 'high') setSizes({ S: 25, M: 30, L: 25, XL: 15, XXL: 10 });
  };

  // Quick Fill Demo Product Data
  const fillDemoProduct = () => {
    setName('Premium Linen Summer Shirt');
    setCategory("Men's Wear");
    setPrice('1899');
    setMinRequiredStock('20');
    setDescription('Lightweight 100% linen shirt designed for ultimate tropical comfort.');
    setSizes({ S: 12, M: 20, L: 15, XL: 8, XXL: 4 });
    setImageUrl(PRESET_IMAGES[0].url);
    setImagePreview(PRESET_IMAGES[0].url);
  };

  const totalInitialStock =
    (sizes.S || 0) + (sizes.M || 0) + (sizes.L || 0) + (sizes.XL || 0) + (sizes.XXL || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !price) {
      toast.error('Please enter product name and price');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('category', category);
      formData.append('price', price);
      formData.append('minRequiredStock', minRequiredStock);
      formData.append('description', description);
      formData.append('sizes', JSON.stringify(sizes));

      if (imageFile) {
        formData.append('image', imageFile);
      } else if (imageUrl) {
        formData.append('imageUrl', imageUrl);
      }

      const { data } = await axiosClient.post('/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (data.success) {
        toast.success(`Added ${name} to store catalog!`);
        if (onProductCreated) onProductCreated(data.data);
        onClose();
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create product';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fadeIn">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl text-slate-100 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600/20 text-indigo-400 rounded-2xl border border-indigo-500/30">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-white">Add New Garment</h3>
              <p className="text-slate-400 text-xs mt-0.5">Fast & easy stock creation form</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fillDemoProduct}
              className="px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <Zap className="w-3.5 h-3.5 text-indigo-400" />
              1-Click Demo
            </button>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white bg-slate-800/50 p-2 rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Easy Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Product Name */}
          <div>
            <label className="block text-slate-400 font-semibold mb-1 uppercase tracking-wider">
              Product Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Slim-Fit Cotton Chinos"
              className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-slate-100 text-sm font-medium focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Category & Price in 2 Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 font-semibold mb-1 uppercase tracking-wider">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-slate-100 text-sm font-semibold focus:outline-none focus:border-indigo-500"
              >
                <option value="Men's Wear">Men's Wear</option>
                <option value="Women's Wear">Women's Wear</option>
                <option value="Accessories">Accessories</option>
                <option value="Kid's Wear">Kid's Wear</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1 uppercase tracking-wider">
                Price (₹ INR) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-indigo-400 font-bold text-sm">₹</span>
                <input
                  type="number"
                  step="1"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="1499"
                  className="w-full pl-8 pr-4 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-slate-100 text-sm font-bold focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Size-Wise Stock Input with Quick Presets */}
          <div className="bg-slate-950/40 p-4 border border-slate-800 rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <label className="text-slate-300 font-bold uppercase tracking-wider text-xs">
                Size Stock Breakdown:
              </label>
              <span className="text-indigo-400 font-bold bg-indigo-500/10 px-2 py-0.5 rounded-lg text-[11px]">
                Total: {totalInitialStock} units
              </span>
            </div>

            {/* Quick Stock Preset Buttons */}
            <div className="flex gap-2 mb-3">
              <button
                type="button"
                onClick={() => applyStockPreset('balanced')}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[10px] font-semibold transition-colors"
              >
                Standard (10-15/sz)
              </button>
              <button
                type="button"
                onClick={() => applyStockPreset('high')}
                className="px-2.5 py-1 bg-indigo-950/60 hover:bg-indigo-900/60 text-indigo-300 border border-indigo-800/50 rounded-lg text-[10px] font-semibold transition-colors"
              >
                High Demand (25-30/sz)
              </button>
              <button
                type="button"
                onClick={() => applyStockPreset('zero')}
                className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-500 rounded-lg text-[10px] font-semibold transition-colors"
              >
                Reset Zero
              </button>
            </div>

            {/* Size Inputs Grid */}
            <div className="grid grid-cols-5 gap-2 text-center">
              {['S', 'M', 'L', 'XL', 'XXL'].map((sz) => (
                <div key={sz}>
                  <span className="block font-bold text-indigo-400 mb-1 text-xs">{sz}</span>
                  <input
                    type="number"
                    min="0"
                    value={sizes[sz]}
                    onChange={(e) => handleSizeChange(sz, e.target.value)}
                    className="w-full text-center py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm font-bold text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Minimum Stock Threshold */}
          <div>
            <label className="block text-slate-400 font-semibold mb-1 uppercase tracking-wider">
              Minimum Required Stock Threshold *
            </label>
            <input
              type="number"
              min="1"
              required
              value={minRequiredStock}
              onChange={(e) => setMinRequiredStock(e.target.value)}
              placeholder="15"
              className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-slate-100 text-sm font-medium focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Product Photo Selector: 1-Click Thumbnails or Upload */}
          <div>
            <label className="block text-slate-400 font-semibold mb-1.5 uppercase tracking-wider">
              Select Product Image:
            </label>

            {/* Image Presets Grid */}
            <div className="grid grid-cols-4 gap-2 mb-3">
              {PRESET_IMAGES.map((img) => (
                <div
                  key={img.name}
                  onClick={() => handleSelectPresetImage(img.url)}
                  className={`relative h-16 rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                    imagePreview === img.url
                      ? 'border-indigo-500 shadow-md shadow-indigo-500/30 scale-105'
                      : 'border-slate-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                  <span className="absolute bottom-0 inset-x-0 bg-slate-950/80 text-[9px] text-center text-slate-200 py-0.5 truncate">
                    {img.name}
                  </span>
                </div>
              ))}
            </div>

            {/* Custom Upload or Custom URL */}
            <div className="flex items-center gap-3">
              <label className="flex-1 cursor-pointer flex items-center justify-center gap-2 p-2.5 bg-slate-950/60 border border-dashed border-slate-800 hover:border-indigo-500 rounded-xl text-slate-400 hover:text-indigo-300 transition-all text-xs font-semibold">
                <Upload className="w-4 h-4" />
                <span>Upload Custom Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="hidden"
                />
              </label>

              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-10 h-10 rounded-xl object-cover border border-indigo-500"
                />
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold rounded-xl text-sm shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 mt-4"
          >
            {loading ? 'Creating Product...' : 'Save Product to Inventory'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;
