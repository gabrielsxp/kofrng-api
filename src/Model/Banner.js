const mongoose = require('mongoose');

const BannerSchema = mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, index: { unique: true } },
    image: { type: String, required: true },
    singleCost: { type: Number, required: true },
    multiCost: { type: Number, required: true },
    pool: { type: mongoose.Types.ObjectId, required: true },
    createdBy: { type: String, required: true },
    start: { type: Date },
    end: { type: Date },
    rates: { type: Array, default: [0, 19, 93, 99] },
    fesRates: { type: Array },
    asRates: { type: Array }
}, { timeStamps: true });

BannerSchema.pre('save', function (next) {
    const banner = this;
    banner.slug = banner.name.toLowerCase().trim().replace(' ', '_').replace('-', '_');
    next();
});

module.exports = mongoose.model('Banner', BannerSchema);