const mongoose = require('mongoose');

const TierListSchema = mongoose.Schema({
    lists: [
        {fighters: [{type: mongoose.Types.ObjectId, ref: 'Fighter'}]}
    ],
    belongsTo: { type: mongoose.Types.ObjectId, ref: 'User', default: null }
}, {timestamps: true});

module.exports = mongoose.model('TierList', TierListSchema);