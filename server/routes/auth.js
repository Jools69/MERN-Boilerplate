// Import Express.
const express = require('express');
const csrf = require('csurf');

// Import validation middleware
const { userSignupValidator, userSigninValidator } = require('../validators/auth');
const { runValidation } = require('../validators');

// Import the auth route controllers
const { signup, activate, signin, isAdmin, deliverCsrfToken, updatePassword } = require('../controllers/auth');

// Create an instance of the Express router.
const router = express.Router();

// Set up csrf middleware.
const csrfProtection = csrf({
    cookie: {
        httpOnly: true
    }
});

// Add an end point to handle /<root>/signup requests.
router.post('/signup', userSignupValidator, runValidation, signup);

router.post('/auth/activate/', activate);

router.get('/protect', csrfProtection, deliverCsrfToken);

router.post('/signin', csrfProtection, userSigninValidator, runValidation, signin);

router.post('/isAdmin', isAdmin);

router.post('/changePassword', updatePassword);

module.exports = router;