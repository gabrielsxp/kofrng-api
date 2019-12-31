const mongoose = require('mongoose');

const DefaultPoolSchema = mongoose.Schema({
    name: { type: String, required: true },
    fighters: [
        { type: mongoose.Types.ObjectId, ref: 'Fighter' }
    ],
    createdBy: { type: String, required: true }
});

module.exports = mongoose.model('DefaultPool', DefaultPoolSchema);