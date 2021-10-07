const User = require('../models/user');
const Landlord = require('../models/landlord');

exports.getUser = async (req, res) => {
    // Extract the requested user ID from the request params
    const userId = req.params.id;

    // Look for the user in the database
    try {
        const user = await User.findById(userId).select("-password");
        if(!user) {
            return res.status(404).json({
                error: 'User not found'
            });
        }

        if (req.user.id.toString() === user._id.toString()) {
            // Create simple data structure for testing
            // Properties collection
            // Current income for current tax year.
            
            // Retrieve the Landlord details for this User.
            const landlord = await Landlord.findOne({ userId });
            if(!landlord) {
                return res.status(404).json({
                    error: 'Cannot retrieve Landlord details'
                });
            }
            
            return res.json({
                user,
                landlord
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