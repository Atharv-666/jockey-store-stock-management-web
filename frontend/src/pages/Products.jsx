import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import toast from 'react-hot-toast';
import Badge from '../components/common/Badge';
import ProductFormModal from '../components/product/ProductFormModal';
import StockAdjustModal from '../components/product/StockAdjustModal';
import {
  Shirt,
  Plus,
  Search,
  Filter,
  Grid,
  List,
  Edit2,
  Trash2,
  ArrowUpDown,
  AlertTriangle,
  Tag,
  Award
} from 'lucide-react';

const defaultProducts = [
  {
    _id: 'prod_1',
    title: 'Vintage Denim Trucker Jacket',
    sku: 'APP-102948',
    category: { _id: 'cat_3', name: 'Jeans & Denim' },
    brand: { _id: 'br_1', name: 'Urban Thread Co.' },
    gender: 'Unisex',
    minStockThreshold: 10,
    description: '100% heavyweight cotton denim jacket with distressed wash finish.',
    variants: [
      { _id: 'v1', size: 'S', color: 'Vintage Blue', stockQuantity: 8, price: 89.99, costPrice: 42.0 },
      { _id: 'v2', size: 'M', color: 'Vintage Blue', stockQuantity: 18, price: 89.99, costPrice: 42.0 },
      { _id: 'v3', size: 'L', color: 'Vintage Blue', stockQuantity: 4, price: 89.99, costPrice: 42.0 },
    ],
    image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&q=80&w=400',
  },
  {
    _id: 'prod_2',
    title: 'Silk Evening Wrap Maxi Dress',
    sku: 'APP-304912',
    category: { _id: 'cat_2', name: 'Dresses & Skirts' },
    brand: { _id: 'br_2', name: 'Vogue Silk' },
    gender: 'Women',
    minStockThreshold: 5,
    description: 'Pure Mulberry silk floor-length dress with elegant tie waist.',
    variants: [
      { _id: 'v4', size: 'S', color: 'Emerald Green', stockQuantity: 2, price: 149.99, costPrice: 70.0 },
      { _id: 'v5', size: 'M', color: 'Emerald Green', stockQuantity: 3, price: 149.99, costPrice: 70.0 },
    ],
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=400',
  },
  {
    _id: 'prod_3',
    title: 'Pro-Flex DryFit Training Hoodie',
    sku: 'APP-509123',
    category: { _id: 'cat_5', name: 'Activewear & Sportswear' },
    brand: { _id: 'br_3', name: 'Apex Athletics' },
    gender: 'Unisex',
    minStockThreshold: 12,
    description: 'Moisture-wicking athletic hoodie with thumbholes and zippered pockets.',
    variants: [
      { _id: 'v6', size: 'M', color: 'Charcoal Black', stockQuantity: 22, price: 54.99, costPrice: 22.0 },
      { _id: 'v7', size: 'L', color: 'Charcoal Black', stockQuantity: 15, price: 54.99, costPrice: 22.0 },
      { _id: 'v8', size: 'XL', color: 'Charcoal Black', stockQuantity: 9, price: 54.99, costPrice: 22.0 },
    ],
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=400',
  },
];

