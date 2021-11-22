const { check } = require('express-validator');

exports.userSignupValidator = [
    check('name').not().isEmpty().withMessage('Name is required'),
    check('email').not().isEmpty().withMessage('Email is required').isEmail().withMessage('Email must be a valid email address'),
    check('password').not().isEmpty().withMessage('Password is required').isLength({min: 8}).withMessage('Password must be at least 8 characters long'),
];

exports.userSigninValidator = [
    check('email').not().isEmpty().withMessage('Email is required').isEmail().withMessage('Email must be a valid email address'),
    check('password').not().isEmpty().withMessage('Password is required').isLength({min: 8}).withMessage('Password must be at least 8 characters long')
];

exports.forgotPasswordValidator = [
    check('email').not().isEmpty().withMessage('Email is required').isEmail().withMessage('Email must be a valid email address'),
];

exports.changePasswordValidator = [
    check('password').not().isEmpty().withMessage('Password is required').isLength({min: 8}).withMessage('Password must be at least 8 characters long'),
];