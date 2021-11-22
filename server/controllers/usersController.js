const User = require('../models/user');
const Landlord = require('../models/landlord');
const ExpressError = require('../utils/ExpressError');

exports.getUser = async (req, res, next) => {
    // Extract the requested user ID from the request params
    const userId = req.params.id;

    // Look for the user in the database
    try {
        const user = await User.findById(userId).select("-password");
        if(!user) {
            return next(new ExpressError('User not found', 404));
            // return res.status(404).json({
            //     error: 'User not found'
            // });
        }

        // if (req.user.id.toString() === user._id.toString()) {
        if (user._id.equals(req.user.id)) {
            // Create simple data structure for testing
            // portfolio collection
            // Current income for current tax year.
            
            // Retrieve the Landlord details for this User.
            const landlord = await Landlord.findOne({ userId }).populate('portfolio.property');
            if(!landlord) {
                return next(new ExpressError('Cannot retrieve Landlord details', 404));
                // return res.status(404).json({
                //     error: 'Cannot retrieve Landlord details'
                // });
            }
            
            return res.json({
                user,
                landlord
            });
        }
        return next(new ExpressError('User not authorised for this request.', 403));
        // return res.status(403).json({
        //     error: 'User not authorised for this request.'
        // });
    }
    catch(err) {
        return next(new ExpressError(err.message, 400));
        // return res.status(400).json({
        //     error: err.message
        // });
    }
}