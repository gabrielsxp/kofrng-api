const Summon = require('../Model/Summon');
const RNGController = require('./RNGController');
const FighterCollectionController = require('./FighterCollectionController');
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
        await allSummons[i].populate('belongsTo').execPopulate();
    }
    return allSummons;
}

/**
 * Retorna a quantidade de rubis gasta por um determinado usuario por dia
 * durante um total de dias
 */
async function getRubiesSpentOnADayBeforeToday(day, user, banner) {
    let baseDay = moment(new Date()).subtract(day, 'days');
    let start = moment(new Date()).subtract(day, 'days').startOf('day');
    let end = moment(new Date()).subtract(day, 'days').endOf('day');
    let _day = baseDay.date() < 10 ? `0${baseDay.date()}` : baseDay.date();
    let month = baseDay.month() + 1;
    month = month < 10 ? `0${month}` : month;
    var key = `${_day}/${month}`;

    var baseQuery = { createdAt: { $gte: start, $lt: end } };
    if (user) {
        baseQuery = { ...baseQuery, madeBy: user };
    }

    try {
        const summons = await Summon.find(
            banner ? { ...baseQuery, belongsTo: banner } : { ...baseQuery }
        );
        for (let i in summons) {
            await summons[i].populate('fighters').execPopulate();
            await summons[i].populate('belongsTo').execPopulate();
        }
        let stats = summons.reduce((totalRubiesSpent, summon) => {
            if (summon.fighters.length === 10) {
                totalRubiesSpent += summon.belongsTo.multiCost;
            }
            if (summon.fighters.length === 1) {
                totalRubiesSpent += summon.belongsTo.singleCost;
            }
            return totalRubiesSpent;
        }, 0);
        let obj = { date: key, rubies: stats };

        return obj;
    } catch (error) {
        throw new Error(error);
    }
}


/**
 * Retorna a quantidade de rubis gasta por um determinadi usuario por dia
 * durante um total de dias
 */
async function getFightersCollectedOnADay(day, user, banner) {
    let baseDay = moment(new Date()).subtract(day, 'days');
    let start = moment(new Date()).subtract(day, 'days').startOf('day');
    let end = moment(new Date()).subtract(day, 'days').endOf('day');
    let _day = baseDay.date() < 10 ? `0${baseDay.date()}` : baseDay.date();
    let month = baseDay.month() + 1;
    month = month < 10 ? `0${month}` : month;
    var key = `${_day}/${month}`;

    var baseQuery = { createdAt: { $gte: start, $lt: end } };
    if (user) {
        baseQuery = { ...baseQuery, madeBy: user };
    }

    try {
        const summons = await Summon.find(
            banner ? { ...baseQuery, belongsTo: banner } : { ...baseQuery }
        );
        if (summons.length === 0) {
            return { date: key, bronze: 0, silver: 0, gold: 0, fes: 0, as: 0 };
        }
        for (let i in summons) {
            await summons[i].populate('fighters').execPopulate();
        }
        var obj = {};
        var bronze = 0;
        var silver = 0;
        var gold = 0;
        var fes = 0;
        var AS = 0;

        summons.forEach(summon => {
            bronze += summon.fighters.reduce((total, s) => {
                if (s.rarity === 'Bronze') {
                    total++;
                }
                return total;
            }, 0);
            silver += summon.fighters.reduce((total, s) => {
                if (s.rarity === 'Silver') {
                    total++;
                }
                return total;
            }, 0);
            gold += summon.fighters.reduce((total, s) => {
                if (s.rarity === 'Gold') {
                    total++;
                }
                return total;
            }, 0);
            fes += summon.fighters.reduce((total, s) => {
                if (s.isFes) {
                    total++;
                }
                return total;
            }, 0);
            AS += summon.fighters.reduce((total, s) => {
                if (s.isAS) {
                    total++;
                }
                return total;
            }, 0);
            obj = { date: key, bronze, silver, gold, fes, as: AS };
        });
        return obj;
    } catch (error) {
        throw new Error(error);
    }
}

/**
 * Retorna a quantidade de rubis gasta na última semana
 */
async function detailedRubiesSpentPerDate(date, user, banner) {
    let allSummons = [];
    for (let i = 0; i < date; i++) {
        let stats = await getRubiesSpentOnADayBeforeToday(i, user, banner);
        allSummons.push(stats);
    }
    return allSummons;
}

/**
 * Retorna a quantidade de lutadores coletados na última semana
 */
