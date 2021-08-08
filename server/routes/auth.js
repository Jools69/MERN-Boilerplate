// Import Express.
const express = require('express');

// Import validation middleware
const { userSignupValidator, userSigninValidator } = require('../validators/auth');
const { runValidation } = require('../validators');

// Import the auth route controllers
const { signup, activate, signin } = require('../controllers/auth');

// Create an instance of the Express router.
const router = express.Router();

// Add an end point to handle /<root>/signup requests.
router.post('/signup', userSignupValidator, runValidation, signup);

router.post('/auth/activate/', activate);

router.post('/signin', userSigninValidator, runValidation, signin);

module.exports = router;