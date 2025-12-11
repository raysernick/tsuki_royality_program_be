/**
 * @fileoverview Mongoose schema and model for ClubCategory in Tsuki Coffee backend.
 * ClubCategory is used to categorize members (e.g., Silver, Gold, VIP).
 * This model is referenced by Member schema.
 *
 * Usage:
 *   const ClubCategory = require('./ClubCategory');
 *   // ClubCategory.find(), ClubCategory.create(), etc.
 */

const mongoose = require('mongoose');

// Define the ClubCategory schema
const ClubCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      default: 'Regular', // Default category name
    },
    description: {
      type: String,
      required: false,
      trim: true,
      default: '', // Default empty description
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
    collection: 'club_categories', // Explicit collection name
  }
);

// Create the ClubCategory model
const ClubCategory = mongoose.model('ClubCategory', ClubCategorySchema);

// Export the model for use in other modules
module.exports = ClubCategory;
