/**
 * @fileoverview Express routes for Member operations in Tsuki Coffee backend.
 * Routes include: addMember, editMember, searchMember, getMembers, checkValidity, redeemPoints.
 * Uses memberController for all business logic.
 *
 * Usage:
 *   const memberRoutes = require('./routes/memberRoutes');
 *   app.use('/members', memberRoutes);
 */

const express = require('express');
const router = express.Router();

// Import memberController functions
const memberController = require('../controllers/memberController');

// Route: POST /members
// Description: Add a new member
router.post('/', memberController.addMember);

// Route: GET /members
// Description: Get list of members (with optional filter)
router.get('/', memberController.getMembers);

// Route: GET /members/search
// Description: Search members by name or phone
router.get('/search', memberController.searchMember);

// Route: PUT /members/:id
// Description: Edit member data
router.put('/:id', memberController.editMember);

// Route: GET /members/:id/validity
// Description: Check member validity
router.get('/:id/validity', memberController.checkValidity);

// Route: POST /members/:id/redeem
// Description: Redeem points for a member
router.post('/:id/redeem', memberController.redeemPoints);

module.exports = router;
