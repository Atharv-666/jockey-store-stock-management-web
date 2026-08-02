import asyncHandler from 'express-async-handler';
import Category from '../models/Category.js';

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({}).sort({ createdAt: -1 });
  res.json({
    success: true,
    count: categories.length,
    data: categories,
  });
});

// @desc    Create new category
// @route   POST /api/categories
// @access  Private (Admin, Manager)
export const createCategory = asyncHandler(async (req, res) => {
  const { name, gender, description } = req.body;

  const exists = await Category.findOne({ name });
  if (exists) {
    res.status(400);
    throw new Error('Category name already exists');
  }

  const category = await Category.create({ name, gender, description });
  res.status(201).json({
    success: true,
    data: category,
  });
});

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private (Admin, Manager)
export const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  category.name = req.body.name || category.name;
  category.gender = req.body.gender || category.gender;
  category.description = req.body.description !== undefined ? req.body.description : category.description;
  if (req.body.isActive !== undefined) {
    category.isActive = req.body.isActive;
  }

  const updatedCategory = await category.save();
  res.json({
    success: true,
    data: updatedCategory,
  });
});

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private (Admin)
export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  await category.deleteOne();
  res.json({
    success: true,
    message: 'Category removed successfully',
  });
});
