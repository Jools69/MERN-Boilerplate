// Import Express.
const express = require('express');

// Import the auth route controllers
const properties = require('../controllers/propertyController');
const { authenticate } = require('../controllers/authController');
const { csrfProtection } = require('../middleware');
const { runValidation } = require('../validators');
const { propertyValidator } = require('../validators/property');

// Create an instance of the Express router.
const router = express.Router();

// Routes

// Add end points to handle /<root>/property requests - note, route should
// be set up with '/properties' root in calling module.
router.route('/')
    // Handle creation of a new Property
    // .post(csrfProtection, authenticate, properties.create);
    .post(csrfProtection, authenticate, propertyValidator, runValidation, properties.create);

// property-specific routes.
router.route('/:id')
    .get(authenticate, properties.findById)
    .put(csrfProtection, authenticate, propertyValidator, runValidation, properties.update)
    .delete(csrfProtection, authenticate, properties.delete);

module.exports = router;