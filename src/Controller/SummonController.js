const Summon = require('../Model/Summon');
const RNGController = require('./RNGController');
const moment = require('moment');

/**
 * Retorna a pontuação do lutador baseado na raridade
 * @param {Object} fighter 
 */
function getFighterScore(fighter) {
    switch (fighter.rarity) {
        case 'Bronze':
            return 1;
            break;
        case 'Silver':
            return 5;
            break;
        case 'Gold':
            if (fighter.isFes) {
                return 20;
            } else if (fighter.isAS) {
                return 15;
            } else {
                return 10;
            }
            break;
        default:
            return 0;
            break;
    }
}

/**
 * Calcula a pontuação total de todos os lutadores
 * @param {Array} fighters 
 */
function calculateSummonScore(fighters) {
    let score = 0;
    for (let i = 0; i < fighters.length; i++) {
        score += getFighterScore(fighters[i]);
    }
    return score;
}

module.exports = {
    async makeMultiSummon(req, res) {
        try {
            let bannerId = req.params.bannerId;
            let fighters = await RNGController.multi(bannerId);
            let score = calculateSummonScore(fighters);

            await Summon.create({
                madeBy: req.user ? req.user._id : null,
                type: 'multi',
                belongsTo: bannerId,
                score,
                fighters
            });

            return res.status(200).send({ fighters });
        } catch (error) {
            console.log(error);
            return res.status(500).send({ error: 'Unable to make a summon' });
        }
    },
    async makeSingleSummon(req, res) {
        try {
            let bannerId = req.params.bannerId;
            let fighters = await RNGController.single(bannerId);
            let score = calculateSummonScore(fighters);

            await Summon.create({
                madeBy: req.user._id,
                type: 'single',
                belongsTo: bannerId,
                score,
                fighters
            });

            return res.status(200).send({ fighters });
        } catch (error) {
            console.log(error);
            return res.status(500).send({ error: 'Unable to make a summon' });
        }
    },
    async luckiestSummon() {
        try {
            let start = moment(new Date()).startOf('day');
            let end = moment(new Date()).endOf('day');

            let summons = await Summon.
                find({createdAt: {$gte: start, $lt: end}}).
                sort('-score').
                populate('fighters');

            let summon = summons[0];

            return summon;
        } catch (error) {
            console.log(error);
            throw new Error({error: 'Unable to get the luckiest pull of today'});
        }
    }
}