// Import Express.
const express = require('express');

// Import the income route controllers
const income = require('../controllers/incomeController');
const { authenticate } = require('../controllers/authController');
const { csrfProtection } = require('../middleware');
const { runValidation } = require('../validators');
// const { propertyValidator } = require('../validators/property');

// Create an instance of the Express router.
const router = express.Router();

// Routes

// Add end points to handle /<root>/income requests - note, route should
// be set up with '/income' root in calling module.
router.route('/dateRange')
    // Handle creation of a new Property
    // .post(csrfProtection, authenticate, properties.create);
    .put(csrfProtection, authenticate, income.update);

router.route('/overview')
    .get(authenticate, income.getOverview);

module.exports = router;