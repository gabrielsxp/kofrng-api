const Srand = require('jsrand');
const Summon = require('../Controller/UserController');
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
async function writeFile(path, content){
    return new Promise((resolve, reject) => {
        fs.writeFile(path, content, (err) => {
            if(err){
                reject(err);
            }
            resolve({writed: true});
        })
    })
}

/**
 * Retorna um lutador aleatório de um determinado tipo
 * Obs: Inclui todos os lutadores existentes
 * 
 * @param {String} type 
 */
const randomFighter = async (type) => {
    const validTypes = ['Gold', 'Bronze', 'Silver'];
    const isValidType = validTypes.includes(type);
    if (!isValidType) {
        throw new Error('Invalid Fighter Type');
    }

    const fighterType = type.toLowerCase();
    const dataPath = path.join(__dirname, '..', 'data', `${fighterType}.txt`);
    const data = await readFile(dataPath, 'utf8');
    if (!data) {
        throw new Error('Inexistent Data');
    }
    let lines = data.split('\n');
    const fighterId = lines[Srand.randInt(0, lines.length)];
    const fighter = await Fighter.findById(fighterId);

    return fighter;
}

/**
 * Retorna um lutador baseado no intervalo de números, definindo a probabilidade
 * fixa para cada tipo existente
 */
const typedFighter = async () => {
    let n = Srand.randInt(0, 100);
    let fighter = null;

    if (isBetween(n, LOWER_BRONZE, UPPER_BRONZE)) {
        fighter = await randomFighter('Bronze');
    }
    if (isBetween(n, LOWER_SILVER, UPPER_SILVER)) {
        fighter = await randomFighter('Silver');
    }
    if (isBetween(n, LOWER_GOLD, UPPER_GOLD)) {
        fighter = await randomFighter('Gold');
    }

    return fighter;
}

/**
 * Define uma pool de lutadores, de modo que seja possível limitar quais lutadores
 * serão extraídos a partir do algorítmo de números aleatórios
 * 
 * @param {String} username 
 * @param {String} poolName 
 * @param {Array} fighters
 */
const definePool = (username, poolName, fighters) => {
    const poolPath = path.join(__dirname, "..", "users", `${username}`, `${poolName}.txt`);
    console.log(poolPath);
    
}

module.exports = {
    typedFighter,
    async single(req, res) {
        let fighter = await typedFighter();
        return res.status(200).send({ fighter });
    },
    async multi(req, res) {
        let fighters = [];
        for (let i = 0; i < 10; i++) {
            let fighter = await typedFighter(req, res);
            fighters = fighters.concat(fighter);
        }
        return res.status(200).send({ fighters });
    }
}
