const User = require('../models/user');
const jwt = require('jsonwebtoken');

exports.getUser = async (req, res) => {
    // Extract the requested user ID from the request params
    const userId = req.params.id;

    // Look for the user in the database
    try {
        const user = await User.findById(userId).select("-hashedPassword -salt");
        if(!user) {
            return res.status(404).json({
                error: 'User not found'
            });
        }

        if (req.user.id.toString() === user._id.toString()) {
            return res.json({
                user
            });
        }
        return res.status(403).json({
            error: 'User not authorised for this request.'
        });
    }
    catch(err) {
        return res.status(400).json({
            error: err.message
        });
    }
}