/**
 * @fileoverview Controller for Member operations in Tsuki Coffee backend.
 * Implements addMember, editMember, searchMember, getMembers, checkValidity, redeemPoints.
 * Uses Member and ClubCategory models.
 * All functions are async and return JSON responses for Express routes.
 *
 * Usage:
 *   const memberController = require('./memberController');
 *   // memberController.addMember(req, res), etc.
 */

const Member = require("../models/Member");
const ClubCategory = require("../models/ClubCategory");
const mongoose = require("mongoose");

/**
 * Adds a new member to the database.
 * Expects req.body: { name, phone, clubCategory (optional), validUntil (optional), points (optional) }
 * @param {Object} req Express request
 * @param {Object} res Express response
 * @returns {Promise<void>}
 */
exports.addMember = async (req, res) => {
  try {
    const {
      name = "",
      phone = "",
      clubCategory = null,
      validUntil = null,
      points = 0,
    } = req.body;

    // Validate required fields
    if (!name.trim() || !phone.trim()) {
      return res.status(400).json({ error: "Name and phone are required." });
    }

    // Check for duplicate phone number
    const existingMember = await Member.findOne({ phone: phone.trim() });
    if (existingMember) {
      return res.status(400).json({ error: "Member ini sudah terdaftar." });
    }

    // If clubCategory is provided, validate existence
    let clubCategoryId = null;
    if (clubCategory) {
      const category = await ClubCategory.findOne({ name: clubCategory });
      if (!category) {
        return res.status(400).json({ error: "ClubCategory not found." });
      }
      clubCategoryId = category._id;
    }

    // Set validUntil: default 1 year from now if not provided
    let validUntilDate = validUntil
      ? new Date(validUntil)
      : (() => {
          const now = new Date();
          now.setFullYear(now.getFullYear() + 1);
          return now;
        })();

    // Create member
    const member = new Member({
      name: name.trim(),
      phone: phone.trim(),
      clubCategory: clubCategoryId,
      validUntil: validUntilDate,
      points: typeof points === "number" && points >= 0 ? points : 0,
    });

    await member.save();

    // Populate clubCategory for response
    await member.populate("clubCategory");

    return res.status(200).json(member);
  } catch (error) {
    console.error("addMember error:", error);
    return res.status(500).json({ error: "Failed to add member." });
  }
};

/**
 * Edits an existing member's data.
 * Expects req.params.id and req.body: { name, phone, clubCategory, validUntil, points }
 * @param {Object} req Express request
 * @param {Object} res Express response
 * @returns {Promise<void>}
 */
exports.editMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, clubCategory, validUntil, points } = req.body;

    // Find member
    const member = await Member.findById(id);
    if (!member) {
      return res.status(404).json({ error: "Member not found." });
    }

    // Update fields if provided
    if (typeof name === "string") member.name = name.trim();
    if (typeof phone === "string") member.phone = phone.trim();

    if (clubCategory) {
      const category = await ClubCategory.findOne({
        name: clubCategory,
      });
      if (!category) {
        return res.status(400).json({ error: "ClubCategory not found." });
      }
      member.clubCategory = category._id;
    }

    if (validUntil) {
      member.validUntil = new Date(validUntil);
    }

    if (typeof points === "number" && points >= 0) {
      member.points = points;
    }

    await member.save();

    // Populate clubCategory for response
    await member.populate("clubCategory");

    return res.status(200).json(member);
  } catch (error) {
    console.error("editMember error:", error);
    return res.status(500).json({ error: "Failed to edit member." });
  }
};

/**
 * Searches for members by query (name or phone).
 * Expects req.query.query (string).
 * @param {Object} req Express request
 * @param {Object} res Express response
 * @returns {Promise<void>}
 */
exports.searchMember = async (req, res) => {
  try {
    const { query = "" } = req.query;
    if (!query.trim()) {
      return res.status(400).json({ error: "Query is required." });
    }

    // Search by name or phone (case-insensitive)
    const regex = new RegExp(query.trim(), "i");
    const members = await Member.find({
      $or: [{ name: regex }, { phone: regex }],
    }).populate("clubCategory");

    return res.status(200).json(members);
  } catch (error) {
    console.error("searchMember error:", error);
    return res.status(500).json({ error: "Failed to search member." });
  }
};

/**
 * Gets a list of members, optionally filtered by validUntil or clubCategory.
 * Expects req.query.filter (JSON string: { validUntil, clubCategory })
 * @param {Object} req Express request
 * @param {Object} res Express response
 * @returns {Promise<void>}
 */
exports.getMembers = async (req, res) => {
  try {
    let filter = {};
    if (req.query.filter) {
      try {
        const parsed = JSON.parse(req.query.filter);
        if (parsed.validUntil) {
          // Filter members whose validUntil >= parsed.validUntil
          filter.validUntil = { $gte: new Date(parsed.validUntil) };
        }
        if (parsed.clubCategory) {
          filter.clubCategory = parsed.clubCategory;
        }
      } catch (e) {
        // Ignore filter if invalid JSON
        filter = {};
      }
    }

    const members = await Member.find(filter).populate("clubCategory");

    return res.status(200).json(members);
  } catch (error) {
    console.error("getMembers error:", error);
    return res.status(500).json({ error: "Failed to get members." });
  }
};

/**
 * Checks if a member's membership is still valid.
 * Expects req.params.id.
 * @param {Object} req Express request
 * @param {Object} res Express response
 * @returns {Promise<void>}
 */
exports.checkValidity = async (req, res) => {
  try {
    const { id } = req.params;
    const member = await Member.findById(id);
    if (!member) {
      return res.status(404).json({ error: "Member not found." });
    }

    const now = new Date();
    const isValid = member.validUntil >= now;

    return res.status(200).json({ valid: isValid });
  } catch (error) {
    console.error("checkValidity error:", error);
    return res.status(500).json({ error: "Failed to check validity." });
  }
};

/**
 * Redeems points for a member.
 * Expects req.params.id and req.body: { points }
 * @param {Object} req Express request
 * @param {Object} res Express response
 * @returns {Promise<void>}
 */
exports.redeemPoints = async (req, res) => {
  try {
    const { id } = req.params;
    const { points = 0 } = req.body;

    // Validate points
    if (typeof points !== "number" || points <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Points must be a positive number." });
    }

    const member = await Member.findById(id);
    if (!member) {
      return res
        .status(404)
        .json({ success: false, message: "Member not found." });
    }

    // Check membership validity
    const now = new Date();
    if (member.validUntil < now) {
      return res
        .status(400)
        .json({ success: false, message: "Membership expired." });
    }

    // Check if enough points
    if (member.points < points) {
      return res
        .status(400)
        .json({ success: false, message: "Insufficient points." });
    }

    // Default minimal redeem points: 10
    const MIN_REDEEM_POINTS = 10;
    if (points < MIN_REDEEM_POINTS) {
      return res.status(400).json({
        success: false,
        message: `Minimum redeem points is ${MIN_REDEEM_POINTS}.`,
      });
    }

    // Redeem points
    member.points -= points;
    await member.save();

    return res
      .status(200)
      .json({ success: true, message: "Points redeemed successfully." });
  } catch (error) {
    console.error("redeemPoints error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to redeem points." });
  }
};
