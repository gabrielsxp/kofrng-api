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
async function calculateSummonScore(fighters) {
    let score = 0;
    for (let i = 0; i < fighters.length; i++) {
        score += getFighterScore(fighters[i]);
    }
    return score;
}

/**
 * Retorna todas as invocações depois de preencher os 
 * lutadores
 */
async function getAllSummonsFilled() {
    const allSummons = await Summon.find({});
    for (let i in allSummons) {
        await allSummons[i].populate('fighters').execPopulate();
    }
    return allSummons;
}


/**
 * Retorna todas as invocações de hoje depois de 
 * preencher os lutadores e o banner
 */
async function getAllSummonsOfTodayFilledWithFighters() {
    const start = moment(new Date()).startOf('day');
    const end = moment(new Date()).endOf('day');

    const allSummons = await Summon.find({createdAt: {$gte: start, $lt: end}});
    for (let i in allSummons) {
        await allSummons[i].populate('fighters').execPopulate();
    }

    return allSummons;
}

/**
 * Retorna todas as invocações de hoje depois de 
 * preencher os lutadores e o banner
 */
async function getAllSummonsOfYesterdayFilledWithFighters() {
    const start = moment(new Date()).subtract(1, 'day').startOf('day');
    const end = moment(new Date()).subtract(1, 'day').endOf('day');

    const allSummons = await Summon.find({createdAt: {$gte: start, $lt: end}});
    for (let i in allSummons) {
        await allSummons[i].populate('fighters').execPopulate();
    }

    return allSummons;
}

/**
 * Retorna todas as invocações de hoje depois de 
 * preencher os lutadores e o banner
 */
async function getAllSummonsOfWeekFilledWithFighters() {
    const start = moment(new Date()).subtract(7, 'day').startOf('day');
    const end = moment(new Date()).endOf('day');

    const allSummons = await Summon.find({createdAt: {$gte: start, $lt: end}});
    for (let i in allSummons) {
        await allSummons[i].populate('fighters').execPopulate();
    }

    return allSummons;
}

/**
 * Retorna todas as invocações de hoje depois de 
 * preencher os lutadores e o banner
 */
async function getAllSummonsOfMonthFilledWithFighters() {
    const start = moment(new Date()).subtract(7, 'day').startOf('day');
    const end = moment(new Date()).endOf('day');

    const allSummons = await Summon.find({createdAt: {$gte: start, $lt: end}});
    for (let i in allSummons) {
        await allSummons[i].populate('fighters').execPopulate();
    }

    return allSummons;
}

/**
 * Retorna todas as invocações de hoje depois de 
 * preencher os lutadores e o banner
 */
async function getAllSummonsOf3MonthsFilledWithFighters() {
    const start = moment(new Date()).subtract(7, 'day').startOf('day');
    const end = moment(new Date()).endOf('day');

    const allSummons = await Summon.find({createdAt: {$gte: start, $lt: end}});
    for (let i in allSummons) {
        await allSummons[i].populate('fighters').execPopulate();
    }

    return allSummons;
}

/**
 * Retorna todas as invocações de hoje depois de 
 * preencher os lutadores e o banner
 */
async function getAllSummonsOfTodayFilled() {
    const start = moment(new Date()).startOf('day');
    const end = moment(new Date()).endOf('day');

    const allSummons = await Summon.find({createdAt: {$gte: start, $lt: end}});
    for (let i in allSummons) {
        await allSummons[i].populate('fighters').execPopulate();
        await allSummons[i].populate('belongsTo').execPopulate();
    }

    return allSummons;
}

/**
 * Retorna todas as invocações de ontem depois de 
 * preencher os lutadores e o banner
 */
async function getAllSummonsOfYesterdayFilled() {
    let yesterday = moment(new Date()).subtract(1, 'day');
    const start = moment(yesterday).startOf('day');
    const end = moment(yesterday).endOf('day');

    const allSummons = await Summon.find({createdAt: {$gte: start, $lt: end}});
    for (let i in allSummons) {
        await allSummons[i].populate('fighters').execPopulate();
        await allSummons[i].populate('belongsTo').execPopulate();
    }

    return allSummons;
}

/**
 * Retorna todas as invocações da semana depois de 
 * preencher os lutadores e o banner
 */
async function getAllSummonsOfWeekFilled() {
    const week = moment(new Date()).subtract(7, 'days');

    const start = week.startOf('day');
    const end = moment(new Date()).endOf('day');

    const allSummons = await Summon.find({createdAt: {$gte: start, $lt: end}});
    for (let i in allSummons) {
        await allSummons[i].populate('fighters').execPopulate();
        await allSummons[i].populate('belongsTo').execPopulate();
    }

    return allSummons;
}

/**
 * Retorna todas as invocações dos ultimos 30 dias depois de 
 * preencher os lutadores e o banner
 */
