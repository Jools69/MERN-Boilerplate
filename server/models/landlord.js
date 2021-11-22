const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const landlordSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    portfolio: [
        {
            property: {
                type: Schema.Types.ObjectId,
                ref: 'Property',
            },
            percentOwned: {
                type: Number,
                min: 1,
                max: 100,
                default: 100
            }
        }
    ]
});

module.exports = mongoose.model('Landlord', landlordSchema);