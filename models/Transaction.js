/**
 * @fileoverview Mongoose schema and model for Transaction in Tsuki Coffee backend.
 * Transaction represents a purchase made by a member, including product, quantity, total price, and points added.
 * This model references Member and Product schemas.
 *
 * Usage:
 *   const Transaction = require('./Transaction');
 *   // Transaction.find(), Transaction.create(), etc.
 */

const mongoose = require('mongoose');

// Strongly type the ObjectId for references
const { Schema, Types } = mongoose;

// Define the Transaction schema
const TransactionSchema = new Schema(
  {
    memberId: {
      type: Types.ObjectId,
      ref: 'Member',
      required: true,
      index: true, // For efficient member transaction lookup
    },
    productId: {
      type: Types.ObjectId,
      ref: 'Product',
      required: true,
      index: true, // For efficient product transaction lookup
    },
    quantity: {
      type: Number,
      required: true,
      default: 1, // Default quantity is 1
      min: 1,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0, // Default total price is 0
      min: 0,
    },
    pointsAdded: {
      type: Number,
      required: true,
      default: 0, // Default points added is 0
      min: 0,
    },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now, // Default to now
    },
  },
  {
    // No need for updatedAt, transaction is immutable
    collection: 'transactions', // Explicit collection name
  }
);

// Indexes for efficient queries
TransactionSchema.index({ memberId: 1 });
TransactionSchema.index({ productId: 1 });
TransactionSchema.index({ createdAt: -1 });

// Export the Transaction model for use in controllers and elsewhere
const Transaction = mongoose.model('Transaction', TransactionSchema);

module.exports = Transaction;
