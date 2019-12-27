const mongoose = require('mongoose');

const FighterSchema = mongoose.Schema({
    name: {type: String, required: true},
    nickname: {type: String, required: true, unique: true},
    year: {type: String, required: true},
    image: {type: String, required: true},
    rarity: {type: String, required: true},
    color: {type: String, required: true},
    type: {type: String, required: true}
});

module.exports = mongoose.model('Fighter', FighterSchema);