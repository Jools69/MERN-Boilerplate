const Property = require('../models/property');
const Landlord = require('../models/landlord');

exports.create = async (req, res, next) => {
    // This is called from a POST request, so the property details will be in the
    // request body object.
    try {

        const { name,
            line1,
            line2,
            line3,
            city,
            postcode,
            currency,
            propertyType = 'Other Property Unfurnished',
            percentOwned = 100 } = req.body.property;
        // Create a new Property instance based on the request body
        const newProperty = new Property({
            name, line1, line2, line3, city, postcode, currency, propertyType
        });

        // Save this new instance to the DB
        await newProperty.save();

        // Now add the new Property to the landlord who is adding it
        // First get the landlord.
        const landlord = await Landlord.findOne({ userId: req.user.id });

        // Add the new property
        landlord.portfolio.push({ property: newProperty, percentOwned });

        await landlord.save();

        return res.json({
            message: 'Property added successfully',
            newProperty: landlord.portfolio[landlord.portfolio.length - 1]
        });
    }
    catch (err) {
        console.log(err.message);
        return res.status(500).json({
            error: err.message
        });
    }
}

exports.findById = async (req, res, next) => {
    try {
        const property = await Property.findById(req.params.id);
        if (property) {
            return res.json(property);
        }
        else {
            return res.status(404).json({
                error: 'Property not found.'
            });
        }
    }
    catch (err) {
        return res.status(500).json({
            error: err.message
        });
    }
}

exports.update = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = req.user;                  // Added by authController.authenticate()
        const { property } = req.body;

        const updatedProperty = await Property.findByIdAndUpdate(id, { ...property }, async (err, doc) => {
            if (err) {
                return res.status(500).json({
                    error: err.message
                })
            }
            // Find the updating landlord to update the percent owned
            const landlord = await Landlord.findOneAndUpdate({ userId: user.id }, 
                                                             { $set: { "portfolio.$[el].percentOwned": property.percentOwned } },
                                                             { 
                                                                 arrayFilters: [{ "el.property": id }],
                                                                 new: true
                                                             }
                                                             );
    
            return res.json({
                updatedProperty,
                message: `${property.name} property updated successfully`
            });
        });
    }
    catch (err) {
        return res.status(500).json({
            error: err.message
        });
    }
}

exports.delete = async (req, res, next) => {
    console.log(`Delete Property called with ID:${req.params.id}, by user id:${req.user.id}`);
    // ACTION DATABASE DELETION HERE
    // *** HOW SHOULD MULTI-OWNED PROPERTIES BE HANDLED?
    // IF LAST LANDLORD TO DELETE, PROPERTY SHOULD ALSO BE DELETED.
    try {
        // First, attempt to delete the provided property from the requesting landlord.
        const propertyId = req.params.id;
        const userId = req.user.id;

        const landlord = await Landlord.findOne({ userId: userId });

        if (landlord) {
            // First, get the id of the portfolio entry that needs to be deleted.
            const propertyToCheck = landlord.portfolio.find(p => {
                return p.id.toString() === propertyId;
            });

            // Delete the provided property from the landlord's portfolio array
            await Landlord.findByIdAndUpdate(landlord.id, { $pull: { portfolio: { _id: propertyId } } });

            // Find any other Landlords that "own" the property
            const otherLandlord = await Landlord.findOne({ 'portfolio.property': propertyToCheck.property });

            if (!otherLandlord) {
                // No other landlord owns this property, so it should be deleted from the Properties collection too.
                await Property.findByIdAndDelete(propertyToCheck.property);
            }

            return res.json({
                messaged: 'Property deleted successfully'
            });
        }
        else {
            return res.status(500).json({
                error: `Landlord with user Id ${userId} not found.`
            });
        }
    }
    catch (err) {
        return res.status(500).json({
            error: err.message
        });
    }
}