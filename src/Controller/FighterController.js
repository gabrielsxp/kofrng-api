const Fighter = require('../Model/Fighter');
const Banner = require('../Model/Banner');

module.exports = {
    async createFighter(req, res) {
        const validFields = ['name', 'nickname', 'year', 'rarity', 'image', 'color', 'type', 'isFes', 'isAS'];
        const fields = Object.keys(req.body);
        const valid = validFields.every((field) => fields.includes(field));

        if (!valid) {
            return res.status(400).send({ error: 'Invalid Fields' });
        }
        try {
            fighter = await Fighter.create(req.body);
            if (!fighter) {
                return res.status(400).send({ error: 'Unable to create this fighter' });
            }
            return res.status(201).send({ fighter });

        } catch (error) {
            return res.status(500).send({ error: error.errmsg, code: error.code });
        }
    },
    async batchFighters(req, res) {
        try {
            let f = [];
            const fighters = req.body.fighters;
            for (let i = 0; i < fighters.length; i++) {
                let fig = fighters[i];
                delete fig._id;
                delete fig.__v;
                const fighter = await Fighter.create(fig);
                f = f.concat(fighter);
            }
            return res.status(201).send({ fighters: f });
        } catch (error) {
            console.log(error);
            return res.status(500).send({ error: error.errmsg, code: error.code });
        }
    },
    async getFightersById(req, res){
        try {
            const banner = await Banner.findById(req.params.id);
            if(!banner){
                return res.status(404).send({error: 'This banner does not exists'});
            }
            const idsFes = banner.fesRates.map(rate => rate.fighter);
            const idsAS = banner.asRates.map(rate => rate.fighter);
            const fesFighters = await Fighter.find({_id: {$in: idsFes}});
            const asFighters = await Fighter.find({_id: {$in: idsAS}});

            return res.status(200).send({fighters: {fes: fesFighters, as: asFighters}});
        } catch(error){
            console.log(error);
            return res.status(500).send({error: 'Unable to get this fighters right now'});
        }
    },
    async index(_, res) {
        try {
            const fighters = await Fighter.find({}).sort('-isFes');
            return res.status(200).send({ fighters });
        } catch (error) {
            console.log(error);
            return res.status(500).send({ error: 'Unable to retrieve data' });
        }

    },
    async filter(req, res) {
        const filters = req.query;
        const query = { ...filters };
        try {
            const fighters = await Fighter.find({
                color: { $in: query.color ? query.color.split(',') : null },
                rarity: { $in: query.rarity ? query.rarity.split(',') : null },
                type: { $in: query.type ? query.type.split(',') : null }
            });
            return res.status(200).send({ fighters });
        } catch (error) {
            console.log(error);
            return res.status(500).send({ error });
        }
    }
}