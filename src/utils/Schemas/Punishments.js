const mongoose = require('mongoose');

const PunishmentsSchema = new mongoose.Schema({

    // The Discord ID of the user
    userId: {
        type: String,
        required: true,
        unique: true
    },

    // The logs of mutes they have
    mutes: {
        type: Array,
        required: true,
        default: []
    },

    // The logs of bans they have
    bans: {
        type: Array,
        required: true,
        default: []
    },

    // The logs of kicks they have
    kicks: {
        type: Array,
        required: true,
        default: []
    }
});

module.exports = mongoose.model('Punishments', PunishmentsSchema);