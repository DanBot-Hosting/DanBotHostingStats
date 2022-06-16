const mongoose = require('mongoose');

const SuggestionsSchema = new mongoose.Schema({

    // The Suggestion ID
    suggestionId: {
        type: Number,
        required: true,
        unique: true
    },

    // The Discord ID of the user who made the suggestion
    userId: {
        type: String,
        required: true,
    },

    // the message ID of the suggestion
    messageId: {
        type: String,
        required: true,
    },

    // The amount of upvotes
    upvotes: {
        type: Number,
        required: true,
        default: 0
    },

    // The amount of downvotes
    downvotes: {
        type: Number,
        required: true,
        default: 0
    },

    // The People that have voted for the suggestion
    voted: {
        type: Array,
        required: true,
        default: []
    }
});

module.exports = mongoose.model('Suggestions', SuggestionsSchema);