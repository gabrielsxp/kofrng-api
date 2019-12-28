const Pool = require('../Model/Pool');
const mkdirp = require('mkdirp');
const ObjectId = require('mongoose').Types.ObjectId;
const fs = require('fs');
const path = require('path');

const writeFile = (pathname, content) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(pathname, JSON.stringify(content), async (err) => {
            if (err) {
                reject(err);
            }
            resolve({ ok: true });
        });
    });
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

function reduceFighterObjectToId(fighters) {
    let f = fighters;
    f.forEach((fighter, index, arr) => {
        arr[index] = fighter._id;
    });

    return f;
}

const extractFighters = async (pathname, fighters) => {
    const bronzeFighters = fighters.filter((fighter) => fighter.rarity === 'Bronze');
    const silverFighters = fighters.filter((fighter) => fighter.rarity === 'Silver');
    const goldFighters = fighters.filter((fighter) => fighter.rarity === 'Gold');

    try {
        await mkdirp(pathname);
        await writeFile(`${pathname}/bronze.txt`, JSON.stringify(reduceFighterObjectToId(bronzeFighters)));
        await writeFile(`${pathname}/silver.txt`, JSON.stringify(reduceFighterObjectToId(silverFighters)));
        await writeFile(`${pathname}/gold.txt`, JSON.stringify(reduceFighterObjectToId(goldFighters)));

        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

module.exports = {
    async createPool(req, res) {
        const validFields = ['name', 'bannerId'];
        const fields = Object.keys(req.body);
        const valid = validFields.every((field) => fields.includes(field));

        if (!valid) {
            return res.status(400).send({ error: 'Invalid Fields' });
        }
        try {
            Pool.create({ name: req.body.name, belongsTo: req.body.banner, createdBy: req.user.username }, async (err, data) => {
                if (err) {
                    console.log(err);
                    return res.status(400).send({ error: 'Unable to create pool' });
                }
                const pathname = path.join(__dirname, "..", "data", `${req.user.username}`, "pools", `${data.file}`);
                const extracted = await extractFighters(pathname, req.body.fighters);
                if (extracted !== true) {
                    return res.status(400).send({ error: 'Unable to write file' });
                }

                return res.status(201).send({ pool: data });
            });
        } catch (error) {
            console.log(error);
            return res.status(500).send({ error: error.errmsg, code: error.code });
        }

    },
    async redefinePool(req, res) {
        try {
            const pool = await Pool.findById(req.params.id);
            if (pool.createdBy !== req.user.username) {
                return res.status(401).send({ error: 'You cannot modify a file that not belong to you' });
            }
            const fileName = pool.file;
            const pathname = path.join(__dirname, "..", "data", `${req.user.username}`, "pools", `${fileName}`);
            const fighters = req.body.fighters;

            const extracted = await extractFighters(pathname, fighters);
            if (extracted !== true) {
                return res.status(400).send({ error: 'Unable to re-write file' });
            }

            return res.sendStatus(200);
        } catch (error) {
            console.log(error);
            return res.status(500).send({ error: 'Unable to find the filename' });
        }
    },
    async getPool(req, res) {
        try {
            const pool = await Pool.findById(req.params.id);
            return res.status(200).send({ pool });
        } catch (error) {
            return res.status(500).send({ error: 'Unable to read file' });
        }
    }
}