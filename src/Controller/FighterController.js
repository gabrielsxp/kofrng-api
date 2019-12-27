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
    async index(req, res) {
        try {
            const fighters = await Fighter.find({});
            return res.status(200).send({ fighters });
        } catch (error) {
            return res.status(500).send({ error: 'Unable to retrieve data' });
        }

    },
    async filterByYear(req, res) {
        const validYears = ['94', '95', '96',
            '97', '98', '99', '00', '01', '02', '03',
            'XI', 'XII', 'XIII', 'XIV', 'Halloween', 'AS',
            'Christmas', 'NewYear', 'Collab', 'Tekken', 'SamuraiShodow',
            'Gintama', 'Valentine', 'Sakura', 'Epic', 'Pretty', 'Alice',
            'Swimwear', 'Others'];

        const year = req.query.year;
        if (!validYears.includes(year)) {
            return res.send({ error: 'Invalid Year' });
        }
        try {
            let fighters = [];
            fighters = await Fighter.find({ year });
            return res.status(200).send({ fighters });
        } catch (error) {
            return res.status(500).send({ error: 'Internal Error' });
        }
    },
    async filterByColor(req, res) {
        const validFields = ['red', 'blue', 'purple', 'yellow', 'green'];
        const color = req.query.color;
        const valid = validFields.includes(color);

        if (!valid) {
            return res.status(400).send({ error: 'Invalid Color' });
        }
        try {
            const fighters = await Fighter.find({ color });
            return res.status(200).send({ fighters });
        } catch (error) {
            return res.status(500).send({ error: error.errmsg, code: error.code });
        }
    },
    async filterByType(req, res) {
        const validFields = ['attack', 'defense', 'tech'];
        const type = req.query.type;
        const valid = validFields.includes(type);

        if (!valid) {
            return res.status(400).send({ error: 'Invalid Type' });
        }
        try {
            const fighters = await Fighter.find({ color });
            return res.status(200).send({ fighters });
        } catch (error) {
            return res.status(500).send({ error: error.errmsg, code: error.code });
        }
    }
}