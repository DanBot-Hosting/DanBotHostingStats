const mongoose = require('mongoose');

const PremiumSchema = new mongoose.Schema({

    // The Discord ID of the user
    userId: {
        type: String,
        required: true,
        unique: true
    },

    // The Amount of premium servers they can make
    premiumCount: {
        type: Number,
        required: true,
        default: 0
    },

    // The Amount of premium servers they have used
    premiumUsed: {
        type: Number,
        required: true,
        default: 0
    },
});

module.exports = mongoose.model('Premium', PremiumSchema);