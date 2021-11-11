// Import Express.
const express = require('express');

// Import the auth route controllers
const { getUser } = require('../controllers/usersController');
const { authenticate, adminOnly } = require ('../controllers/authController');

// Create an instance of the Express router.
const router = express.Router();

// Add an end point to handle /<root>/user requests. Note should be 'used' with base of /users in calling module.
router.get('/:id', authenticate, getUser);

module.exports = router;