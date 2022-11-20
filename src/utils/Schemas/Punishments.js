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
        required: false,
        default: []
    },

    // The logs of bans they have
    bans: {
        type: Array,
        required: false,
        default: []
    },

    // The logs of kicks they have
    kicks: {
        type: Array,
        required: false,
        default: []
    },

    // The warns they have
    warnings: {
        type: Array,
        required: false,
        default: []
    },

    // If the user is Ticket Banned
    ticketBanned: {
        type: Boolean,
        required: false,
        default: false
    },

    // If the user is suggestion banned
    suggestionBanned: {
        type: Boolean,
        required: false,
        default: false
    }
});

module.exports = mongoose.model('Punishments', PunishmentsSchema);