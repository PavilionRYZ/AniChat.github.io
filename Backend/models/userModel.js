const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    avatar:{
        type: String,
        default: 'https://iconarchive.com/download/i107673/Flat-User-Interface/User-Avatar-2.ico'
    },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);