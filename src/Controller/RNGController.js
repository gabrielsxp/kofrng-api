const Srand = require('jsrand');
const Banner = require('../Model/Banner');
const DefaultPool = require('../Model/DefaultPool');
const Fighter = require('../Model/Fighter');
const fs = require('fs');
const path = require('path');

const LOWER_BRONZE = 0;
const UPPER_BRONZE = 19;
const LOWER_SILVER = 20;
const UPPER_SILVER = 93;
const LOWER_GOLD = 94;
const UPPER_GOLD = 99;

/**
 * Função responsável por verificar se um determinado número recebido como
 * parâmetro está entre dois números definidos
 * 
 * @param {Number} n 
 * @param {Number} lower 
 * @param {Number} upper 
 */
function isBetween(n, lower, upper) {
    return (n >= lower && n <= upper);
}

/**
 * Função responsável por construir uma Promise para o uso de async/await
 * junto à função fs.readFile()
 * 
 * @param {String} path 
 * @param {String} encoding 
 */
async function readFile(path, encoding) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, encoding, (err, data) => {
            if (err) {
                reject(err);
            }
            resolve(data);
        });
    });
}

/**
 * Função responsável por construir uma Promise para o uso de async/await
 * junto à função fs.writeFile()
 * 
 * @param {String} path 
 * @param {String} content 
 */
async function writeFile(path, content) {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, content, (err) => {
            if (err) {
                reject(err);
            }
            resolve({ writed: true });
        })
    })
}

/**
 * Retorna um lutador aleatório de um determinado tipo
 * Obs: Inclui todos os lutadores existentes
 * 
 * @param {String} type 
 */
const randomFighter = async (type, pathname) => {
    const validTypes = ['Gold', 'Bronze', 'Silver'];
    const isValidType = validTypes.includes(type);
    if (!isValidType) {
        throw new Error('Invalid Fighter Type');
    }

    const fighterType = type.toLowerCase();
    const dataPath = pathname + `${fighterType}.txt`;
    const data = await readFile(dataPath, 'utf8');

    if (!data) {
        throw new Error('Inexistent Data');
    }
    const fighters = JSON.parse(data);
    const fighterId = fighters[Srand.randInt(0, fighters.length)];
    const fighter = await Fighter.findById(fighterId);

    return fighter;
}

const getIndex = (m, rates) => {
    for (let i = 0; i < rates.length; i++) {
        if (i === 0) {
            if (isBetween(m, 0, rates[i].rate)) {
                console.log("Is between, i = " + i);
                return i;
            }
        } else {
            if (isBetween(m, rates[i - 1].rate, rates[i].rate)) {
                console.log("Is between, i = " + i);
                return i;
            }
        }
    }
    return -1;
}

/**
 * Define uma pool de lutadores, de modo que seja possível limitar quais lutadores
 * serão extraídos a partir do algorítmo de números aleatórios
 * 
 * @param {String} bannerId
 */
const bannerSummon = async (bannerId) => {
    try {
        const banner = await Banner.findById(bannerId);
        const pool = await DefaultPool.findById(banner.pool);
        const poolPath = path.join(__dirname, "..", "data", `${pool.createdBy}`, "pools", `${pool.slug}`, "/");
        const rates = [...banner.rates];
        const hasFes = banner.fesRates.length > 0;
        const hasAS = banner.asRates.length > 0;

        let n = Srand.randInt(0, 100);
        let fighter = null;
        if (isBetween(n, rates[0], rates[1])) {
            fighter = await randomFighter('Bronze', poolPath);
        }
        if (isBetween(n, rates[1], rates[2])) {
            fighter = await randomFighter('Silver', poolPath);
        }
        if (isBetween(n, rates[2], rates[3])) {
            var maxRate = rates[3] - rates[2];
            var m = Srand.randFloat(0, maxRate);
            console.log("M: " + m);
            if (hasFes) {
                let fesRates = Object.values(banner.fesRates);
                let fesIndex = getIndex(m, fesRates);
                console.log("Fes Index: " + fesIndex);
                if (fesIndex >= 0) {
                    return fighter = await Fighter.findById(fesRates[fesIndex].fighter);
                } else {
                    fighter = await randomFighter('Gold', poolPath);
                }
            } if (hasAS) {
                let asRates = Object.values(banner.asRates);
                asRates[0].rate = asRates[0].rate + 0.3;
                console.log("Rate: " + asRates[0].rate);
                let asIndex = getIndex(m, asRates);
                console.log("AS Index: " + asIndex);
                if (asIndex >= 0) {
                    let fighter = await Fighter.findById(asRates[asIndex].fighter);
                    return fighter;
                } else {
                    fighter = await randomFighter('Gold', poolPath);
                }
            } else {
                fighter = await randomFighter('Gold', poolPath);
            }
        }
        return fighter;
    } catch (error) {
        console.log(error);
        throw new Error('Unable to retrieve data');
    }
}

module.exports = {
    async single(req, res) {
        try {
            const fighter = await bannerSummon(req.params.bannerId);
            return res.status(200).send({ fighters: [fighter] });
        } catch (error) {
            return res.status(400).send({ error });
        }
    },
    async multi(req, res) {
        let fighters = [];
        try {
            for (let i = 0; i < 10; i++) {
                let fighter = await bannerSummon(req.params.bannerId);
                fighters = fighters.concat(fighter);
            }
        } catch (error) {
            console.log(error);
            return res.status(400).send({ error: 'Unable to use this pool to summon' });
        }
        return res.status(200).send({ fighters });
    }
}
