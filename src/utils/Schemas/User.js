const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    // The Discord ID of the user
    userId: {
        type: String,
        required: true,
        unique: true
    },

    // The Console ID of the user for the panel
    consoleId: {
        type: String,
        required: true,
        unique: true
    },

    // The Email of the User (hashed)
    email: {
        type: String,
        required: true,
        unique: true
    },

    // The Username of the user
    username: {
        type: String,
        required: true,
        unique: true
    },

    // The Domains of the user
    domains: {
        type: Array,
        required: true
    },

    // The Date the user linked their account
    linkDate: {
        type: Date,
        required: true,
        default: Date.now
    },
})

module.exports = mongoose.model('User', UserSchema);