const mongoose = require('mongoose');

const FighterSchema = mongoose.Schema({
    name: {type: String, required: true, index: false},
    nickname: {type: String, required: true, unique: true},
    year: {type: String, required: true},
    image: {type: String, required: true},
    rarity: {type: String, required: true},
    color: {type: String, required: true},
    type: {type: String, required: true},
    isFes: {type: Boolean, required: true, default: false},
    isAS: {type: Boolean, required: true, default: false}
});

FighterSchema.methods.filterByColor = async function(color){
    const fighter = this;
    const fighters = await fighter.find({color});
    return fighters;
}

FighterSchema.methods.filterByType = async function(type){
    const fighter = this;
    const fighters = await fighter.find({type});
    return fighters;
}

FighterSchema.methods.filterByRarity = async function(rarity){
    const fighter = this;
    const fighters = await fighter.find({rarity});
    return fighters;
}

FighterSchema.methods.filterByYear = async function(year){
    const fighter = this;
    const fighters = await fighter.find({year});
    return fighters;
}

module.exports = mongoose.model('Fighter', FighterSchema);