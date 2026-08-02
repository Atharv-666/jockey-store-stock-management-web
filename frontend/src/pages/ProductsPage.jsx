import React, { useState, useEffect } from 'react';
import { useStock } from '../context/StockContext';
import {
  Package,
  Plus,
  Search,
  Layers,
  Shirt,
  ShoppingCart,
  PlusCircle,
  Trash2,
  X,
  ArrowRight,
  RefreshCw,
  Image as ImageIcon,
  AlertTriangle
} from 'lucide-react';
import toast from 'react-hot-toast';

const ProductsPage = () => {
  const {
    products,
    selectedCategory,
    setSelectedCategory,
    addProduct,
    recordSale,
    restockProduct,
    deleteProduct,
    loading,
    formatCurrency,
    theme
  } = useStock();

  const isLight = theme === 'light';
  const categories = ["Men's", "Women's", "Kids", "Accessories"];

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [subCatFilter, setSubCatFilter] = useState('All');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [saleModalProduct, setSaleModalProduct] = useState(null);
  const [restockModalProduct, setRestockModalProduct] = useState(null);
  const [deleteModalProduct, setDeleteModalProduct] = useState(null);

  // Add Product Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState(selectedCategory || "Men's");
  const [subCategory, setSubCategory] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [minRequiredStock, setMinRequiredStock] = useState('10');
  const [isFreeSize, setIsFreeSize] = useState(category === 'Accessories');

  // Variant Rows for Add Product
  const [variantsList, setVariantsList] = useState([
    { color: 'Black', size: 'Free-Size', stockQuantity: 15 },
    { color: 'Brown', size: 'Free-Size', stockQuantity: 10 },
  ]);

  // Mini Form Submission state guards
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sale Mini Form State
  const [saleColor, setSaleColor] = useState('');
  const [saleSize, setSaleSize] = useState('');
  const [saleQty, setSaleQty] = useState(1);

  // Restock Mini Form State
  const [restockColor, setRestockColor] = useState('');
  const [restockSize, setRestockSize] = useState('');
  const [restockQty, setRestockQty] = useState(5);

  // Auto-set free size when Accessories is selected
  useEffect(() => {
    if (category === 'Accessories') {
      setIsFreeSize(true);
      setVariantsList([
        { color: 'Black', size: 'Free-Size', stockQuantity: 15 },
        { color: 'Brown', size: 'Free-Size', stockQuantity: 10 },
      ]);
    }
  }, [category]);

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    setCategory(cat);
    setSubCatFilter('All');
  };

  const handleOpenAddModal = () => {
    const activeCat = selectedCategory || "Men's";
    setCategory(activeCat);
    if (activeCat === 'Accessories') {
      setIsFreeSize(true);
      setSubCategory('Belts');
      setVariantsList([
        { color: 'Black', size: 'Free-Size', stockQuantity: 15 },
        { color: 'Brown', size: 'Free-Size', stockQuantity: 10 },
      ]);
    } else {
      setIsFreeSize(false);
      setSubCategory('');
      setVariantsList([
        { color: 'Navy', size: 'M', stockQuantity: 10 },
        { color: 'Navy', size: 'L', stockQuantity: 5 },
      ]);
    }
    setIsAddModalOpen(true);
  };

  const handleAddVariantRow = () => {
    setVariantsList([
      ...variantsList,
      { color: 'Standard', size: isFreeSize ? 'Free-Size' : 'M', stockQuantity: 10 }
    ]);
  };

  const handleRemoveVariantRow = (index) => {
    setVariantsList(variantsList.filter((_, i) => i !== index));
  };

  const handleVariantChange = (index, field, value) => {
    const updated = [...variantsList];
    updated[index][field] = value;
    setVariantsList(updated);
  };

  // Submit Add Product
  const handleAddProductSubmit = async (e) => {
    e.preventDefault();

    if (!imageUrl || !imageUrl.trim()) {
      toast.error('Product Image URL is compulsory!');
      return;
    }

    if (!name || !subCategory || !price) {
      toast.error('Please fill in all compulsory product details');
      return;
    }

    const formattedVariants = variantsList.map((v) => ({
      color: v.color && v.color.trim() ? v.color.trim() : 'Standard',
      size: isFreeSize ? 'Free-Size' : (v.size || 'M'),
      stockQuantity: Math.max(0, Number(v.stockQuantity) || 0),
    }));

    setIsSubmitting(true);
    const res = await addProduct({
      name,
      category,
      subCategory,
      price: Number(price),
      imageUrl,
      minRequiredStock: Number(minRequiredStock),
      isFreeSize,
      variants: formattedVariants,
    });

    setIsSubmitting(false);
    if (res?.success) {
      setIsAddModalOpen(false);
      setName('');
      setSubCategory('');
      setPrice('');
      setImageUrl('');
    }
  };

  // Open Mini Sale Form
  const openSaleModal = (prod) => {
    setSaleModalProduct(prod);
    const firstVariant = prod.variants && prod.variants.length > 0 ? prod.variants[0] : null;
    setSaleColor(firstVariant ? firstVariant.color : 'Standard');
    setSaleSize(firstVariant ? firstVariant.size : 'Free-Size');
    setSaleQty(1);
  };

  // Submit Mini Sale
  const handleRecordSaleSubmit = async (e) => {
    e.preventDefault();
    if (!saleModalProduct) return;

    setIsSubmitting(true);
    const res = await recordSale({
      productId: saleModalProduct._id,
      color: saleColor,
      size: saleSize,
      quantity: saleQty,
    });
    setIsSubmitting(false);

    if (res?.success) {
      setSaleModalProduct(null);
    }
  };

  // Open Mini Restock Form
  const openRestockModal = (prod) => {
    setRestockModalProduct(prod);
    const firstVariant = prod.variants && prod.variants.length > 0 ? prod.variants[0] : null;
    setRestockColor(firstVariant ? firstVariant.color : 'Standard');
    setRestockSize(firstVariant ? firstVariant.size : 'Free-Size');
    setRestockQty(5);
  };

  // Submit Mini Restock
  const handleRestockSubmit = async (e) => {
    e.preventDefault();
    if (!restockModalProduct) return;

    setIsSubmitting(true);
    const res = await restockProduct({
      productId: restockModalProduct._id,
      color: restockColor,
      size: restockSize,
      quantity: restockQty,
    });
    setIsSubmitting(false);

    if (res?.success) {
      setRestockModalProduct(null);
    }
  };

  // Submit Custom Modal Delete Product
  const handleConfirmDeleteProduct = async () => {
    if (!deleteModalProduct) return;

    setIsSubmitting(true);
    const res = await deleteProduct(deleteModalProduct._id, deleteModalProduct.name);
    setIsSubmitting(false);

    if (res?.success) {
      setDeleteModalProduct(null);
    }
  };

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesCat = !selectedCategory || p.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSub = subCatFilter === 'All' || p.subCategory.toLowerCase() === subCatFilter.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.subCategory.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSub && matchesSearch;
  });

  const subCategories = Array.from(
    new Set(products.filter((p) => p.category === selectedCategory).map((p) => p.subCategory))
  );

  const selectedSaleVariant = saleModalProduct?.variants?.find(
    (v) => v.color === saleColor && v.size === saleSize
  );
  const maxAvailableStock = selectedSaleVariant ? selectedSaleVariant.stockQuantity : 0;

  // Accessory preset sub-categories
  const accessoryPresets = ['Belts', 'Caps', 'Socks', 'Bags', 'Wallets', 'Handkerchiefs'];
  const garmentPresets = ['Shirts', 'Polos', 'T-Shirts', 'Jeans', 'Trackpants', 'Dresses', 'Innerwear'];

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Main Category Hub Cards */}
      <div>
        <p className={`text-xs font-bold uppercase tracking-wider mb-3 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
          Category Hub (Click to Filter)
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            const catCount = products.filter((p) => p.category === cat).length;
            return (
              <div
                key={cat}
                onClick={() => handleCategorySelect(cat)}
                className={`p-5 rounded-2xl cursor-pointer border transition-all duration-200 relative overflow-hidden group ${
                  isSelected
                    ? isLight
                      ? 'bg-indigo-50 border-indigo-400 shadow-md shadow-indigo-100'
                      : 'bg-gradient-to-br from-indigo-900/80 to-slate-900 border-indigo-500 shadow-xl shadow-indigo-500/10'
                    : isLight
                    ? 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                    : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                    <Layers className="w-6 h-6" />
                  </div>
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-500'
                        : isLight
                        ? 'bg-slate-100 text-slate-600 border-slate-200'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {catCount} Items
                  </span>
                </div>
                <h3 className={`text-lg font-bold mt-4 ${isLight ? 'text-slate-900' : 'text-white'}`}>{cat}</h3>
                <p className={`text-xs mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Browse and manage {cat} stock</p>
                <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-indigo-500 group-hover:translate-x-1 transition-transform">
                  <span>Explore Grid</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Control Bar */}
      <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl border ${
        isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
      }`}>
        <div className="flex items-center gap-3 w-full sm:w-auto flex-1">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search garments or sub-categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full border rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-indigo-500 ${
                isLight ? 'bg-slate-100 border-slate-200 text-slate-900 placeholder-slate-400' : 'bg-slate-800/80 border-slate-700/60 text-white placeholder-slate-400'
              }`}
            />
          </div>

          {subCategories.length > 0 && (
            <select
              value={subCatFilter}
              onChange={(e) => setSubCatFilter(e.target.value)}
              className={`border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 ${
                isLight ? 'bg-slate-100 border-slate-200 text-slate-800' : 'bg-slate-800 border-slate-700/60 text-slate-300'
              }`}
            >
              <option value="All">All Sub-Categories</option>
              {subCategories.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          )}
        </div>

        <button
          onClick={handleOpenAddModal}
          className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          + Add New Product ({selectedCategory})
        </button>
      </div>

      {/* 3. Product Cards Grid Display */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-lg font-bold flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
            <Shirt className="w-5 h-5 text-indigo-500" />
            {selectedCategory} Products ({filteredProducts.length})
          </h3>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-400 text-xs">Loading inventory products...</div>
        ) : filteredProducts.length === 0 ? (
          <div className={`border rounded-2xl p-12 text-center text-slate-400 ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-900/60 border-slate-800'
          }`}>
            <Package className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No products found in {selectedCategory}</p>
            <p className="text-xs text-slate-400 mt-1">Click "+ Add New Product" above to populate stock!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => {
              const totalStock = product.variants
                ? product.variants.reduce((acc, v) => acc + (v.stockQuantity || 0), 0)
                : 0;

              const isLowStock = totalStock > 0 && totalStock < product.minRequiredStock;
              const isOutOfStock = totalStock === 0;

              return (
                <div
                  key={product._id}
                  className={`border rounded-2xl overflow-hidden transition-all flex flex-col justify-between group ${
                    isLight ? 'bg-white border-slate-200 hover:border-slate-300 shadow-sm' : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    {/* Image & Status Badge */}
                    <div className="relative h-48 w-full bg-slate-800 overflow-hidden">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src =
                            'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800';
                        }}
                      />
                      <div className="absolute top-3 right-3 flex flex-col gap-1 items-end">
                        {isOutOfStock && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-600 text-white shadow-lg">
                            Sold Out (0 left)
                          </span>
                        )}
                        {isLowStock && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950 shadow-lg">
                            Low Stock ({totalStock} left)
                          </span>
                        )}
                        {!isOutOfStock && !isLowStock && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500 text-slate-950 shadow-lg">
                            In Stock ({totalStock})
                          </span>
                        )}
                      </div>
                      <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700 text-white text-xs font-bold">
                        {formatCurrency(product.price)}
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-4 space-y-3">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">
                            {product.subCategory}
                          </span>
                          
                          {/* Dedicated Custom Delete Modal Trigger */}
                          <button
                            onClick={() => setDeleteModalProduct(product)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-all"
                            title="Delete product from store inventory"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <h4 className={`font-bold text-sm mt-1.5 line-clamp-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>{product.name}</h4>
                      </div>

                      {/* Color / Size Badges */}
                      <div>
                        <p className={`text-[10px] font-semibold mb-1.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                          {product.category === 'Accessories' ? 'Color & Free-Size Live Stock:' : 'Color / Size Live Stock:'}
                        </p>
                        <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto pr-1">
                          {product.variants && product.variants.length > 0 ? (
                            product.variants.map((v, i) => (
                              <div
                                key={i}
                                className={`text-[10px] px-2 py-1 rounded-lg border flex items-center gap-1 ${
                                  v.stockQuantity === 0
                                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-500'
                                    : v.stockQuantity < 5
                                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-600'
                                    : isLight
                                    ? 'bg-slate-100 border-slate-200 text-slate-700'
                                    : 'bg-slate-800 border-slate-700 text-slate-300'
                                }`}
                              >
                                <span className="font-bold">{v.color} ({v.size}):</span>
                                <span>{v.stockQuantity} rem</span>
                                <span className="text-slate-400">|</span>
                                <span className="text-emerald-500 font-semibold">{v.soldQuantity || 0} sold</span>
                              </div>
                            ))
                          ) : (
                            <span className="text-[10px] text-slate-400">No variant breakdown</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="p-4 pt-0 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => openSaleModal(product)}
                      disabled={isOutOfStock}
                      className={`w-full py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                        isOutOfStock
                          ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20'
                      }`}
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      Record Sale
                    </button>

                    <button
                      onClick={() => openRestockModal(product)}
                      className={`w-full py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all ${
                        isLight
                          ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                      }`}
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-indigo-500" />
                      Restock
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ----------------- MODAL 1: ADD PRODUCT FORM ----------------- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className={`border rounded-2xl p-6 w-full max-w-2xl shadow-2xl relative my-8 ${
            isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'
          }`}>
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold mb-1 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-indigo-500" />
              Add New {category === 'Accessories' ? 'Accessory' : 'Garment'} Product (INR ₹)
            </h3>
            <p className={`text-xs mb-6 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Enter {category === 'Accessories' ? 'accessory' : 'garment'} details, compulsory image URL, minimum required store stock, price in ₹, and color/stock variants.
            </p>

            <form onSubmit={handleAddProductSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1">Product / Model Name *</label>
                  <input
                    type="text"
                    required
                    placeholder={category === 'Accessories' ? "e.g. Jockey Leather Executive Belt" : "e.g. Slim Fit Cotton Polo"}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full border rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-indigo-500 ${
                      isLight ? 'bg-slate-100 border-slate-300 text-slate-900' : 'bg-slate-800 border-slate-700 text-white'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => {
                      const newCat = e.target.value;
                      setCategory(newCat);
                      if (newCat === 'Accessories') {
                        setIsFreeSize(true);
                        setSubCategory('Belts');
                      } else {
                        setIsFreeSize(false);
                      }
                    }}
                    className={`w-full border rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-indigo-500 ${
                      isLight ? 'bg-slate-100 border-slate-300 text-slate-900' : 'bg-slate-800 border-slate-700 text-white'
                    }`}
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold">Sub-Category *</label>
                    <span className="text-[10px] text-slate-400">Click preset:</span>
                  </div>
                  <input
                    type="text"
                    required
                    placeholder={category === 'Accessories' ? "e.g. Belts, Socks, Caps, Bags" : "e.g. Shirts, Polos, Jeans"}
                    value={subCategory}
                    onChange={(e) => setSubCategory(e.target.value)}
                    className={`w-full border rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-indigo-500 ${
                      isLight ? 'bg-slate-100 border-slate-300 text-slate-900' : 'bg-slate-800 border-slate-700 text-white'
                    }`}
                  />
                  {/* Quick Preset Sub-Category Pills */}
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {(category === 'Accessories' ? accessoryPresets : garmentPresets).map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setSubCategory(preset)}
                        className={`text-[10px] px-2 py-0.5 rounded-md border font-medium transition-colors ${
                          subCategory === preset
                            ? 'bg-indigo-600 text-white border-indigo-500'
                            : isLight
                            ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                        }`}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Price per item (₹ INR) *</label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    required
                    placeholder="1299"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className={`w-full border rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-indigo-500 ${
                      isLight ? 'bg-slate-100 border-slate-300 text-slate-900' : 'bg-slate-800 border-slate-700 text-white'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 flex items-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5 text-indigo-500" />
                  Product Image URL (COMPULSORY) *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/photo-..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className={`w-full border rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-indigo-500 ${
                    isLight ? 'bg-slate-100 border-slate-300 text-slate-900' : 'bg-slate-800 border-slate-700 text-white'
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1">
                    Minimum Required Quantity in Store *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    placeholder="10"
                    value={minRequiredStock}
                    onChange={(e) => setMinRequiredStock(e.target.value)}
                    className={`w-full border rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-indigo-500 ${
                      isLight ? 'bg-slate-100 border-slate-300 text-slate-900' : 'bg-slate-800 border-slate-700 text-white'
                    }`}
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isFreeSize}
                      onChange={(e) => setIsFreeSize(e.target.checked)}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 bg-slate-800 border-slate-700"
                    />
                    <span className="text-xs font-semibold">
                      Free-Size / Single Size Item {category === 'Accessories' && '(Recommended for Accessories)'}
                    </span>
                  </label>
                </div>
              </div>

              {/* Flexible Stock Entry for Accessories & Garments */}
              <div className={`pt-3 border-t ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold">
                    {category === 'Accessories' || isFreeSize
                      ? 'Color & Free-Size Initial Stock Breakdown'
                      : 'Color & Size Garment Stock Breakdown'}
                  </p>
                  <button
                    type="button"
                    onClick={handleAddVariantRow}
                    className="text-xs text-indigo-500 hover:text-indigo-600 font-semibold flex items-center gap-1"
                  >
                    + Add Color Option
                  </button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {variantsList.map((v, idx) => (
                    <div key={idx} className={`flex items-center gap-2 p-2 rounded-xl border ${
                      isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-800/60 border-slate-700/50'
                    }`}>
                      <input
                        type="text"
                        placeholder="Color (e.g. Black, Brown, Navy)"
                        value={v.color}
                        onChange={(e) => handleVariantChange(idx, 'color', e.target.value)}
                        className={`flex-1 border rounded-lg px-2.5 py-1.5 text-xs ${
                          isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-800 border-slate-700 text-white'
                        }`}
                      />
                      
                      {!isFreeSize && category !== 'Accessories' ? (
                        <select
                          value={v.size}
                          onChange={(e) => handleVariantChange(idx, 'size', e.target.value)}
                          className={`w-24 border rounded-lg px-2 py-1.5 text-xs ${
                            isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-800 border-slate-700 text-white'
                          }`}
                        >
                          <option value="S">S</option>
                          <option value="M">M</option>
                          <option value="L">L</option>
                          <option value="XL">XL</option>
                          <option value="XXL">XXL</option>
                          <option value="Free-Size">Free-Size</option>
                        </select>
                      ) : (
                        <span className="w-24 px-2 py-1.5 text-xs font-bold text-center text-indigo-500 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                          Free-Size
                        </span>
                      )}

                      <input
                        type="number"
                        min="0"
                        placeholder="Stock Qty"
                        value={v.stockQuantity}
                        onChange={(e) => handleVariantChange(idx, 'stockQuantity', e.target.value)}
                        className={`w-24 border rounded-lg px-2.5 py-1.5 text-xs ${
                          isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-800 border-slate-700 text-white'
                        }`}
                      />
                      {variantsList.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveVariantRow(idx)}
                          className="p-1 text-slate-400 hover:text-rose-500"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className={`pt-4 flex justify-end gap-3 border-t ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/20"
                >
                  {isSubmitting ? 'Adding Product...' : 'Add to Inventory'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ----------------- MODAL 2: MINI RECORD SALE FORM ----------------- */}
      {saleModalProduct && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`border rounded-2xl p-6 w-full max-w-md shadow-2xl relative ${
            isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'
          }`}>
            <button
              onClick={() => setSaleModalProduct(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold mb-1 flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-emerald-500" />
              Record Sale - {saleModalProduct.name}
            </h3>
            <p className={`text-xs mb-4 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Select Color, Size, and Quantity to deduct from stock atomically and log to sale history in INR (₹).
            </p>

            <form onSubmit={handleRecordSaleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Select Color</label>
                <select
                  value={saleColor}
                  onChange={(e) => setSaleColor(e.target.value)}
                  className={`w-full border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 ${
                    isLight ? 'bg-slate-100 border-slate-300 text-slate-900' : 'bg-slate-800 border-slate-700 text-white'
                  }`}
                >
                  {Array.from(new Set(saleModalProduct.variants?.map((v) => v.color))).map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Select Size</label>
                <select
                  value={saleSize}
                  onChange={(e) => setSaleSize(e.target.value)}
                  className={`w-full border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 ${
                    isLight ? 'bg-slate-100 border-slate-300 text-slate-900' : 'bg-slate-800 border-slate-700 text-white'
                  }`}
                >
                  {saleModalProduct.variants
                    ?.filter((v) => v.color === saleColor)
                    .map((v) => (
                      <option key={v.size} value={v.size}>
                        {v.size} (Remaining: {v.stockQuantity})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold">Quantity Sold</label>
                  <span className="text-[11px] font-bold text-indigo-500">Available: {maxAvailableStock}</span>
                </div>
                <input
                  type="number"
                  min="1"
                  max={maxAvailableStock}
                  required
                  value={saleQty}
                  onChange={(e) => setSaleQty(Math.min(maxAvailableStock, Math.max(1, Number(e.target.value))))}
                  className={`w-full border rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-indigo-500 ${
                    isLight ? 'bg-slate-100 border-slate-300 text-slate-900' : 'bg-slate-800 border-slate-700 text-white'
                  }`}
                />
              </div>

              <div className={`p-3 rounded-xl border flex justify-between items-center text-xs ${
                isLight ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-800/80 border-slate-700/60'
              }`}>
                <span className={isLight ? 'text-slate-700' : 'text-slate-400'}>Total Transaction Price:</span>
                <span className="text-base font-bold text-emerald-600">
                  {formatCurrency(saleModalProduct.price * saleQty)}
                </span>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSaleModalProduct(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || maxAvailableStock <= 0}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-lg shadow-emerald-600/20"
                >
                  {isSubmitting ? 'Logging Sale...' : 'Confirm & Deduct Stock'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ----------------- MODAL 3: MINI RESTOCK FORM ----------------- */}
      {restockModalProduct && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`border rounded-2xl p-6 w-full max-w-md shadow-2xl relative ${
            isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'
          }`}>
            <button
              onClick={() => setRestockModalProduct(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold mb-1 flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-indigo-500" />
              Restock Item - {restockModalProduct.name}
            </h3>
            <p className={`text-xs mb-4 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Add new stock quantity to clear low stock warnings and replenish store inventory.
            </p>

            <form onSubmit={handleRestockSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Select Color</label>
                <select
                  value={restockColor}
                  onChange={(e) => setRestockColor(e.target.value)}
                  className={`w-full border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 ${
                    isLight ? 'bg-slate-100 border-slate-300 text-slate-900' : 'bg-slate-800 border-slate-700 text-white'
                  }`}
                >
                  {Array.from(new Set(restockModalProduct.variants?.map((v) => v.color))).map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Select Size</label>
                <select
                  value={restockSize}
                  onChange={(e) => setRestockSize(e.target.value)}
                  className={`w-full border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 ${
                    isLight ? 'bg-slate-100 border-slate-300 text-slate-900' : 'bg-slate-800 border-slate-700 text-white'
                  }`}
                >
                  {restockModalProduct.variants
                    ?.filter((v) => v.color === restockColor)
                    .map((v) => (
                      <option key={v.size} value={v.size}>
                        {v.size} (Current Stock: {v.stockQuantity})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Added Quantity</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={restockQty}
                  onChange={(e) => setRestockQty(Math.max(1, Number(e.target.value)))}
                  className={`w-full border rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-indigo-500 ${
                    isLight ? 'bg-slate-100 border-slate-300 text-slate-900' : 'bg-slate-800 border-slate-700 text-white'
                  }`}
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setRestockModalProduct(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/20"
                >
                  {isSubmitting ? 'Updating Stock...' : 'Confirm Restock'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ----------------- MODAL 4: CUSTOM DELETE CONFIRMATION MODAL (NO BROWSER POPUP) ----------------- */}
      {deleteModalProduct && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`border rounded-2xl p-6 w-full max-w-md shadow-2xl relative ${
            isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'
          }`}>
            <button
              onClick={() => setDeleteModalProduct(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-3 text-rose-500">
              <div className="p-3 bg-rose-500/10 rounded-xl border border-rose-500/20">
                <AlertTriangle className="w-6 h-6 text-rose-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Remove Product from Stock?</h3>
                <p className="text-xs text-rose-500 font-semibold">Irreversible Inventory Action</p>
              </div>
            </div>

            {/* Product Preview Card */}
            <div className={`p-3.5 rounded-xl border flex items-center gap-3 mb-4 ${
              isLight ? 'bg-rose-50/60 border-rose-200' : 'bg-slate-800/80 border-slate-700/60'
            }`}>
              <img
                src={deleteModalProduct.imageUrl}
                alt={deleteModalProduct.name}
                className="w-12 h-12 rounded-lg object-cover border border-slate-300 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">
                  {deleteModalProduct.category} • {deleteModalProduct.subCategory}
                </span>
                <p className={`font-bold text-xs mt-1 truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {deleteModalProduct.name}
                </p>
                <p className="text-[11px] font-semibold text-emerald-600 mt-0.5">
                  {formatCurrency(deleteModalProduct.price)}
                </p>
              </div>
            </div>

            <p className={`text-xs leading-relaxed mb-6 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
              Are you sure you want to delete <strong className={isLight ? 'text-slate-900' : 'text-white'}>"{deleteModalProduct.name}"</strong>? This will permanently erase the product and all its color & size variant stock records from your Jockey store inventory.
            </p>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteModalProduct(null)}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleConfirmDeleteProduct}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-lg shadow-rose-600/20 flex items-center gap-1.5 transition-all"
              >
                <Trash2 className="w-4 h-4" />
                {isSubmitting ? 'Deleting...' : 'Yes, Delete Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
