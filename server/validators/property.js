const { check } = require('express-validator');

exports.propertyValidator = [
    check('name').not().isEmpty().withMessage('Name is required'),
    check('line1').not().isEmpty().withMessage('Address line 1 is required'),
    check('city').not().isEmpty().withMessage('City is required'),
    check('postcode').not().isEmpty().withMessage('Post code is required'),
    check('propertyType').not().isEmpty().withMessage('Property type is required'),
    check('percentOwned').not().isEmpty().withMessage('Percent owned is required'),
];

// required
// name, line1, city, post code, property type, percent