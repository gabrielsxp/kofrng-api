const BestSummon = require('../Model/BestSummon');
const SummonController = require('../Controller/SummonController');

module.exports = {
    async saveBestSummon() {
        try {
            await BestSummon.deleteMany();
            const bestSummon = await SummonController.luckiestSummon();
            await BestSummon.create({ summon: bestSummon._id });
        } catch(error){
            throw new Error('Unable to create best summon');
        }
    },
    async getBestSummon(_, res){
        try {
            const summons = await BestSummon.find({});
            const {summon} = await summons[0].populate('summon').execPopulate();
            const bestSummon = await summon.populate('fighters').execPopulate();
            return res.status(200).send({summon: bestSummon});
        } catch(error){
            console.log(error);
            return res.status(500).send({error: 'No pulls were made today'});
        }
    }
}