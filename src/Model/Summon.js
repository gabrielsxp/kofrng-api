const mongoose = require('mongoose');

const SummonSchema = mongoose.Schema({
    madeBy: {type: mongoose.Types.ObjectId},
    belongsTo: {type: mongoose.Types.ObjectId},
    score: Number,
    fighters: [{type: mongoose.Types.ObjectId, ref: 'Fighter'}]
}, {timestamps: true});

SummonSchema.virtual('user', {
    ref: 'User',
    localField: 'belongsTo',
    foreignField: '_id'
});

SummonSchema.virtual('banner', {
    ref: 'Banner',
    localField: 'belongsTo',
    foreignField: '_id'
});

module.exports = mongoose.model('Summon', SummonSchema);