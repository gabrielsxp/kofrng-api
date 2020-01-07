const mongoose = require('mongoose');

const SummonSchema = mongoose.Schema({
    madeBy: {type: mongoose.Types.ObjectId, ref: 'User'},
    belongsTo: {type: mongoose.Types.ObjectId, ref: 'Banner'},
    score: Number,
    fighters: [{type: mongoose.Types.ObjectId, ref: 'Fighter'}]
}, {timestamps: true});

module.exports = mongoose.model('Summon', SummonSchema);