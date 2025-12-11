/**
 * @fileoverview Controller for Transaction operations in Tsuki Coffee backend.
 * Implements addTransaction, getTransactions.
 * Uses Transaction, Member, and Product models.
 * All functions are async and return JSON responses for Express routes.
 *
 * Usage:
 *   const transactionController = require('./transactionController');
 *   // transactionController.addTransaction(req, res), etc.
 */

const Transaction = require('../models/Transaction');
const Member = require('../models/Member');
const Product = require('../models/Product');
const mongoose = require('mongoose');

/**
 * Adds a new transaction to the database.
 * Expects req.body: { memberId, productId, quantity }
 * Calculates totalPrice and pointsAdded based on product and quantity.
 * Updates member's points accordingly.
 * @param {Object} req Express request
 * @param {Object} res Express response
 * @returns {Promise<void>}
 */
exports.addTransaction = async (req, res) => {
  try {
    const {
      memberId = null,
      productId = null,
      quantity = 1,
    } = req.body;

    // Validate required fields
    if (!memberId || !mongoose.Types.ObjectId.isValid(memberId)) {
      return res.status(400).json({ error: 'Valid memberId is required.' });
    }
    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ error: 'Valid productId is required.' });
    }
    if (typeof quantity !== 'number' || quantity < 1) {
      return res.status(400).json({ error: 'Quantity must be a positive integer.' });
    }

    // Find member
    const member = await Member.findById(memberId);
    if (!member) {
      return res.status(404).json({ error: 'Member not found.' });
    }

    // Check membership validity
    const now = new Date();
    if (member.validUntil < now) {
      return res.status(400).json({ error: 'Membership expired.' });
    }

    // Find product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    // Calculate totalPrice and pointsAdded
    const totalPrice = product.price * quantity;
    const pointsAdded = product.pointValue * quantity;

    // Create transaction
    const transaction = new Transaction({
      memberId: member._id,
      productId: product._id,
      quantity,
      totalPrice,
      pointsAdded,
      createdAt: new Date(),
    });

    await transaction.save();

    // Update member's points
    member.points = typeof member.points === 'number' ? member.points + pointsAdded : pointsAdded;
    await member.save();

    return res.status(200).json(transaction);
  } catch (error) {
    console.error('addTransaction error:', error);
    return res.status(500).json({ error: 'Failed to add transaction.' });
  }
};

/**
 * Gets a list of transactions, optionally filtered by memberId, productId, or date range.
 * Expects req.query.filter (JSON string: { memberId, productId, dateFrom, dateTo })
 * @param {Object} req Express request
 * @param {Object} res Express response
 * @returns {Promise<void>}
 */
exports.getTransactions = async (req, res) => {
  try {
    let filter = {};
    if (req.query.filter) {
      try {
        const parsed = JSON.parse(req.query.filter);

        if (parsed.memberId && mongoose.Types.ObjectId.isValid(parsed.memberId)) {
          filter.memberId = parsed.memberId;
        }
        if (parsed.productId && mongoose.Types.ObjectId.isValid(parsed.productId)) {
          filter.productId = parsed.productId;
        }
        if (parsed.dateFrom || parsed.dateTo) {
          filter.createdAt = {};
          if (parsed.dateFrom) {
            filter.createdAt.$gte = new Date(parsed.dateFrom);
          }
          if (parsed.dateTo) {
            filter.createdAt.$lte = new Date(parsed.dateTo);
          }
        }
      } catch (e) {
        // Ignore filter if invalid JSON
        filter = {};
      }
    }

    // Find transactions, sort by createdAt descending
    const transactions = await Transaction.find(filter)
      .sort({ createdAt: -1 })
      .populate('memberId')
      .populate('productId');

    return res.status(200).json(transactions);
  } catch (error) {
    console.error('getTransactions error:', error);
    return res.status(500).json({ error: 'Failed to get transactions.' });
  }
};
