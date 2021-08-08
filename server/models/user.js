const mongoose = require('mongoose');
const crypto = require('crypto');

// User Schema
const userSchema = new mongoose.Schema({
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
    role: {
        type: String,
        default: 'subscriber'
    },
    resetPasswordLink: {
        data: String,
        default: ''
    }
}, {timestamps: true});

// Schema virtual properties
userSchema.virtual('password')
.set(function(password) {
    // this._password = password;
    this.salt = this.makeSalt();
    const hashedPassword = this.encryptPassword(password)
    this.hashedPassword = hashedPassword;
});
// .get(function() {
//     return this._password;
// })

// Schema methods
userSchema.methods = {
    authenticate: function(password) {
        return this.encryptPassword(password) === this.hashedPassword;
    },
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

// userSchema.pre('save', function(next) {
//     console.log('In Pre-Save');
//     return next(new Error('Ooof - F in the chat!'));
// });

module.exports = mongoose.model('User', userSchema);