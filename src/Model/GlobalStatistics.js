const mongoose = require('mongoose');

const GlobalStatisticsSchema = mongoose.Schema({
    totalRubies: Number,
    totalBronze: Number,
    totalSilver: Number,
    totalGold: Number,
    totalFes: Number,
    totalAS: Number,
    totalRubiesToday: Number,
    totalRubiesYesterday: Number,
    totalRubiesLastWeek: Number,
    totalRubiesLastMonth: Number,
    totalBronzeToday: Number,
    totalBronzeYesterday: Number,
    totalBronzeLastWeek: Number,
    totalBronzeLastMonth: Number,
    totalSilverToday: Number,
    totalSilverYesterday: Number,
    totalSilverLastWeek: Number,
    totalSilverLastMonth: Number,
    totalGoldToday: Number,
    totalGoldYesterday: Number,
    totalGoldLastWeek: Number,
    totalGoldLastMonth: Number,
    totalFesToday: Number,
    totalFesYesterday: Number,
    totalFesLastWeek: Number,
    totalFesLastMonth: Number,
    totalASToday: Number,
    totalASYesterday: Number,
    totalASLastWeek: Number,
    totalASLastMonth: Number,
    belongsTo: {type: mongoose.Types.ObjectId, ref: 'User'}
});

module.exports = mongoose.model('GlobalStatistics',  GlobalStatisticsSchema);