const mongoose = require('mongoose');
const Favourites = require('../Model/Favourites');

module.exports = {
    async createFavourite(userId) {
        try {
            const favourite = await Favourites.create({
                belongsTo: userId,
                summons: []
            });
            return favourite;
        } catch (error) {
            console.log(error);
            throw new Error('Unable to create a favourite');
        }
    },
    async insertSummon(req, res) {
        try {
            const favourites = await Favourites.findById(req.user.favourites);
            const response = await favourites.insertSummon(req.params.summonId);
            if (response) {
                return res.status(200).send({ success: true });
            } else {
                return res.status(400).send({ message: 'Summon already exists' });
            }
        } catch (error) {
            console.log(error);
            return res.status(500).send({ error });
        }
    },
    async getFavourites(req, res) {
        try {
            let favourites = await (await Favourites.findById(req.user.favourites).populate('summons')).execPopulate();
            if(favourites){
                console.log(favourites);
                for(let i in favourites.summons){
                    await favourites.summons[i].populate('fighters').execPopulate();
                    await favourites.summons[i].populate('belongsTo').execPopulate();
                    await favourites.summons[i].populate('madeBy').execPopulate();
                }
            }
            return res.status(200).send({ favourites });
        } catch(error){
            console.log(error);
            return res.status(500).send({ error });
        }
    },
    async removeSummon(req, res) {
        try {
            const favourites = await Favourites.findById(req.user.favourites);
            const summons = await favourites.removeSummon(req.params.summonId);
            if(!summons){
                return res.status(404).send({ error: 'This Summon does not exists' });
            }
            if (summons) {
                return res.status(200).send({ summons });
            }
        } catch (error) {
            console.log(error);
            return res.status(500).send({ error: 'Unable to save favourites' });
        }
    }
}