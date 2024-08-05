const Product = require('../models/Product');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const { paginate } = require('../utils');

/*
const createProduct = async (req, res) => {
  const {
    name,
    brand,
    category,
    description,
    price,
    stock,
    image,
    specifications,
  } = req.body;

  // Validate required fields
  if (!name || !brand || !category || !price || !stock) {
    throw new CustomError.BadRequestError('Please provide all required fields');
  }

  const productData = {
    name,
    brand,
    category,
    description,
    price,
    stock,
    image,
    specifications,
    user: req.user.userId,
  };

  const product = await Product.create(productData);
  const populatedProduct = await Product.findById(product._id).populate(
    'category',
    'name'
  );
  res.status(StatusCodes.CREATED).json({
    product: {
      _id: populatedProduct._id,
      name: populatedProduct.name,
      brand: populatedProduct.brand,
      category: populatedProduct.category.name, // Return category name instead of ID
      description: populatedProduct.description,
      price: populatedProduct.price,
      stock: populatedProduct.stock,
      image: populatedProduct.image,
      featured: populatedProduct.featured,
      freeShipping: populatedProduct.freeShipping,
      specifications: populatedProduct.specifications,
      averageRating: populatedProduct.averageRating,
      numOfReviews: populatedProduct.numOfReviews,
      user: populatedProduct.user,
      createdAt: populatedProduct.createdAt,
      updatedAt: populatedProduct.updatedAt,
    },
  });
};
*/

const createProduct = async (req, res) => {
  const {
    name,
    brand,
    category,
    description,
    price,
    stock,
    specifications,
    image,
  } = req.body;

  // Validate required fields
  if (!name || !brand || !category || !price || !stock) {
    throw new CustomError.BadRequestError('Please provide all required fields');
  }

  // Upload image to Cloudinary if no image URL is provided
  let imageUrl = image || '';
  if (req.files && req.files.image) {
    const result = await cloudinary.uploader.upload(
      req.files.image.tempFilePath,
      {
        use_filename: true,
        folder: 'file-upload',
      }
    );
    fs.unlinkSync(req.files.image.tempFilePath);
    imageUrl = result.secure_url;
  }

  const productData = {
    name,
    brand,
    category,
    description,
    price,
    stock,
    image: imageUrl,
    specifications,
    user: req.user.userId,
  };

  const product = await Product.create(productData);
  const populatedProduct = await Product.findById(product._id).populate(
    'category',
    'name'
  );

  res.status(StatusCodes.CREATED).json({
    product: {
      _id: populatedProduct._id,
      name: populatedProduct.name,
      brand: populatedProduct.brand,
      category: populatedProduct.category.name,
      description: populatedProduct.description,
      price: populatedProduct.price,
      stock: populatedProduct.stock,
      image: populatedProduct.image,
      featured: populatedProduct.featured,
      freeShipping: populatedProduct.freeShipping,
      specifications: populatedProduct.specifications,
      averageRating: populatedProduct.averageRating,
      numOfReviews: populatedProduct.numOfReviews,
      user: populatedProduct.user,
      createdAt: populatedProduct.createdAt,
      updatedAt: populatedProduct.updatedAt,
    },
  });
};

const getAllProducts = async (req, res) => {
  const {
    page = 1,
    limit = 10,
    sort,
    fields,
    numericFilters,
    stockStatus,
    name,
    category,
    brand,
    price,
  } = req.query;
  const queryObject = {};

  if (stockStatus) {
    if (stockStatus === 'inStock') {
      queryObject.stock = { $gt: 0 };
    } else if (stockStatus === 'outOfStock') {
      queryObject.stock = { $lte: 0 };
    }
  }

  if (name) {
    queryObject.name = { $regex: name, $options: 'i' };
  }

  if (category) {
    queryObject.category = category;
  }

  if (brand) {
    queryObject.brand = brand;
  }

  if (price) {
    queryObject.price = price;
  }

  const options = { page, limit, sort, fields, numericFilters };
  const { results: products, pagination } = await paginate(
    Product,
    queryObject,
    options
  );

  res.status(StatusCodes.OK).json({ products, meta: { pagination } });
};

const updateProduct = async (req, res) => {
  const productId = req.params.id;
  const {
    name,
    brand,
    category,
    description,
    price,
    stock,
    image,
    specifications,
  } = req.body;
  req.body.user = req.user.userId;

  const product = await Product.findByIdAndUpdate(
    { _id: productId },
    { name, brand, category, description, price, stock, image, specifications },
    { new: true, runValidators: true }
  );

  if (!product) {
    throw new CustomError.NotFoundError(
      `No product found with this id: ${productId}`
    );
  }

  res.status(StatusCodes.OK).json({ product });
};

const deleteProduct = async (req, res) => {
  const productId = req.params.id;
  const product = await Product.findOneAndDelete({ _id: productId });
  if (!product) {
    throw new CustomError.NotFoundError(
      `No product found with this id: ${productId}`
    );
  }
  res.status(StatusCodes.OK).json({ msg: 'Product deleted!' });
};

const getProductById = async (req, res) => {
  const productId = req.params.id;
  const product = await Product.findById(productId);
  if (!product) {
    throw new CustomError.NotFoundError(
      `No product found with this id: ${productId}`
    );
  }
  res.status(StatusCodes.OK).json({ product });
};

const uploadImage = async (req, res) => {
  const result = await cloudinary.uploader.upload(
    req.files.image.tempFilePath,
    {
      use_filename: true,
      folder: 'file-upload',
    }
  );
  fs.unlinkSync(req.files.image.tempFilePath);
  return res.status(StatusCodes.OK).json({ image: { src: result.secure_url } });
};

module.exports = {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  getProductById,
  uploadImage,
};
