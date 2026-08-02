import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import Modal from '../common/Modal';
import { Plus, Trash2, Upload, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', 'Free Size'];

const ProductFormModal = ({ isOpen, onClose, product, onSave, categories = [], brands = [] }) => {
  const { register, handleSubmit, control, reset, setValue, watch } = useForm({
    defaultValues: {
      title: '',
      sku: '',
      gender: 'Unisex',
      minStockThreshold: 5,
      description: '',
      variants: [
        { size: 'M', color: 'Black', colorHex: '#000000', sku: '', price: 29.99, costPrice: 14.5, stockQuantity: 20, images: [] },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'variants',
  });

  useEffect(() => {
    if (product) {
      reset({
        title: product.title,
        sku: product.sku,
        gender: product.gender || 'Unisex',
        category: product.category?._id || product.category,
        brand: product.brand?._id || product.brand,
        minStockThreshold: product.minStockThreshold || 5,
        description: product.description || '',
        variants: product.variants && product.variants.length > 0 ? product.variants : [
          { size: 'M', color: 'Black', colorHex: '#000000', sku: `${product.sku}-M-BLK`, price: 29.99, costPrice: 14.5, stockQuantity: 20 },
        ],
      });
    } else {
      const autoSku = `APP-${Math.floor(100000 + Math.random() * 900000)}`;
      reset({
        title: '',
        sku: autoSku,
        gender: 'Unisex',
        minStockThreshold: 5,
        description: '',
        variants: [
          { size: 'M', color: 'Black', colorHex: '#000000', sku: `${autoSku}-M-BLK`, price: 34.99, costPrice: 16.0, stockQuantity: 25 },
        ],
      });
    }
  }, [product, isOpen, reset]);

  const addVariantField = () => {
    const currentSku = watch('sku') || 'APP-ITEM';
    append({
      size: 'L',
      color: 'Navy',
      colorHex: '#0f172a',
      sku: `${currentSku}-L-NVY-${fields.length + 1}`,
      price: 34.99,
      costPrice: 16.0,
      stockQuantity: 15,
      images: [],
    });
  };

  const onSubmit = (data) => {
    if (!data.variants || data.variants.length === 0) {
      toast.error('Please add at least one clothing size/color variant');
      return;
    }
    onSave(data);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={product ? 'Edit Clothing Item' : 'Add New Clothing Product'}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Main Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Apparel Title</label>
            <input
              type="text"
              placeholder="e.g. Vintage Denim Trucker Jacket"
              {...register('title', { required: true })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Master SKU Code</label>
            <input
              type="text"
              placeholder="APP-102948"
              {...register('sku', { required: true })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
            <select
              {...register('category')}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Brand</label>
            <select
              {...register('brand')}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              {brands.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Gender / Dept</label>
            <select
              {...register('gender')}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="Unisex">Unisex</option>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Kids">Kids</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Min Stock Warning Threshold</label>
          <input
            type="number"
            {...register('minStockThreshold', { valueAsNumber: true })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Product Description</label>
          <textarea
            rows={2}
            placeholder="Fabric composition, care instructions, fit type..."
            {...register('description')}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Clothing Variants Section */}
        <div className="pt-3 border-t border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-indigo-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Clothing Variants (Size & Color Stock)</span>
            </h4>
            <button
              type="button"
              onClick={addVariantField}
              className="px-3 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold hover:bg-indigo-500/20 transition-colors flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Variant</span>
            </button>
          </div>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 relative"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400">Variant #{index + 1}</span>
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-rose-400 hover:text-rose-300 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-400">Size</label>
                    <select
                      {...register(`variants.${index}.size`)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-200"
                    >
                      {SIZES.map((sz) => (
                        <option key={sz} value={sz}>
                          {sz}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400">Color</label>
                    <input
                      type="text"
                      placeholder="e.g. Navy"
                      {...register(`variants.${index}.color`, { required: true })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-200"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400">Variant SKU</label>
                    <input
                      type="text"
                      {...register(`variants.${index}.sku`, { required: true })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-200 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400">Stock Qty</label>
                    <input
                      type="number"
                      {...register(`variants.${index}.stockQuantity`, { valueAsNumber: true })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-200 font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-400">Retail Selling Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      {...register(`variants.${index}.price`, { valueAsNumber: true })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-200 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400">Cost Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      {...register(`variants.${index}.costPrice`, { valueAsNumber: true })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-200"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all"
        >
          {product ? 'Update Clothing Product' : 'Save Product & Variants'}
        </button>
      </form>
    </Modal>
  );
};

export default ProductFormModal;
