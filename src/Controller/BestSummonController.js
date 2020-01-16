const BestSummon = require('../Model/BestSummon');
const Summon = require('../Model/Summon');
const moment = require('moment');

module.exports = {
    async saveBestSummon() {
        try {
            let start = moment(new Date()).startOf('day');
            let end = moment(new Date()).endOf('day');

            let summons = await Summon.
                find({ createdAt: { $gte: start, $lt: end } })
                .sort('-score')
                .populate('fighters')
                .populate('belongsTo');
            summons = summons.filter(f => f.belongsTo.createdBy === 'admin');

            let bestSummon = summons[0];
            if (bestSummon) {
                await BestSummon.create({ summon: bestSummon._id });
            } else {
                let start = moment(new Date()).subtract(1, 'days').startOf('day');
                let end = moment(new Date()).subtract(1, 'days').endOf('day');

                let summons = await Summon.
                    find({ createdAt: { $gte: start, $lt: end } })
                    .sort('-score')
                    .populate('fighters')
                    .populate('belongsTo');
                summons = summons.filter(f => f.belongsTo.createdBy === 'admin');

                let bestSummon = summons[0];
                if (bestSummon) {
                    await BestSummon.deleteMany();
                    await BestSummon.create({ summon: bestSummon._id });
                } else {
                    await BestSummon.create({ summon: null });
                }
            }
        } catch (error) {
            console.log(error);
            throw new Error('Unable to create best summon');
        }
    },
    async getBestSummon(_, res) {
        try {
            const summons = await BestSummon.find({});
            if (summons[0].summon !== null) {
                const { summon } = await summons[0].populate('summon').execPopulate();
                const bestSummon = await summon.populate('fighters').execPopulate();
                const summonWithUser = await bestSummon.populate('madeBy').execPopulate();
                const summonWithBanner = await summonWithUser.populate('belongsTo').execPopulate();
                return res.status(200).send({ summon: summonWithBanner });
            } else {
                return res.status(200).send({ summon: null });
            }
        } catch (error) {
            return res.status(500).send({ error: 'Unable to get the best pull of today' });
        }
    }
}