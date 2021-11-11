// Import Express.
const express = require('express');
const { csrfProtection } = require('../middleware');

// Import validation middleware
const { userSignupValidator, userSigninValidator, forgotPasswordValidator, changePasswordValidator } = require('../validators/auth');
const { runValidation } = require('../validators');

// Import the auth route controllers
const { signup, activate, signin, isAdmin, deliverCsrfToken, forgotPassword, updatePassword } = require('../controllers/authController');

// Create an instance of the Express router.
const router = express.Router();

// Add an end point to handle /<root>/signup requests.
router.post('/signup', userSignupValidator, runValidation, signup);

router.post('/auth/activate/', activate);

router.get('/protect', csrfProtection, deliverCsrfToken);

router.post('/signin', csrfProtection, userSigninValidator, runValidation, signin);

router.post('/isAdmin', isAdmin);

router.put('/changePassword', csrfProtection, changePasswordValidator, runValidation, updatePassword);

router.post('/forgotPassword', forgotPasswordValidator, runValidation, forgotPassword);

module.exports = router;