const BestSummon = require('../Model/BestSummon');
const Summon = require('../Model/Summon');
const moment = require('moment');

module.exports = {
    async saveBestSummon() {
        try {
            await BestSummon.deleteMany();
            let start = moment(new Date()).startOf('day');
            let end = moment(new Date()).endOf('day');

            let summons = await Summon.
                find({ createdAt: { $gte: start, $lt: end } })
                .sort('-score')
                .populate('fighters')
                .populate('belongsTo');
            summons = summons.filter(f => f.belongsTo.createdBy === 'admin');

            let bestSummon = summons[0];
            if(bestSummon){
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
                await BestSummon.create({ summon: bestSummon._id });
            }
        } catch (error) {
            console.log(error);
            throw new Error('Unable to create best summon');
        }
    },
    async getBestSummon(_, res) {
        try {
            const summons = await BestSummon.find({});
            const { summon } = await summons[0].populate('summon').execPopulate();
            const bestSummon = await summon.populate('fighters').execPopulate();
            const summonWithUser = await bestSummon.populate('madeBy').execPopulate();
            const summonWithBanner = await summonWithUser.populate('belongsTo').execPopulate();
            return res.status(200).send({ summon: summonWithBanner });
        } catch (error) {
            console.log(error);
            return res.status(500).send({ error: 'No pulls were made today' });
        }
    }
}