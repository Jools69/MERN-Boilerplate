const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
// const crypto = require('crypto');

const saltRounds = 12;

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
    password: {
        type: String,
        //required: true,
    },
    stagedAt: {
        type: Date,
        default: Date.now
    }
}, {timestamps: true});

// Schema middleware
// 
userStagingSchema.pre('save', async function (next){
    try {
        const hash = await bcrypt.hash(this.password, saltRounds)
        this.password = hash;
        return next();
    }
    catch (err) {
        console.log(err);
        return next(err);
    }    
});

module.exports = mongoose.model('UserStaging', userStagingSchema);