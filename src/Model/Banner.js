const mongoose = require('mongoose');

const BannerSchema = mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, index: { unique: true } },
    image: { type: String, required: true },
    cost: { type: Number, required: true },
    pool: { type: mongoose.Types.ObjectId, required: true },
    createdBy: {type: String, required: true}
});

BannerSchema.pre('save', function(next) {
    const banner = this;
    banner.slug = banner.name.toLowerCase().trim().replace(' ','_').replace('-','_');
    next();
});

module.exports = mongoose.model('Banner', BannerSchema);