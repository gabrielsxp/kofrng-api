const mongoose = require('mongoose');

const BannerSchema = mongoose.Schema({
    name: {type: String, required: true},
    image: {type: String, required: true},
    cost: {type: Number, required: true},
    pool: {type: mongoose.Types.ObjectId, required: true}
});

module.exports = mongoose.model('Banner', BannerSchema);