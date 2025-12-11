/**
 * @fileoverview Mongoose schema and model for Member in Tsuki Coffee backend.
 * Member represents a customer with membership, points, and club category.
 * This model is referenced by Transaction and relates to ClubCategory.
 *
 * Usage:
 *   const Member = require('./Member');
 *   // Member.find(), Member.create(), etc.
 */

const mongoose = require('mongoose');

// Strongly type the ObjectId for clubCategory reference
const { Schema, Types } = mongoose;

// Define the Member schema
const MemberSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      default: '', // Default empty name
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      default: '', // Default empty phone
    },
    clubCategory: {
      type: Types.ObjectId,
      ref: 'ClubCategory',
      required: false, // Optional, can be null for default category
      default: null,
    },
    validUntil: {
      type: Date,
      required: true,
      default: () => {
        // Default: valid for 1 year from creation
        const now = new Date();
        now.setFullYear(now.getFullYear() + 1);
        return now;
      },
    },
    points: {
      type: Number,
      required: true,
      default: 0, // Default points is 0
      min: 0,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
    collection: 'members', // Explicit collection name
  }
);

// Indexes for efficient search and filter
MemberSchema.index({ name: 1 });
MemberSchema.index({ phone: 1 });
MemberSchema.index({ validUntil: 1 });
MemberSchema.index({ clubCategory: 1 });

// Export the Member model for use in controllers and elsewhere
const Member = mongoose.model('Member', MemberSchema);

module.exports = Member;
