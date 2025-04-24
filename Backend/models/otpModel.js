const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    otp: {
        type: String,
        required: true,
    },
    fullName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
    },
    expires: {
        type: Date,
        required: true,
    },
});
otpSchema.index({ expires: 1 }, { expireAfterSeconds: 0 });
module.exports = mongoose.model('Otp', otpSchema);