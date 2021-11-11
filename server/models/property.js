const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const propertySchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        max: 32
    },
    line1: {
        type: String,
        required: true
    },
    line2: {
        type: String
    },
    line3: {
        type: String
    },
    city: {
        type: String,
        required: true
    },
    postcode: {
        type: String,
        required: true
    },
    currency: {
        code: {
            type: String,
            required: true,
            default: 'GBP',
            max: 3
        },
        symbol: {
            type: String,
            default: '£',
            required: true,
            max: 4
        }
    },
    propertyType: {
        type: String,
        enum: ['Rent a room','Furnished Holiday let', 'Other Property Furnished', 'Other Property Unfurnished', 'Other'],
        default: 'Other Property Unfurnished'
    }
});

module.exports = mongoose.model('Property', propertySchema);