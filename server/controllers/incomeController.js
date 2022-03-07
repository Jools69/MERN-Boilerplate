const Landlord = require('../models/landlord');
const { incomeOverview } = require('../utils/calc');

exports.update = async (req, res, next) => {
    try {
        const user = req.user;                  // Added by authController.authenticate()

        const { startDate, endDate } = req.body;

        const landlord = await Landlord.findOne({ userId: user.id});
        
        landlord.reportingRange.startDate = startDate;
        landlord.reportingRange.endDate = endDate;

        const updatedDoc = await landlord.save();

        return res.json({
            startDate: updatedDoc.reportingRange.startDate,
            endDate: updatedDoc.reportingRange.endDate,
            message: 'Reporting range updated successfully'
        });
    }
    catch (err) {
        return res.status(500).json({
            error: err.message
        });
    }
}

exports.getOverview = async (req, res, next) => {
    try {
        const user = req.user;                  // Added by authController.authenticate()
        
        // Get the requesting landlord details from the database.
        const landlord = await Landlord.findOne({ userId: user. id });

        // Pull out the current reporting date range.
        const { startDate, endDate } = landlord.reportingRange;

        // Pass the User ID, start date and end date into the helper function that creates
        // the income overview.
        const result = incomeOverview(user.id, startDate, endDate);

        return res.json({
            result,
            message: 'Overview updated'
        });
    }
    catch(err) {
        return res.status(500).json({
            error: err.message
        });        
    }
}