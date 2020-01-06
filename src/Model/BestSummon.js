const mongoose = require('mongoose');

const BestSummonSchema = mongoose.Schema({
    summon: {type: mongoose.Types.ObjectId, ref: 'Summon'}
});

module.exports = mongoose.model('BestSummon', BestSummonSchema);