async function getAllSummonsOfMonthFilled() {
    const month = moment(new Date()).subtract(30, 'days');

    const start = month.startOf('day');
    const end = moment(new Date()).endOf('day');

    const allSummons = await Summon.find({createdAt: {$gte: start, $lt: end}});
    for (let i in allSummons) {
        await allSummons[i].populate('fighters').execPopulate();
        await allSummons[i].populate('belongsTo').execPopulate();
    }

    return allSummons;
}



module.exports = {
    async makeMultiSummon(req, res) {
        try {
            let bannerId = req.params.bannerId;
            let fighters = await RNGController.multi(bannerId);
            let score = await calculateSummonScore(fighters);

            await Summon.create({
                madeBy: req.user ? req.user._id : null,
                type: 'multi',
                belongsTo: bannerId,
                score,
                fighters
            });

            return res.status(200).send({ fighters });
        } catch (error) {
            return res.status(500).send({ error: 'Unable to make a summon' });
        }
    },
    async makeSingleSummon(req, res) {
        try {
            let bannerId = req.params.bannerId;
            let fighters = await RNGController.single(bannerId);
            let score = await calculateSummonScore(fighters);

            await Summon.create({
                madeBy: req.user._id,
                type: 'single',
                belongsTo: bannerId,
                score,
                fighters
            });

            return res.status(200).send({ fighters });
        } catch (error) {
            return res.status(500).send({ error: 'Unable to make a summon' });
        }
    },
    async luckiestSummon() {
        try {
            let start = moment(new Date()).startOf('day');
            let end = moment(new Date()).endOf('day');

            let summons = await Summon.
                find({ createdAt: { $gte: start, $lt: end } }).
                sort('-score').
                populate('fighters');

            let summon = summons[0];

            return summon;
        } catch (error) {
            throw new Error({ error: 'Unable to get the luckiest pull of today' });
        }
    },
    async totalRubies() {
        try {
            let allSummons = await  getAllSummonsFilled();
            let rubies = allSummons.reduce((total, summon) => {
                if (summon.fighters.length === 10) {
                    total += summon.belongsTo.multiCost;
                } else {
                    total += summon.belongsTo.singleCost;
                }
                return total;
            }, 0);
            return rubies;
        } catch (error) {
            throw new Error(error);
        }
    },
    async totalRubiesToday() {
        try {
            let allSummons = await getAllSummonsOfTodayFilled();
            let rubies = allSummons.reduce((total, summon) => {
                if (summon.fighters.length === 10) {
                    total += summon.belongsTo.multiCost;
                } else {
                    total += summon.belongsTo.singleCost;
                }
                return total;
            }, 0);
            return rubies;
        } catch (error) {
            throw new Error(error);
        }
    },
    async totalRubiesYesterday() {
        try {
            let allSummons = await getAllSummonsOfYesterdayFilled();
            let rubies = allSummons.reduce((total, summon) => {
                if (summon.fighters.length === 10) {
                    total += summon.belongsTo.multiCost;
                } else {
                    total += summon.belongsTo.singleCost;
                }
                return total;
            }, 0);
            return rubies;
        } catch (error) {
            throw new Error(error);
        }
    },
    async totalRubiesWeek(){
        try {
            let allSummons = await getAllSummonsOfWeekFilled();
            let rubies = allSummons.reduce((total, summon) => {
                if (summon.fighters.length === 10) {
                    total += summon.belongsTo.multiCost;
                } else {
                    total += summon.belongsTo.singleCost;
                }
                return total;
            }, 0);
            return rubies;
        } catch (error) {
            throw new Error(error);
        }
    },
    async totalRubiesMonth(){
        try {
            let allSummons = await getAllSummonsOfMonthFilled();
            let rubies = allSummons.reduce((total, summon) => {
                if (summon.fighters.length === 10) {
                    total += summon.belongsTo.multiCost;
                } else {
                    total += summon.belongsTo.singleCost;
                }
                return total;
            }, 0);
            return rubies;
        } catch (error) {
            throw new Error(error);
        }
    },
    async totalFightersOfTypeOfToday(type){
        //type deve ser Bronze, Silver ou Gold
        try {
            const allSummons = await getAllSummonsOfTodayFilledWithFighters();
            let bronzeCount = allSummons.reduce((total, summon) => {
                total += summon.fighters.reduce((t, s) => {
                    if(s.rarity === type){
                        t++;
                    }
                    return t;
                }, 0);
                return total;
            }, 0);
            return bronzeCount;
        } catch(error){
            throw new Error(error);
        }
    },
    async totalFightersOfTypeOfYesterday(type){
        //type deve ser Bronze, Silver ou Gold
        try {
            const allSummons = await getAllSummonsOfYesterdayFilledWithFighters();
            let bronzeCount = allSummons.reduce((total, summon) => {
                total += summon.fighters.reduce((t, s) => {
                    if(s.rarity === type){
                        t++;
                    }
                    return t;
                }, 0);
                return total;
            }, 0);
            return bronzeCount;
        } catch(error){
            throw new Error(error);
        }
    },
    async totalFightersOfTypeOfWeek(type){
        //type deve ser Bronze, Silver ou Gold
        try {
            const allSummons = await getAllSummonsOfWeekFilledWithFighters();
            let bronzeCount = allSummons.reduce((total, summon) => {
                total += summon.fighters.reduce((t, s) => {
                    if(s.rarity === type){
                        t++;
                    }
                    return t;
                }, 0);
                return total;
            }, 0);
            return bronzeCount;
        } catch(error){
            throw new Error(error);
        }
    },
    async totalFightersOfTypeOfMonth(type){
        //type deve ser Bronze, Silver ou Gold
        try {
            const allSummons = await getAllSummonsOfMonthFilledWithFighters();
            let bronzeCount = allSummons.reduce((total, summon) => {
                total += summon.fighters.reduce((t, s) => {
                    if(s.rarity === type){
                        t++;
                    }
                    return t;
                }, 0);
                return total;
            }, 0);
            return bronzeCount;
        } catch(error){
            throw new Error(error);
        }
    },
    async totalFightersOfTypeOf3Months(type){
        //type deve ser Bronze, Silver ou Gold
        try {
            const allSummons = await getAllSummonsOf3MonthsFilledWithFighters();
            let bronzeCount = allSummons.reduce((total, summon) => {
                total += summon.fighters.reduce((t, s) => {
                    if(s.rarity === type){
                        t++;
                    }
                    return t;
                }, 0);
                return total;
            }, 0);
            return bronzeCount;
        } catch(error){
            throw new Error(error);
        }
    },
    async totalSpecialFightersOfToday(type){
        //type deve ser fes ou as
        try {
            const allSummons = await getAllSummonsOfTodayFilledWithFighters();
            let bronzeCount = allSummons.reduce((total, summon) => {
                total += summon.fighters.reduce((t, s) => {
                    if(type === 'fes'){
                        if(s.isFes){
                            t++;
                        }
                    }
                    if(type === 'as'){
                        if(s.isAS){
                            t++;
                        }
                    }
                    return t;
                }, 0);
                return total;
            }, 0);
            return bronzeCount;
        } catch(error){
            throw new Error(error);
        }
    },
    async totalSpecialFightersOfYesterday(type){
        //type deve ser fes ou as
        try {
            const allSummons = await getAllSummonsOfYesterdayFilledWithFighters();
            let bronzeCount = allSummons.reduce((total, summon) => {
                total += summon.fighters.reduce((t, s) => {
                    if(type === 'fes'){
                        if(s.isFes){
                            t++;
                        }
                    }
                    if(type === 'as'){
                        if(s.isAS){
                            t++;
                        }
                    }
                    return t;
                }, 0);
                return total;
            }, 0);
            return bronzeCount;
        } catch(error){
            throw new Error(error);
        }
    },
    async totalSpecialFightersOfWeek(type){
        //type deve ser fes ou as
        try {
            const allSummons = await getAllSummonsOfWeekFilledWithFighters();
            let bronzeCount = allSummons.reduce((total, summon) => {
                total += summon.fighters.reduce((t, s) => {
                    if(type === 'fes'){
                        if(s.isFes){
                            t++;
                        }
                    }
                    if(type === 'as'){
                        if(s.isAS){
                            t++;
                        }
                    }
                    return t;
                }, 0);
                return total;
            }, 0);
            return bronzeCount;
        } catch(error){
            throw new Error(error);
        }
    },
    async totalSpecialFightersOfMonth(type){
        //type deve ser fes ou as
        try {
            const allSummons = await getAllSummonsOfMonthFilledWithFighters();
            let bronzeCount = allSummons.reduce((total, summon) => {
                total += summon.fighters.reduce((t, s) => {
                    if(type === 'fes'){
                        if(s.isFes){
                            t++;
                        }
                    }
                    if(type === 'as'){
                        if(s.isAS){
                            t++;
                        }
                    }
                    return t;
                }, 0);
                return total;
            }, 0);
            return bronzeCount;
        } catch(error){
            throw new Error(error);
        }
    },
    async totalSpecialFightersOf3Months(type){
        //type deve ser fes ou as
        try {
            const allSummons = await getAllSummonsOf3MonthsFilledWithFighters();
            let bronzeCount = allSummons.reduce((total, summon) => {
                total += summon.fighters.reduce((t, s) => {
                    if(type === 'fes'){
                        if(s.isFes){
                            t++;
                        }
                    }
                    if(type === 'as'){
                        if(s.isAS){
                            t++;
                        }
                    }
                    return t;
                }, 0);
                return total;
            }, 0);
            return bronzeCount;
        } catch(error){
            throw new Error(error);
        }
    }
}