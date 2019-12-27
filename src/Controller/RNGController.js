const Srand = require('jsrand');
const Fighter = require('../Model/Fighter');

const LOWER_BRONZE = 0;
const UPPER_BRONZE = 19;
const LOWER_SILVER = 20;
const UPPER_SILVER = 93;
const LOWER_GOLD = 94;
const UPPER_GOLD = 99;

function isBetween(n, lower, upper){
    return (n >= lower && n <= upper);
}

module.exports = {
    async single(req, res){
        let n = Srand.randInt(0, 100);
        console.log(n);
        if(isBetween(n, LOWER_BRONZE, UPPER_BRONZE)){
            await Fighter.find({rarity: 'Bronze'}, (err, fighters) => {
                if(err){
                    return res.status(400).send({error: 'Unable to retrieve the fighters array'});
                }
                const size = fighters.length;
                console.log(fighters);
                console.log(size);
                return res.status(200).send({fighter: fighters[Srand.randInt(0, size)]});
            })
        }
        return res.status(200).send({fighter: null});
    }
}
