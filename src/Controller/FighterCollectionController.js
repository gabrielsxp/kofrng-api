const FighterCollection = require('../Model/FighterCollection');

module.exports = {
    async createCollection(userId) {
        try {
            const collection = await FighterCollection.create({
                fighters: [],
                belongsTo: userId
            });

            return collection;
        } catch (error) {
            console.log(error);
            throw new Error('Unable to create Collection');
        }
    },
    async getCollection(req, res) {
        try {
            const fighterCollection = await FighterCollection.findById(req.params.id);
            await fighterCollection.populate('fighters').execPopulate();
            return res.status(200).send({ fighterCollection });
        } catch (error) {
            return res.status(500).send({ error });
        }
    },
    async insertFighter(fighter, id) {
        try {
            const collection = await FighterCollection.findById(id);
            await collection.insertFighter(fighter);
        } catch (error) {
            console.log(error);
            throw new Error('Unable to insert fighter');
        }
    }
}