const Products = () => {
  const [products, setProducts] = useState(defaultProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGender, setSelectedGender] = useState('All');
  const [onlyLowStock, setOnlyLowStock] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchProducts = async () => {
    try {
      const { data } = await axiosClient.get('/products');
      if (data.success && data.data.length > 0) {
        setProducts(data.data);
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openCreateModal = () => {
    setSelectedProduct(null);
    setIsFormModalOpen(true);
  };

  const openEditModal = (product) => {
    setSelectedProduct(product);
    setIsFormModalOpen(true);
  };

  const openAdjustModal = (product) => {
    setSelectedProduct(product);
    setIsAdjustModalOpen(true);
  };

  const handleSaveProduct = async (formData) => {
    if (selectedProduct) {
      try {
        await axiosClient.put(`/products/${selectedProduct._id}`, formData);
      } catch (e) {}

      setProducts(
        products.map((p) => (p._id === selectedProduct._id ? { ...p, ...formData } : p))
      );
      toast.success('Clothing item updated successfully');
    } else {
      const newId = `prod_${Date.now()}`;
      try {
        const res = await axiosClient.post('/products', formData);
        if (res.data?.data) formData._id = res.data.data._id;
      } catch (e) {
        formData._id = newId;
      }
      setProducts([formData, ...products]);
      toast.success('Apparel product added to inventory');
    }
    setIsFormModalOpen(false);
  };

  const handleAdjustStock = async (productId, variantId, quantityChange) => {
    setProducts(
      products.map((p) => {
        if (p._id === productId) {
          const updatedVariants = p.variants.map((v) => {
            if ((v._id || v.sku) === variantId) {
              return { ...v, stockQuantity: Math.max(0, v.stockQuantity + quantityChange) };
            }
            return v;
          });
          return { ...p, variants: updatedVariants };
        }
        return p;
      })
    );
    toast.success('Stock adjusted');
  };

  const handleDeleteProduct = async (id) => {
    if (confirm('Delete this product from stock?')) {
      try {
        await axiosClient.delete(`/products/${id}`);
      } catch (e) {}
      setProducts(products.filter((p) => p._id !== id));
      toast.success('Product deleted');
    }
  };

  const filteredProducts = products.filter((p) => {
    const totalStock = p.variants ? p.variants.reduce((acc, curr) => acc + curr.stockQuantity, 0) : 0;
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGender = selectedGender === 'All' || p.gender === selectedGender;
    const matchesLowStock = !onlyLowStock || totalStock <= p.minStockThreshold;
    return matchesSearch && matchesGender && matchesLowStock;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Shirt className="w-6 h-6 text-indigo-400" />
            <span>Apparel Stock Catalog</span>
          </h2>
          <p className="text-sm text-slate-400">
            Multi-variant inventory tracking by sizes (S, M, L, XL), colors, and SKU
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Apparel Item</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="glass-card p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 border border-slate-800">
        <div className="flex flex-1 items-center space-x-3 w-full md:w-auto">
          <div className="relative flex-1 max-w-xs">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
            <input
              type="text"
              placeholder="Search title, SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <select
            value={selectedGender}
            onChange={(e) => setSelectedGender(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="All">All Genders</option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
            <option value="Unisex">Unisex</option>
          </select>
        </div>

        <div className="flex items-center space-x-4 w-full md:w-auto justify-between md:justify-end">
          <button
            onClick={() => setOnlyLowStock(!onlyLowStock)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 border transition-all ${
              onlyLowStock
                ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Low Stock Alerts</span>
          </button>

          <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-slate-400'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'table' ? 'bg-indigo-600 text-white' : 'text-slate-400'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const totalStock = product.variants ? product.variants.reduce((acc, curr) => acc + curr.stockQuantity, 0) : 0;
            const isLow = totalStock <= (product.minStockThreshold || 5);

            return (
              <div
                key={product._id}
                className={`glass-card rounded-2xl p-5 border relative flex flex-col justify-between space-y-4 transition-all hover:translate-y-[-2px] ${
                  isLow ? 'border-rose-500/30' : 'border-slate-800'
                }`}
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs text-indigo-400 font-bold bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">
                      {product.sku}
                    </span>
                    {isLow ? (
                      <Badge variant="rose" className="animate-pulse">
                        Low Stock ({totalStock} pcs)
                      </Badge>
                    ) : (
                      <Badge variant="emerald">In Stock ({totalStock} pcs)</Badge>
                    )}
                  </div>

                  <h3 className="font-extrabold text-base text-slate-100 line-clamp-1">{product.title}</h3>
                  <div className="flex items-center space-x-2 text-xs text-slate-400 mt-1">
                    <span>{product.category?.name || 'Category'}</span>
                    <span>•</span>
                    <span>{product.gender}</span>
                  </div>

                  <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {product.description || 'No detailed description.'}
                  </p>

                  {/* Size Stock Pills */}
                  <div className="mt-4 pt-3 border-t border-slate-800/80">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Variant Sizes
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {product.variants?.map((v, idx) => (
                        <div
                          key={v._id || idx}
                          className={`px-2 py-1 rounded-lg text-[11px] font-medium border flex items-center space-x-1 ${
                            v.stockQuantity === 0
                              ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                              : v.stockQuantity < 5
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                              : 'bg-slate-900 text-slate-300 border-slate-800'
                          }`}
                        >
                          <span className="font-bold">{v.size}:</span>
                          <span>{v.stockQuantity} pcs</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => openAdjustModal(product)}
                    className="px-3 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 text-xs font-semibold transition-colors flex items-center space-x-1"
                  >
                    <ArrowUpDown className="w-3.5 h-3.5" />
                    <span>Quick Restock</span>
                  </button>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => openEditModal(product)}
                      className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product._id)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/80 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">SKU & Item</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Sizes & Quantities</th>
                <th className="px-6 py-4">Total Stock</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredProducts.map((product) => {
                const totalStock = product.variants ? product.variants.reduce((acc, curr) => acc + curr.stockQuantity, 0) : 0;
                return (
                  <tr key={product._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-100">{product.title}</div>
                      <div className="font-mono text-xs text-indigo-400">{product.sku}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      {product.category?.name || 'Apparel'} ({product.gender})
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {product.variants?.map((v, i) => (
                          <span key={i} className="text-xs bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                            {v.size}: <span className="font-bold text-slate-200">{v.stockQuantity}</span>
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={totalStock <= product.minStockThreshold ? 'rose' : 'emerald'}>
                        {totalStock} pcs
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => openAdjustModal(product)}
                        className="px-2 py-1 rounded bg-indigo-500/10 text-indigo-400 text-xs font-semibold"
                      >
                        Adjust
                      </button>
                      <button onClick={() => openEditModal(product)} className="text-slate-400 hover:text-indigo-400">
                        <Edit2 className="w-4 h-4 inline" />
                      </button>
                      <button onClick={() => handleDeleteProduct(product._id)} className="text-slate-400 hover:text-rose-400">
                        <Trash2 className="w-4 h-4 inline" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modals */}
      <ProductFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        product={selectedProduct}
        onSave={handleSaveProduct}
      />

      <StockAdjustModal
        isOpen={isAdjustModalOpen}
        onClose={() => setIsAdjustModalOpen(false)}
        product={selectedProduct}
        onAdjust={handleAdjustStock}
      />
    </div>
  );
};

export default Products;
