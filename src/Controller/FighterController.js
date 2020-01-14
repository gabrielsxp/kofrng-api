const Fighter = require('../Model/Fighter');
const fs = require('fs');
const path = require('path');

module.exports = {
    async createFighter(req, res) {
        const validFields = ['name', 'nickname', 'year', 'rarity', 'image', 'color', 'type', 'isFes', 'isAS'];
        const fields = Object.keys(req.body);
        const valid = validFields.every((field) => fields.includes(field));

        if (!valid) {
            return res.status(400).send({ error: 'Invalid Fields' });
        }
        try {
            await Fighter.create(req.body, (err, fighter) => {
                if (err) {
                    console.log(err);
                    return res.status(400).send({ error: 'Unable to create a Fighter' });
                }
                fs.writeFileSync(path.join(__dirname, '..', 'data',
                    `${fighter.rarity === 'Bronze' ? 'bronze.txt' :
                        fighter.rarity === 'Silver' ? 'silver.txt' :
                            fighter.rarity === 'Gold' ? 'gold.txt' : 'unknown.txt'}`),
                    `${fighter._id + "\n"}`, { 'flag': 'a' }, function (error) {
                        if (error) {
                            return res.status(400).send({ error: 'Unable to create a Fighter' });
                        }
                    });
                return res.status(201).send({ fighter });
            });

        } catch (error) {
            return res.status(500).send({ error: error.errmsg, code: error.code });
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
        const query = {...filters};
        try {
            const fighters = await Fighter.find({
                color: {$in: query.color ? query.color.split(',') : null},
                rarity: {$in: query.rarity ? query.rarity.split(',') : null},
                type: {$in: query.type ? query.type.split(',') : null}
            });
            return res.status(200).send({fighters});
        } catch(error){
            console.log(error);
            return res.status(500).send({error});
        }
    }   
}