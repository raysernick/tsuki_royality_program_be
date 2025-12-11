/**
 * @fileoverview Express routes for Transaction operations in Tsuki Coffee backend.
 * Routes include: addTransaction, getTransactions.
 * Uses transactionController for all business logic.
 *
 * Usage:
 *   const transactionRoutes = require('./routes/transactionRoutes');
 *   app.use('/transactions', transactionRoutes);
 */

const express = require('express');
const router = express.Router();

// Import transactionController functions
const transactionController = require('../controllers/transactionController');

// Route: POST /transactions
// Description: Add a new transaction
router.post('/', transactionController.addTransaction);

// Route: GET /transactions
// Description: Get list of transactions (with optional filter)
router.get('/', transactionController.getTransactions);

module.exports = router;
