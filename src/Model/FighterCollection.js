const mongoose = require('mongoose');

const FighterCollectionSchema = mongoose.Schema({
    fighters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Fighter' }],
    belongsTo: { type: mongoose.Schema.Types.ObjectId }
});

FighterCollectionSchema.methods.insertFighter = async function (fighter) {
    let collection = this;
    if (collection.fighters.length === 0) {
        collection.fighters.push(fighter);
        await collection.save();
        return;
    }
    let includes = collection.fighters.includes(fighter._id.toString());
    if(!includes){
        collection.fighters.push(fighter._id.toString());
    }
    await collection.save();
}

module.exports = mongoose.model('FighterCollection', FighterCollectionSchema);