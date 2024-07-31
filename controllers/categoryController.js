const Category = require('../models/Category');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');

const createCategory = async (req, res) => {
  const { name, description } = req.body;
  if (!name) {
    throw new CustomError.BadRequestError('Please provide category name');
  }
  const category = await Category.create({ name, description });
  res.status(StatusCodes.CREATED).json({ category });
};

const getAllCategories = async (req, res) => {
  const categories = await Category.find({});
  res
    .status(StatusCodes.OK)
    .json({ categories, categoriesCounter: categories.length });
};

const getCategoryById = async (req, res) => {
  const categoryId = req.params.id;
  const category = await Category.findById(categoryId);
  if (!category) {
    throw new CustomError.NotFoundError(
      `No category found with this id: ${categoryId}`
    );
  }
  res.status(StatusCodes.OK).json({ category });
};

const updateCategory = async (req, res) => {
  const categoryId = req.params.id;
  const { name, description } = req.body;
  const category = await Category.findByIdAndUpdate(
    categoryId,
    { name, description },
    { new: true, runValidators: true }
  );
  if (!category) {
    throw new CustomError.NotFoundError(`No category found with id: ${id}`);
  }
  res.status(StatusCodes.OK).json({ category });
};

const deleteCategory = async (req, res) => {
  const categoryId = req.params.id;
  const category = await Category.findByIdAndDelete(categoryId);
  if (!category) {
    throw new CustomError.NotFoundError(
      `No category found with id: ${categoryId}`
    );
  }
  res.status(StatusCodes.OK).json({ msg: 'Category deleted!' });
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
