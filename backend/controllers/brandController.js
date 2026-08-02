import asyncHandler from 'express-async-handler';
import Brand from '../models/Brand.js';

// @desc    Get all brands
// @route   GET /api/brands
// @access  Public
export const getBrands = asyncHandler(async (req, res) => {
  const brands = await Brand.find({}).sort({ createdAt: -1 });
  res.json({
    success: true,
    count: brands.length,
    data: brands,
  });
});

// @desc    Create new brand
// @route   POST /api/brands
// @access  Private (Admin, Manager)
export const createBrand = asyncHandler(async (req, res) => {
  const { name, logo, description } = req.body;

  const exists = await Brand.findOne({ name });
  if (exists) {
    res.status(400);
    throw new Error('Brand name already exists');
  }

  const brand = await Brand.create({ name, logo, description });
  res.status(201).json({
    success: true,
    data: brand,
  });
});

// @desc    Update brand
// @route   PUT /api/brands/:id
// @access  Private (Admin, Manager)
export const updateBrand = asyncHandler(async (req, res) => {
  const brand = await Brand.findById(req.params.id);
  if (!brand) {
    res.status(404);
    throw new Error('Brand not found');
  }

  brand.name = req.body.name || brand.name;
  brand.logo = req.body.logo !== undefined ? req.body.logo : brand.logo;
  brand.description = req.body.description !== undefined ? req.body.description : brand.description;
  if (req.body.isActive !== undefined) {
    brand.isActive = req.body.isActive;
  }

  const updatedBrand = await brand.save();
  res.json({
    success: true,
    data: updatedBrand,
  });
});

// @desc    Delete brand
// @route   DELETE /api/brands/:id
// @access  Private (Admin)
export const deleteBrand = asyncHandler(async (req, res) => {
  const brand = await Brand.findById(req.params.id);
  if (!brand) {
    res.status(404);
    throw new Error('Brand not found');
  }

  await brand.deleteOne();
  res.json({
    success: true,
    message: 'Brand removed successfully',
  });
});
