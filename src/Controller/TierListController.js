const TierList = require('../Model/TierList');
const moment = require('moment');

module.exports = {
    async createTierList(req, res) {
        console.log(req.body);
        const validFields = ['lists', 'belongsTo'];
        const fields = Object.keys(req.body);
        const valid = fields.every(field => validFields.includes(field));

        if (!valid) {
            return res.status(400).send({ error: 'Invalid Fields' });
        }

        try {
            const tierList = await TierList.create({ ...req.body });
            if (!tierList) {
                return res.status(400).send({ error: 'Unable to create this tier list' });
            }
            return res.status(201).send({ tierList });
        } catch (error) {
            console.log(error);
            return res.status(500).send({ error: 'Unable to create this tier list right now' });
        }
    },
    async getTierList(req, res) {
        try {
            const tierList = await TierList.findById(req.params.id);
            if (!tierList) {
                return res.status(404).send({ error: 'Unable to find this tier list' });
            }
            await tierList.populate('belongsTo').execPopulate({});
            for (let i in tierList.lists) {
                await tierList.populate(`lists.${i}.fighters`).execPopulate({});
            }
            return res.status(200).send({ tierList });
        } catch (error) {
            console.log(error);
            return res.status(500).send({ error: 'Unable to get this tier list right now' });
        }
    },
    async getListOfTierLists(req, res) {
        try {
            const start = moment(new Date).startOf('day');
            const end = moment(new Date).endOf('day');
            let tierLists = null;
            console.log(req.query);
            if(req.query.user){
                console.log('here');
                tierLists = await TierList.find({ belongsTo: req.query.user, createdAt: { $gte: start, $lt: end } }).sort('-createdAt'); 
            } else {
                tierLists = await TierList.find({ createdAt: { $gte: start, $lt: end } }).sort('-createdAt').limit(10);
            }
            if (!tierLists) {
                return res.status(404).send({ error: 'Unable to find these tier lists' });
            }
            let returnLists = [];
            for (let i in tierLists) {
                await tierLists[i].populate('belongsTo').execPopulate({});
                for (let j in tierLists[i].lists){
                    await tierLists[i].populate(`lists.${j}.fighters`).execPopulate({});
                }
                let fighters = [];
                fighters = tierLists[i].lists.reduce((f, l) => {
                    f = f.concat(l.fighters);
                    return f;
                }, []).slice(0, 10);
                let returnObject = {
                    _id: tierLists[i]._id,
                    belongsTo: tierLists[i].belongsTo,
                    createdAt: tireLists[i].createdAt,
                    fighters
                };
                returnLists = returnLists.concat(returnObject);
            }
            return res.status(200).send({ tierLists: returnLists });
        } catch (error) {
            console.log(error);
            return res.status(500).send({ error: 'Unable to get this tier list right now' });
        }
    },
    async updateTierList(req, res) {
        const validUpdates = ['lists'];
        const fields = Object.keys(req.body);
        const valid = fields.every(field => field.includes(validUpdates));

        if (!valid) {
            return res.status(400).send({ error: 'Invalid Fields' });
        }

        try {
            const tierList = await TierList.findById(req.params.id);
            if (!tierList) {
                return res.status(400).send({ error: 'Unable to find this tier list' });
            }
            if (tierList.belongsTo !== req.user._id) {
                return res.status(403).send({ error: 'You cannot update a tier list that not belongs to you' });
            }

            fields.forEach(field => tierList[field] = req.body[field]);
            tierList.save();

            return res.status(200).send({ tierList });
        } catch (error) {
            return res.status(500).send({ error: 'Unable to create this tier list right now' });
        }
    },
    async deleteTierList(req, res) {
        try {
            const tierList = await TierList.fidnById(req.params.id);
            if (!tierList) {
                return res.status(400).send({ error: 'Unable to find this tier list' });
            }
            if (tierList.belongsTo !== req.user._id) {
                return res.status(500).send({ error: 'You cannot delete a tier list that not belongs to you' });
            }
            await TierList.deleteOne({ _id: req.params.id });
            return res.status(200).send({ success: true });
        } catch (error) {
            return res.status(500).send({ error: 'Unable to delete this tier list right now' });
        }
    }
}