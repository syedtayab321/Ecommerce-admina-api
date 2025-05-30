import Product from '../models/Product.js';
import Inventory from '../models/Inventory.js';
import asyncHandler from '../utils/asyncHandler.js';
import ErrorResponse from '../utils/ErrorResponse.js';
import { validateProductInput } from '../utils/validation.js';

const getProducts = asyncHandler(async (req, res, next) => {
  const { category, search, page = 1, limit = 20 } = req.query;
  
  const filter = {};
  
  if (category) filter.category = category;
  if (search) filter.$text = { $search: search };
  
  const products = await Product.find(filter)
    .skip((page - 1) * limit)
    .limit(limit);
  
  const total = await Product.countDocuments(filter);
  
  res.status(200).json({
    success: true,
    count: products.length,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / limit),
    data: products
  });
});

const getProductById = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  
  if (!product) {
    throw new ErrorResponse(`Product not found with id of ${req.params.id}`, 404);
  }
  
  const inventory = await Inventory.findOne({ product: product._id });
  
  res.status(200).json({
    success: true,
    data: {
      product,
      inventory
    }
  });
});

const createProduct = asyncHandler(async (req, res, next) => {
  const { error } = validateProductInput(req.body);
  if (error) throw new ErrorResponse(error.details[0].message, 400);
  
  const { name, description, price, category, sku, images, initialQuantity = 0 } = req.body;
  
  const existingProduct = await Product.findOne({ sku });
  if (existingProduct) {
    throw new ErrorResponse('Product with this SKU already exists', 400);
  }
  
  const product = await Product.create({
    name,
    description,
    price,
    category,
    sku,
    images: images || []
  });
  
  await Inventory.create({
    product: product._id,
    quantity: initialQuantity,
    lowStockThreshold: 10
  });
  
  res.status(201).json({
    success: true,
    data: product
  });
});

export { getProducts, getProductById, createProduct };