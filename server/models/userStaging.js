const mongoose = require('mongoose');
const crypto = require('crypto');

// UserStaging Schema
const userStagingSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        max: 32
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        lowercase: true
    },
    hashedPassword: {
        type: String,
        //required: true,
    },
    salt:  String,
    stagedAt: {
        type: Date,
        default: Date.now
    }
}, {timestamps: true});

// Schema virtual properties
userStagingSchema.virtual('password')
.set(function(password) {
    // this._password = password;
    this.salt = this.makeSalt();
    const hashedPassword = this.encryptPassword(password)
    this.hashedPassword = hashedPassword;
});

// Schema methods
userStagingSchema.methods = {
    encryptPassword: function(password) {
        if(!password)
            return '';
        try {
            const hash = crypto.createHmac('sha256', this.salt).update(password).digest('hex');
            return hash;
        } catch (err) {
            console.log(err);
            return '';
        }
    },
    makeSalt: function() {
        return Math.round(new Date().valueOf() * Math.random()) + '';
    },
};

module.exports = mongoose.model('UserStaging', userStagingSchema);