async function detailedFightersCollectedPerDate(date, user, banner) {
    let allSummons = [];
    for (let i = 0; i < date; i++) {
        let stats = await getFightersCollectedOnADay(i, user, banner);
        allSummons.push(stats);
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

    const allSummons = await Summon.find({ createdAt: { $gte: start, $lt: end } });
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

    const allSummons = await Summon.find({ createdAt: { $gte: start, $lt: end } });
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

    const allSummons = await Summon.find({ createdAt: { $gte: start, $lt: end } });
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

    const allSummons = await Summon.find({ createdAt: { $gte: start, $lt: end } });
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

    const allSummons = await Summon.find({ createdAt: { $gte: start, $lt: end } });
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

    const allSummons = await Summon.find({ createdAt: { $gte: start, $lt: end } });
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

    const allSummons = await Summon.find({ createdAt: { $gte: start, $lt: end } });
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

    const allSummons = await Summon.find({ createdAt: { $gte: start, $lt: end } });
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

    const allSummons = await Summon.find({ createdAt: { $gte: start, $lt: end } });
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

            const summon = await Summon.create({
                madeBy: req.user ? req.user._id : null,
                type: 'multi',
                belongsTo: bannerId,
                score,
                fighters
            });

            if (req.user) {
                for (let i = 0; i < fighters.length; i++) {
                    await FighterCollectionController.insertFighter(fighters[i], req.user.fighterCollection);
                }
            }

            return res.status(200).send({ fighters, summon: summon._id });
        } catch (error) {
            console.log(error);
            return res.status(500).send({ error: 'Unable to make a summon' });
        }
    },
    async makeSingleSummon(req, res) {
        try {
            let bannerId = req.params.bannerId;
            let fighters = await RNGController.single(bannerId);
            let score = await calculateSummonScore(fighters);

            const summon = await Summon.create({
                madeBy: req.user._id,
                type: 'single',
                belongsTo: bannerId,
                score,
                fighters
            });

            return res.status(200).send({ fighters, summon: summon._id });
        } catch (error) {
            return res.status(500).send({ error: 'Unable to make a summon' });
        }
    },
    async getTopSummons(req, res) {
        try {
            let start = moment(new Date()).startOf('day');
            let end = moment(new Date()).endOf('day');

            let summons = await Summon.
                find({ createdAt: { $gte: start, $lt: end } })
                .sort('-score')
                .populate('fighters')
                .populate('belongsTo')
                .populate('madeBy')
                .limit(10)

            summons = summons.filter(f => f.belongsTo.createdBy === 'admin').slice(0, req.query.limit);
            return res.status(200).send({ summons });
        } catch (error) {
            return res.status(500).send({ error: 'Unable to get the luckiest pull of today' });
        }
    },
    async totalRubies() {
        try {
            let allSummons = await getAllSummonsFilled();
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
    async totalRubiesWeek() {
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
    async totalRubiesMonth() {
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
    async totalFightersOfTypeOfToday(type) {
        //type deve ser Bronze, Silver ou Gold
        try {
            const allSummons = await getAllSummonsOfTodayFilledWithFighters();
            let bronzeCount = allSummons.reduce((total, summon) => {
                total += summon.fighters.reduce((t, s) => {
                    if (s.rarity === type) {
                        t++;
                    }
                    return t;
                }, 0);
                return total;
            }, 0);
            return bronzeCount;
        } catch (error) {
            throw new Error(error);
        }
    },
    async totalFightersOfTypeOfYesterday(type) {
        //type deve ser Bronze, Silver ou Gold
        try {
            const allSummons = await getAllSummonsOfYesterdayFilledWithFighters();
            let bronzeCount = allSummons.reduce((total, summon) => {
                total += summon.fighters.reduce((t, s) => {
                    if (s.rarity === type) {
                        t++;
                    }
                    return t;
                }, 0);
                return total;
            }, 0);
            return bronzeCount;
        } catch (error) {
            throw new Error(error);
        }
    },
    async totalFightersOfTypeOfWeek(type) {
        //type deve ser Bronze, Silver ou Gold
        try {
            const allSummons = await getAllSummonsOfWeekFilledWithFighters();
            let bronzeCount = allSummons.reduce((total, summon) => {
                total += summon.fighters.reduce((t, s) => {
                    if (s.rarity === type) {
                        t++;
                    }
                    return t;
                }, 0);
                return total;
            }, 0);
            return bronzeCount;
        } catch (error) {
            throw new Error(error);
        }
    },
    async totalFightersOfTypeOfMonth(type) {
        //type deve ser Bronze, Silver ou Gold
        try {
            const allSummons = await getAllSummonsOfMonthFilledWithFighters();
            let bronzeCount = allSummons.reduce((total, summon) => {
                total += summon.fighters.reduce((t, s) => {
                    if (s.rarity === type) {
                        t++;
                    }
                    return t;
                }, 0);
                return total;
            }, 0);
            return bronzeCount;
        } catch (error) {
            throw new Error(error);
        }
    },
    async totalFightersOfTypeOf3Months(type) {
        //type deve ser Bronze, Silver ou Gold
        try {
            const allSummons = await getAllSummonsOf3MonthsFilledWithFighters();
            let bronzeCount = allSummons.reduce((total, summon) => {
                total += summon.fighters.reduce((t, s) => {
                    if (s.rarity === type) {
                        t++;
                    }
                    return t;
                }, 0);
                return total;
            }, 0);
            return bronzeCount;
        } catch (error) {
            throw new Error(error);
        }
    },
    async totalSpecialFightersOfToday(type) {
        //type deve ser fes ou as
        try {
            const allSummons = await getAllSummonsOfTodayFilledWithFighters();
            let bronzeCount = allSummons.reduce((total, summon) => {
                total += summon.fighters.reduce((t, s) => {
                    if (type === 'fes') {
                        if (s.isFes) {
                            t++;
                        }
                    }
                    if (type === 'as') {
                        if (s.isAS) {
                            t++;
                        }
                    }
                    return t;
                }, 0);
                return total;
            }, 0);
            return bronzeCount;
        } catch (error) {
            throw new Error(error);
        }
    },
    async totalSpecialFightersOfYesterday(type) {
        //type deve ser fes ou as
        try {
            const allSummons = await getAllSummonsOfYesterdayFilledWithFighters();
            let bronzeCount = allSummons.reduce((total, summon) => {
                total += summon.fighters.reduce((t, s) => {
                    if (type === 'fes') {
                        if (s.isFes) {
                            t++;
                        }
                    }
                    if (type === 'as') {
                        if (s.isAS) {
                            t++;
                        }
                    }
                    return t;
                }, 0);
                return total;
            }, 0);
            return bronzeCount;
        } catch (error) {
            throw new Error(error);
        }
    },
    async totalSpecialFightersOfWeek(type) {
        //type deve ser fes ou as
        try {
            const allSummons = await getAllSummonsOfWeekFilledWithFighters();
            let bronzeCount = allSummons.reduce((total, summon) => {
                total += summon.fighters.reduce((t, s) => {
                    if (type === 'fes') {
                        if (s.isFes) {
                            t++;
                        }
                    }
                    if (type === 'as') {
                        if (s.isAS) {
                            t++;
                        }
                    }
                    return t;
                }, 0);
                return total;
            }, 0);
            return bronzeCount;
        } catch (error) {
            throw new Error(error);
        }
    },
    async totalSpecialFightersOfMonth(type) {
        //type deve ser fes ou as
        try {
            const allSummons = await getAllSummonsOfMonthFilledWithFighters();
            let bronzeCount = allSummons.reduce((total, summon) => {
                total += summon.fighters.reduce((t, s) => {
                    if (type === 'fes') {
                        if (s.isFes) {
                            t++;
                        }
                    }
                    if (type === 'as') {
                        if (s.isAS) {
                            t++;
                        }
                    }
                    return t;
                }, 0);
                return total;
            }, 0);
            return bronzeCount;
        } catch (error) {
            throw new Error(error);
        }
    },
    async totalSpecialFightersOf3Months(type) {
        //type deve ser fes ou as
        try {
            const allSummons = await getAllSummonsOf3MonthsFilledWithFighters();
            let bronzeCount = allSummons.reduce((total, summon) => {
                total += summon.fighters.reduce((t, s) => {
                    if (type === 'fes') {
                        if (s.isFes) {
                            t++;
                        }
                    }
                    if (type === 'as') {
                        if (s.isAS) {
                            t++;
                        }
                    }
                    return t;
                }, 0);
                return total;
            }, 0);
            return bronzeCount;
        } catch (error) {
            throw new Error(error);
        }
    },
    async totalRubiesSpentPerDate(days, id, banner) {
        try {
            const rubies = await detailedRubiesSpentPerDate(days, id, banner);
            return rubies;
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    },
    async totalFightersCollectedPerDate(days, id, banner) {
        try {
            const fighters = await detailedFightersCollectedPerDate(days, id, banner);
            return fighters;
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    },
    async getSummon(req, res){
        try {
            const summon = await Summon.findById(req.params.id)
                .populate('fighters')
                .populate('belongsTo')
                .populate('madeBy');

            if(!summon){
                return res.status(404).send({ error: 'Unable to find this summoner' });
            }
            return res.status(200).send({summon});
        } catch(error){
            return res.status(500).send({ error: 'Unable to find this summoner' });
        }
    }
}