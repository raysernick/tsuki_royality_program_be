/**
 * @fileoverview Mongoose schema and model for Product in Tsuki Coffee backend.
 * Product represents an item that can be purchased and has a point value for member rewards.
 * This model is used by Transaction and ProductController.
 *
 * Usage:
 *   const Product = require('./Product');
 *   // Product.find(), Product.create(), etc.
 */

const mongoose = require("mongoose");

// Strongly type the ObjectId for future extensibility
const { Schema } = mongoose;

// Define the Product schema
const ProductSchema = new Schema(
  {
    product_name: {
      type: String,
      required: true,
      trim: true,
      default: "", // Default empty name
      unique: true, // Product name should be unique
    },
    price: {
      type: Number,
      required: true,
      default: 0, // Default price is 0
      min: 0,
    },
    pointValue: {
      type: Number,
      required: true,
      default: 1, // Default point value per product
      min: 0,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
    collection: "products", // Explicit collection name
  }
);

// Indexes for efficient search and filter
ProductSchema.index({ name: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ pointValue: 1 });

// Export the Product model for use in controllers and elsewhere
const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
