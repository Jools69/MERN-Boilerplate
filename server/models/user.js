const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
// const crypto = require('crypto');

const saltRounds = 12;

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
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'subscriber'
    },
    resetPasswordLink: {
        type: String,
        default: ''
    }
}, { timestamps: true });

// Schema methods
userSchema.methods = {
    authenticate: async function (password) {
        return await bcrypt.compare(password, this.password);
    }
};

// Schema middleware
// 
userSchema.pre('save', async function (next) {
    if (!this.isNew && this.isModified('password')) {
        console.log('Password was changed');
        try {
            const hash = await bcrypt.hash(this.password, saltRounds)
            this.password = hash;
            return next();
        }
        catch (err) {
            console.log(err);
            return next(err);
        }
    }
    console.log('Password was NOT changed');
    return next();
});

module.exports = mongoose.model('User', userSchema);