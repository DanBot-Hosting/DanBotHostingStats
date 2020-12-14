const mongoose = require('mongoose');
const TagSchema = new mongoose.Schema({
    Guild: String,
    Command: String,
    Content: String,
});

module.exports = mongoose.model('tags', TagSchema);