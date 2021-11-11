// This file contains common middleware that will
// be used across multiple routes.

const csrf = require('csurf');

// Set up csrf middleware.
exports.csrfProtection = csrf({
    cookie: {
        httpOnly: true
    }
});
