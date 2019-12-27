const mongoose = require('mongoose');

const PoolSchema = mongoose.Schema({
    name: { type: String, required: true, index: { unique: true } },
    file: { type: String },
    belongsTo: { type: mongoose.Types.ObjectId },
    createdBy: { type: String, required: true }
});

PoolSchema.pre('validate', function (next) {
    const pool = this;
    const name = pool.name;
    const nameComponents = name.split(' ');
    nameComponents.forEach((name, index, arr) => arr[index] = name.toLowerCase());
    let revampedName = nameComponents.join('_');
    revampedName = `${revampedName}.txt`;

    pool.file = revampedName;
    next();
});

module.exports = mongoose.model('Pool', PoolSchema);