import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import toast from 'react-hot-toast';
import {
  Package,
  ShoppingCart,
  AlertTriangle,
  Plus,
  Search,
  RefreshCw,
  FileSpreadsheet,
  Trash2,
  Edit,
  PlusCircle,
  MinusCircle,
  Download,
  Calendar,
  LogOut,
  Layers,
} from 'lucide-react';

const SimpleStockManager = () => {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [reorderSheet, setReorderSheet] = useState([]);
  const [loading, setLoading] = useState(true);

  // Active View Tab: 'stock' | 'sales' | 'reorder'
  const [activeTab, setActiveTab] = useState('stock');

  // Search & Filters
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Add Product Form State
  const [newProductName, setNewProductName] = useState('');
  const [newCategory, setNewCategory] = useState("Men's Wear");
  const [newPrice, setNewPrice] = useState('');
  const [newMinStock, setNewMinStock] = useState('15');
  const [newSizes, setNewSizes] = useState({ S: 10, M: 15, L: 10, XL: 5, XXL: 2 });
  const [newImageUrl, setNewImageUrl] = useState('https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=800');

  // Record Sale Form State
  const [saleProductId, setSaleProductId] = useState('');
  const [saleSize, setSaleSize] = useState('M');
  const [saleQty, setSaleQty] = useState(1);
  const now = new Date();
  const defaultMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const [saleMonth, setSaleMonth] = useState(defaultMonth);

  // Restock Form State
  const [restockSizes, setRestockSizes] = useState({ S: 0, M: 0, L: 0, XL: 0, XXL: 0 });

  useEffect(() => {
    fetchAllData();
  }, [categoryFilter]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      // Products
      let prodUrl = '/products';
      if (categoryFilter !== 'All') prodUrl += `?category=${encodeURIComponent(categoryFilter)}`;
      const { data: pRes } = await axiosClient.get(prodUrl);
      if (pRes.success) setProducts(pRes.data);

      // Sales
      const { data: sRes } = await axiosClient.get(`/sales?month=${saleMonth}`);
      if (sRes.success) setSales(sRes.data);

      // Reorder Sheet
      const { data: rRes } = await axiosClient.get('/analytics/reorder-sheet');
      if (rRes.success) setReorderSheet(rRes.data);
    } catch (error) {
      toast.error('Failed to load stock data');
    } finally {
      setLoading(false);
    }
  };

  // Quick Stock Adjustment (+1 / -1 for size)
  const handleQuickStockAdjust = async (product, size, delta) => {
    const currentSizeQty = product.sizes ? product.sizes[size] || 0 : 0;
    const newQty = Math.max(0, currentSizeQty + delta);

    const updatedSizes = { ...product.sizes, [size]: newQty };

    try {
      const { data } = await axiosClient.put(`/products/${product._id}`, {
        sizes: updatedSizes,
      });

      if (data.success) {
        toast.success(`Updated ${product.name} (${size}) stock to ${newQty}`);
        setProducts((prev) =>
          prev.map((p) => (p._id === product._id ? data.data : p))
        );
      }
    } catch (error) {
      toast.error('Failed to adjust stock');
    }
  };

  // Quick Delete Product
  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}" from stock?`)) return;

    try {
      const { data } = await axiosClient.delete(`/products/${id}`);
      if (data.success) {
        toast.success(`Deleted ${name}`);
        setProducts((prev) => prev.filter((p) => p._id !== id));
      }
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  // Add Product Submit
  const handleAddProductSubmit = async (e) => {
    e.preventDefault();
    if (!newProductName || !newPrice) {
      toast.error('Please enter product name and price');
      return;
    }

    try {
      const { data } = await axiosClient.post('/products', {
        name: newProductName,
        category: newCategory,
        price: Number(newPrice),
        minRequiredStock: Number(newMinStock),
        sizes: newSizes,
        imageUrl: newImageUrl,
      });

      if (data.success) {
        toast.success(`Added ${newProductName} to stock!`);
        setIsAddModalOpen(false);
        setNewProductName('');
        setNewPrice('');
        fetchAllData();
      }
    } catch (error) {
      toast.error('Failed to add product');
    }
  };

  // Record Sale Submit
  const handleRecordSaleSubmit = async (e) => {
    e.preventDefault();
    if (!saleProductId) return;

    const prod = products.find((p) => p._id === saleProductId);
    const avail = prod?.sizes ? prod.sizes[saleSize] || 0 : 0;
    if (avail < saleQty) {
      toast.error(`Only ${avail} units left in size ${saleSize}`);
      return;
    }

    try {
      const { data } = await axiosClient.post('/sales', {
        productId: saleProductId,
        size: saleSize,
        quantity: Number(saleQty),
        month: saleMonth,
      });

      if (data.success) {
        toast.success(`Logged sale: ${saleQty}x (${saleSize}) ${prod.name}`);
        setIsSaleModalOpen(false);
        fetchAllData();
      }
    } catch (error) {
      toast.error('Failed to record sale');
    }
  };

  // Restock Submit
  const handleRestockSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProduct) return;

    const totalAdded =
      (restockSizes.S || 0) +
      (restockSizes.M || 0) +
      (restockSizes.L || 0) +
      (restockSizes.XL || 0) +
      (restockSizes.XXL || 0);

    if (totalAdded <= 0) {
      toast.error('Enter at least 1 unit to add');
      return;
    }

    try {
      const { data } = await axiosClient.post(`/products/${selectedProduct._id}/restock`, {
        sizesToAdd: restockSizes,
        notes: 'Manual restock entry',
      });

      if (data.success) {
        toast.success(`Added ${totalAdded} units to ${selectedProduct.name}`);
        setIsRestockModalOpen(false);
        fetchAllData();
      }
    } catch (error) {
      toast.error('Failed to restock');
    }
  };

  // Export CSV
  const exportReorderCSV = () => {
    if (reorderSheet.length === 0) return toast.error('No low stock items');
    const headers = ['Product', 'Category', 'Price (INR)', 'Current Stock', 'Min Stock', 'Deficit', 'Reorder Qty'];
    const rows = reorderSheet.map((i) => [
      `"${i.name}"`, `"${i.category}"`, i.price, i.currentStock, i.minRequiredStock, i.currentDeficit, i.recommendedOrder
    ]);
    const csv = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csv);
    link.download = `Reorder_List_${saleMonth}.csv`;
    link.click();
  };

  // Filtered Products
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  // Global Metrics
  const totalItems = products.length;
  const totalStockCount = products.reduce((acc, p) => acc + (p.totalStock || 0), 0);
  const lowStockCount = products.filter((p) => (p.totalStock || 0) < (p.minRequiredStock || 0)).length;
  const monthlyRevenue = sales.reduce((acc, s) => acc + (s.totalAmount || 0), 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans selection:bg-indigo-500">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Minimalist Top Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <Package className="w-5 h-5 text-indigo-400" />
              Clothing Stock Manager
            </h1>
            <p className="text-slate-400 text-xs mt-0.5">Simple & fast inventory management</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSelectedProduct(products[0]);
                setSaleProductId(products[0]?._id || '');
                setIsSaleModalOpen(true);
              }}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all"
            >
              <ShoppingCart className="w-4 h-4" />
              Record Sale
            </button>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/20"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </button>
          </div>
        </div>

        {/* 4 Simple Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
            <span className="text-slate-400 font-medium block">Total Products</span>
            <span className="text-xl font-extrabold text-white mt-1 block">{totalItems}</span>
          </div>
          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
            <span className="text-slate-400 font-medium block">Total Available Stock</span>
            <span className="text-xl font-extrabold text-indigo-400 mt-1 block">{totalStockCount} units</span>
          </div>
          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
            <span className="text-slate-400 font-medium block">Low Stock Alerts</span>
            <span className="text-xl font-extrabold text-amber-400 mt-1 block">{lowStockCount} items</span>
          </div>
          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
            <span className="text-slate-400 font-medium block">Monthly Revenue</span>
            <span className="text-xl font-extrabold text-emerald-400 mt-1 block">₹{monthlyRevenue.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 gap-6 text-sm font-bold">
          <button
            onClick={() => setActiveTab('stock')}
            className={`pb-3 transition-colors ${
              activeTab === 'stock'
                ? 'text-indigo-400 border-b-2 border-indigo-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            📦 Stock Inventory ({filteredProducts.length})
          </button>
          <button
            onClick={() => setActiveTab('sales')}
            className={`pb-3 transition-colors ${
              activeTab === 'sales'
                ? 'text-indigo-400 border-b-2 border-indigo-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            💰 Sales Log ({sales.length})
          </button>
          <button
            onClick={() => setActiveTab('reorder')}
            className={`pb-3 transition-colors ${
              activeTab === 'reorder'
                ? 'text-amber-400 border-b-2 border-amber-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ⚠️ Low Stock & Reorder List ({reorderSheet.length})
          </button>
        </div>

        {/* TAB 1: STOCK INVENTORY */}
        {activeTab === 'stock' && (
          <div className="space-y-4">
            {/* Search & Category Filter */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search product..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex gap-2">
                {["All", "Men's Wear", "Women's Wear", "Accessories", "Kid's Wear"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      categoryFilter === cat
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Simple Clean Table */}
            <div className="border border-slate-800 rounded-xl bg-slate-900/60 overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="p-3">Product</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Size Breakdown (S, M, L, XL, XXL)</th>
                    <th className="p-3 text-center">Total Stock</th>
                    <th className="p-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredProducts.map((p) => {
                    const isLow = (p.totalStock || 0) < (p.minRequiredStock || 0);
                    return (
                      <tr key={p._id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-3 font-bold text-white flex items-center gap-2">
                          <img src={p.imageUrl} alt="" className="w-8 h-8 rounded-lg object-cover" />
                          <span>{p.name}</span>
                        </td>
                        <td className="p-3 text-slate-400">{p.category}</td>
                        <td className="p-3 font-bold text-emerald-400">₹{p.price}</td>
                        <td className="p-3">
                          <div className="flex gap-1.5">
                            {['S', 'M', 'L', 'XL', 'XXL'].map((sz) => {
                              const qty = p.sizes ? p.sizes[sz] || 0 : 0;
                              return (
                                <div
                                  key={sz}
                                  className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-md border border-slate-800"
                                >
                                  <span className="font-bold text-indigo-400 text-[10px]">{sz}:</span>
                                  <span className="font-bold text-white text-[11px]">{qty}</span>
                                  <button
                                    onClick={() => handleQuickStockAdjust(p, sz, 1)}
                                    className="text-emerald-400 hover:text-emerald-300 font-bold ml-1"
                                    title="Add 1"
                                  >
                                    +
                                  </button>
                                  <button
                                    onClick={() => handleQuickStockAdjust(p, sz, -1)}
                                    className="text-rose-400 hover:text-rose-300 font-bold"
                                    title="Deduct 1"
                                  >
                                    -
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        </td>
                        <td className="p-3 text-center">
                          <span
                            className={`px-2.5 py-1 rounded-full font-bold text-[11px] ${
                              isLow ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            }`}
                          >
                            {p.totalStock} units
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => {
                                setSelectedProduct(p);
                                setRestockSizes({ S: 0, M: 0, L: 0, XL: 0, XXL: 0 });
                                setIsRestockModalOpen(true);
                              }}
                              className="px-2 py-1 bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white rounded-lg font-semibold text-[11px] transition-colors"
                            >
                              Restock
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p._id, p.name)}
                              className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: SALES LOG */}
        {activeTab === 'sales' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-xs">
              <span className="text-slate-400 font-semibold">
                Total Month Sales Revenue: <strong className="text-emerald-400 font-bold text-sm">₹{monthlyRevenue.toLocaleString('en-IN')}</strong>
              </span>
              <button
                onClick={() => {
                  setSelectedProduct(products[0]);
                  setSaleProductId(products[0]?._id || '');
                  setIsSaleModalOpen(true);
                }}
                className="px-3 py-1.5 bg-emerald-600 text-slate-950 font-bold rounded-lg"
              >
                + Record Manual Sale
              </button>
            </div>

            <div className="border border-slate-800 rounded-xl bg-slate-900/60 overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-semibold uppercase">
                  <tr>
                    <th className="p-3">Date</th>
                    <th className="p-3">Product Name</th>
                    <th className="p-3">Category</th>
                    <th className="p-3 text-center">Size</th>
                    <th className="p-3 text-right">Quantity</th>
                    <th className="p-3 text-right">Unit Price</th>
                    <th className="p-3 text-right text-emerald-400">Total Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {sales.map((s) => (
                    <tr key={s._id} className="hover:bg-slate-800/40">
                      <td className="p-3 text-slate-400">{new Date(s.date || s.createdAt).toLocaleDateString()}</td>
                      <td className="p-3 font-bold text-white">{s.productName}</td>
                      <td className="p-3 text-slate-400">{s.category}</td>
                      <td className="p-3 text-center font-bold text-indigo-400">{s.size}</td>
                      <td className="p-3 text-right font-bold text-white">{s.quantity}</td>
                      <td className="p-3 text-right text-slate-400">₹{s.unitPrice}</td>
                      <td className="p-3 text-right font-extrabold text-emerald-400">₹{s.totalAmount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: REORDER SHEET */}
        {activeTab === 'reorder' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-xs">
              <span className="text-slate-400 font-semibold">
                Items Needing Replenishment: <strong className="text-amber-400">{reorderSheet.length}</strong>
              </span>
              <button
                onClick={exportReorderCSV}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" /> Export CSV List
              </button>
            </div>

            <div className="border border-slate-800 rounded-xl bg-slate-900/60 overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-semibold uppercase">
                  <tr>
                    <th className="p-3">Product Name</th>
                    <th className="p-3 text-right">Current Stock</th>
                    <th className="p-3 text-right">Min Threshold</th>
                    <th className="p-3 text-right">Sold This Month</th>
                    <th className="p-3 text-right text-amber-400">Recommended Order</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {reorderSheet.map((i) => (
                    <tr key={i._id} className="hover:bg-slate-800/40">
                      <td className="p-3 font-bold text-white">{i.name}</td>
                      <td className="p-3 text-right text-amber-400 font-bold">{i.currentStock}</td>
                      <td className="p-3 text-right text-slate-400">{i.minRequiredStock}</td>
                      <td className="p-3 text-right text-indigo-400">{i.totalSoldThisMonth}</td>
                      <td className="p-3 text-right">
                        <span className="px-2 py-1 bg-amber-500/20 text-amber-300 font-bold rounded-md">
                          +{i.recommendedOrder} units
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MODAL 1: ADD PRODUCT */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-6 rounded-2xl text-xs space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h3 className="font-bold text-white text-base">Add Product</h3>
                <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400">✕</button>
              </div>

              <form onSubmit={handleAddProductSubmit} className="space-y-3">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Product Name</label>
                  <input
                    type="text"
                    required
                    value={newProductName}
                    onChange={(e) => setNewProductName(e.target.value)}
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-400 font-semibold block mb-1">Category</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                    >
                      <option value="Men's Wear">Men's Wear</option>
                      <option value="Women's Wear">Women's Wear</option>
                      <option value="Accessories">Accessories</option>
                      <option value="Kid's Wear">Kid's Wear</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-400 font-semibold block mb-1">Price (₹)</label>
                    <input
                      type="number"
                      required
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Stock Per Size (S, M, L, XL, XXL)</label>
                  <div className="grid grid-cols-5 gap-1">
                    {['S', 'M', 'L', 'XL', 'XXL'].map((sz) => (
                      <input
                        key={sz}
                        type="number"
                        min="0"
                        value={newSizes[sz]}
                        onChange={(e) => setNewSizes({ ...newSizes, [sz]: parseInt(e.target.value) || 0 })}
                        className="p-2 text-center bg-slate-950 border border-slate-800 rounded-lg text-white font-bold"
                      />
                    ))}
                  </div>
                </div>

                <button type="submit" className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 font-bold text-white rounded-lg">
                  Save Product
                </button>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 2: RECORD SALE */}
        {isSaleModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-6 rounded-2xl text-xs space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h3 className="font-bold text-white text-base">Record Sale</h3>
                <button onClick={() => setIsSaleModalOpen(false)} className="text-slate-400">✕</button>
              </div>

              <form onSubmit={handleRecordSaleSubmit} className="space-y-3">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Select Garment</label>
                  <select
                    value={saleProductId}
                    onChange={(e) => setSaleProductId(e.target.value)}
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  >
                    {products.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.name} (₹{p.price})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-400 font-semibold block mb-1">Size</label>
                    <select
                      value={saleSize}
                      onChange={(e) => setSaleSize(e.target.value)}
                      className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-bold"
                    >
                      {['S', 'M', 'L', 'XL', 'XXL'].map((sz) => (
                        <option key={sz} value={sz}>{sz}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-400 font-semibold block mb-1">Quantity</label>
                    <input
                      type="number"
                      min="1"
                      value={saleQty}
                      onChange={(e) => setSaleQty(parseInt(e.target.value) || 1)}
                      className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-bold text-center"
                    />
                  </div>
                </div>

                <button type="submit" className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 font-bold text-slate-950 rounded-lg">
                  Confirm & Deduct Stock
                </button>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 3: RESTOCK */}
        {isRestockModalOpen && selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-6 rounded-2xl text-xs space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h3 className="font-bold text-white text-base">Add Stock to {selectedProduct.name}</h3>
                <button onClick={() => setIsRestockModalOpen(false)} className="text-slate-400">✕</button>
              </div>

              <form onSubmit={handleRestockSubmit} className="space-y-3">
                <label className="text-slate-400 font-semibold block">Units to Add per Size:</label>
                <div className="grid grid-cols-5 gap-1">
                  {['S', 'M', 'L', 'XL', 'XXL'].map((sz) => (
                    <input
                      key={sz}
                      type="number"
                      min="0"
                      value={restockSizes[sz]}
                      onChange={(e) => setRestockSizes({ ...restockSizes, [sz]: parseInt(e.target.value) || 0 })}
                      className="p-2 text-center bg-slate-950 border border-slate-800 rounded-lg text-white font-bold"
                    />
                  ))}
                </div>

                <button type="submit" className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 font-bold text-white rounded-lg">
                  Confirm Stock Addition
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleStockManager;
