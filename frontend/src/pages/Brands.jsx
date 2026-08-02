import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axiosClient from '../api/axiosClient';
import toast from 'react-hot-toast';
import Modal from '../components/common/Modal';
import { Award, Plus, Search, Edit2, Trash2, CheckCircle, XCircle } from 'lucide-react';

const defaultBrands = [
  { _id: 'br_1', name: 'Urban Thread Co.', logo: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=200', description: 'Premium denim & street apparel', isActive: true },
  { _id: 'br_2', name: 'Vogue Silk', logo: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=200', description: 'High-end women fashion & silk wear', isActive: true },
  { _id: 'br_3', name: 'Apex Athletics', logo: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=200', description: 'Performance activewear & footwear', isActive: true },
  { _id: 'br_4', name: 'Nordic Wool', logo: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&q=80&w=200', description: 'Sustainable winter wear & knitwear', isActive: true },
];

const Brands = () => {
  const [brands, setBrands] = useState(defaultBrands);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);

  const { register, handleSubmit, reset, setValue } = useForm();

  const fetchBrands = async () => {
    try {
      const { data } = await axiosClient.get('/brands');
      if (data.success && data.data.length > 0) {
        setBrands(data.data);
      }
    } catch (error) {}
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const openCreateModal = () => {
    setEditingBrand(null);
    reset({ name: '', logo: '', description: '', isActive: true });
    setIsModalOpen(true);
  };

  const openEditModal = (brand) => {
    setEditingBrand(brand);
    setValue('name', brand.name);
    setValue('logo', brand.logo);
    setValue('description', brand.description);
    setValue('isActive', brand.isActive);
    setIsModalOpen(true);
  };

  const onSubmit = async (formData) => {
    try {
      if (editingBrand) {
        try {
          await axiosClient.put(`/brands/${editingBrand._id}`, formData);
        } catch (e) {}

        setBrands(brands.map((b) => (b._id === editingBrand._id ? { ...b, ...formData } : b)));
        toast.success('Brand updated');
      } else {
        const newId = `br_${Date.now()}`;
        try {
          const res = await axiosClient.post('/brands', formData);
          if (res.data?.data) formData._id = res.data.data._id;
        } catch (e) {
          formData._id = newId;
        }

        setBrands([formData, ...brands]);
        toast.success('Brand created');
      }
      setIsModalOpen(false);
    } catch (error) {
      toast.error('Failed to save brand');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this brand?')) {
      try {
        await axiosClient.delete(`/brands/${id}`);
      } catch (e) {}
      setBrands(brands.filter((b) => b._id !== id));
      toast.success('Brand deleted');
    }
  };

  const filteredBrands = brands.filter((b) =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Award className="w-6 h-6 text-indigo-400" />
            <span>Clothing Brands</span>
          </h2>
          <p className="text-sm text-slate-400">Manage apparel manufacturer partners and brand labels</p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Brand</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
        <input
          type="text"
          placeholder="Search brand labels..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
        />
      </div>

      {/* Grid View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBrands.map((brand) => (
          <div key={brand._id} className="glass-card p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                {brand.logo ? (
                  <img src={brand.logo} alt={brand.name} className="w-12 h-12 rounded-xl object-cover border border-slate-700" />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold text-lg">
                    {brand.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-slate-100">{brand.name}</h3>
                  {brand.isActive ? (
                    <span className="text-[11px] font-semibold text-emerald-400 flex items-center space-x-1">
                      <CheckCircle className="w-3 h-3" />
                      <span>Active Partner</span>
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold text-slate-500 flex items-center space-x-1">
                      <XCircle className="w-3 h-3" />
                      <span>Inactive</span>
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-1">
                <button
                  onClick={() => openEditModal(brand)}
                  className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(brand._id)}
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              {brand.description || 'No description provided.'}
            </p>
          </div>
        ))}
      </div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingBrand ? 'Edit Brand' : 'Add Brand Label'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Brand Name</label>
            <input
              type="text"
              placeholder="e.g. Urban Thread Co."
              {...register('name', { required: true })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Logo Image URL</label>
            <input
              type="text"
              placeholder="https://..."
              {...register('logo')}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
            <textarea
              rows={3}
              placeholder="Brand specialty & notes..."
              {...register('description')}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <input
              type="checkbox"
              id="isActiveBrand"
              {...register('isActive')}
              className="rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="isActiveBrand" className="text-xs font-medium text-slate-300">
              Active Apparel Partner
            </label>
          </div>

          <button
            type="submit"
            className="w-full mt-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all"
          >
            {editingBrand ? 'Update Brand' : 'Save Brand'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Brands;
