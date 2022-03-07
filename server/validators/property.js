const { check } = require('express-validator');

// required
// name, line1, city, post code, property type, percent
// optional - Must be sanitized at least.
// line2, line3

exports.propertyValidator = [
    check('property.name').not().isEmpty().withMessage('Name is required').trim().escape(),
    check('property.line1').not().isEmpty().withMessage('Address line 1 is required').trim().escape(),
    check('property.line2').optional().trim().escape(),
    check('property.line3').optional().trim().escape(),
    check('property.city').not().isEmpty().withMessage('City is required').trim().escape(),
    check('property.postcode').not().isEmpty().withMessage('Post code is required').trim().escape(),
    check('property.propertyType').not().isEmpty().withMessage('Property type is required').trim().escape(),
    check('property.percentOwned').not().isEmpty().withMessage('Percent owned is required').isInt({min: 1, max: 100}).withMessage('Percent Owned must be a number between 1 and 100').trim().escape(),
];