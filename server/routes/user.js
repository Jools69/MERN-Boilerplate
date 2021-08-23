// Import Express.
const express = require('express');

// Import the auth route controllers
const { getUser } = require('../controllers/user');
const { authenticate, adminOnly } = require ('../controllers/auth');

// Create an instance of the Express router.
const router = express.Router();

// Add an end point to handle /<root>/user requests.
router.get('/user/:id', authenticate, getUser);

module.exports = router;