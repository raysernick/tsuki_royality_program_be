/**
 * @fileoverview Express routes for Product operations in Tsuki Coffee backend.
 * Routes include: addProduct, editProduct, getProducts.
 * Uses productController for all business logic.
 *
 * Usage:
 *   const productRoutes = require('./routes/productRoutes');
 *   app.use('/products', productRoutes);
 */

const express = require('express');
const router = express.Router();

// Import productController functions
const productController = require('../controllers/productController');

// Route: POST /products
// Description: Add a new product
router.post('/', productController.addProduct);

// Route: GET /products
// Description: Get list of products
router.get('/', productController.getProducts);

// Route: PUT /products/:id
// Description: Edit product data
router.put('/:id', productController.editProduct);

module.exports = router;
