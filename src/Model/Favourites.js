const mongoose = require('mongoose');

const FavouritesSchema = mongoose.Schema({
    summons: [{type: mongoose.Types.ObjectId, ref: 'Summon'}],
    belongsTo: {type: mongoose.Types.ObjectId, ref: 'User'}
});

FavouritesSchema.methods.insertSummon = async function(summonId){
    const favourites = this;
    if (favourites.summons.length === 0) {
        favourites.summons.push(summonId);
        await favourites.save();
        return true;
    }
    if(favourites.summons.length === 10){
        throw new Error('You cannot add more than 10 items');
    }
    let includes = favourites.summons.includes(summonId.toString());
    if(!includes){
        favourites.summons.push(summonId);
        await favourites.save();
        return favourites.summons;
    } else {
        return false;
    }
}

FavouritesSchema.methods.removeSummon = async function(summonId){
    const favourites = this;
    const index = favourites.summons.findIndex(s => s.toString() === summonId.toString());
    console.log(index);
    if(index === -1){
        return false;
    } else {
        favourites.summons.splice(index, 1);
        await favourites.save();
        return favourites.summons;
    }
}

module.exports = mongoose.model('Favourites', FavouritesSchema);