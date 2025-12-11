/**
 * @fileoverview Controller for Product operations in Tsuki Coffee backend.
 * Implements addProduct, editProduct, getProducts.
 * Uses Product model.
 * All functions are async and return JSON responses for Express routes.
 *
 * Usage:
 *   const productController = require('./productController');
 *   // productController.addProduct(req, res), etc.
 */

const Product = require('../models/Product');

/**
 * Adds a new product to the database.
 * Expects req.body: { name, price, pointValue }
 * @param {Object} req Express request
 * @param {Object} res Express response
 * @returns {Promise<void>}
 */
exports.addProduct = async (req, res) => {
  try {
    const {
      name = '',
      price = 0,
      pointValue = 1,
    } = req.body;

    // Validate required fields
    if (!name.trim()) {
      return res.status(400).json({ error: 'Product name is required.' });
    }
    if (typeof price !== 'number' || price < 0) {
      return res.status(400).json({ error: 'Product price must be a non-negative number.' });
    }
    if (typeof pointValue !== 'number' || pointValue < 0) {
      return res.status(400).json({ error: 'Product pointValue must be a non-negative number.' });
    }

    // Check for duplicate product name
    const existingProduct = await Product.findOne({ name: name.trim() });
    if (existingProduct) {
      return res.status(400).json({ error: 'Product name already exists.' });
    }

    // Create product
    const product = new Product({
      name: name.trim(),
      price,
      pointValue,
    });

    await product.save();

    return res.status(200).json(product);
  } catch (error) {
    console.error('addProduct error:', error);
    return res.status(500).json({ error: 'Failed to add product.' });
  }
};

/**
 * Edits an existing product's data.
 * Expects req.params.id and req.body: { name, price, pointValue }
 * @param {Object} req Express request
 * @param {Object} res Express response
 * @returns {Promise<void>}
 */
exports.editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      price,
      pointValue,
    } = req.body;

    // Find product
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    // Update fields if provided
    if (typeof name === 'string' && name.trim()) {
      // Check for duplicate name (excluding current product)
      const duplicate = await Product.findOne({ name: name.trim(), _id: { $ne: id } });
      if (duplicate) {
        return res.status(400).json({ error: 'Product name already exists.' });
      }
      product.name = name.trim();
    }
    if (typeof price === 'number' && price >= 0) {
      product.price = price;
    }
    if (typeof pointValue === 'number' && pointValue >= 0) {
      product.pointValue = pointValue;
    }

    await product.save();

    return res.status(200).json(product);
  } catch (error) {
    console.error('editProduct error:', error);
    return res.status(500).json({ error: 'Failed to edit product.' });
  }
};

/**
 * Gets a list of all products.
 * No filter supported in this version.
 * @param {Object} req Express request
 * @param {Object} res Express response
 * @returns {Promise<void>}
 */
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    return res.status(200).json(products);
  } catch (error) {
    console.error('getProducts error:', error);
    return res.status(500).json({ error: 'Failed to get products.' });
  }
};
