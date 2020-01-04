const DefaultPool = require('../Model/DefaultPool');
const mkdirp = require('mkdirp');
const ObjectId = require('mongoose').Types.ObjectId;
const rimraf  = require('rimraf');
const fs = require('fs');
const path = require('path');

const writeFile = (pathname, content) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(pathname, content, async (err) => {
            if (err) {
                reject(err);
            }
            resolve({ ok: true });
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
    const silverFighters = fighters.filter((fighter) => fighter.rarity === 'Silver' && !fighter.isAS);
    const goldFighters = fighters.filter((fighter) => fighter.rarity === 'Gold' && !fighter.isFes && !fighter.isAS);

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
    async createDefaultPool(req, res) {
        const validFields = ['name', 'fighters'];
        const fields = Object.keys(req.body);
        const valid = fields.every((field) => validFields.includes(field));

        if (!valid) {
            return res.status(400).send({ error: 'Invalid Fields' });
        }
        try {
            const poolName = req.body.name.toLowerCase().replace(/\s/g, "_").replace(/-/g, "_");
            const oid = ObjectId();
            const slug = `${req.user.username}_${poolName}_${oid}`;
            DefaultPool.create({ ...req.body, createdBy: req.user.username, slug, file: poolName }, async (err, data) => {
                if (err) {
                    res.status(400).send({ error: 'Unable to create the pool' });
                }
                const pathname = path.join(__dirname, "..", "data", `${req.user.username}`, "pools", `${slug}`);
                const extracted = await extractFighters(pathname, req.body.fighters);
                if (extracted !== true) {
                    return res.status(400).send({ error: 'Unable to write file' });
                }
                return res.status(201).send({ defaultPool: data });
            });
        } catch (error) {
            console.log(error);
            return res.status(500).send({ error: error.errMsg, code: error.code });
        }
    },
    async deleteDefaultPool(req, res) {
        try {
            const defaultPool = await DefaultPool.findById(req.params.id);
            if (!defaultPool) {
                return res.status(404).send({ error: 'Unable to find this pool' });
            }
            if (defaultPool.createdBy !== req.user.username) {
                return res.status(403).send({ error: 'You cannot delete a pool that is not yours' });
            }
            const response = await DefaultPool.findByIdAndDelete(req.params.id);
            if (!response) {
                return res.status(404).send({ error: 'Unable to delete this pool' });
            }
            const pathname = path.join(__dirname, "..", "data", `${req.user.username}`, "pools", `${defaultPool.slug}`);
            console.log('Pathname: ' + pathname);
            rimraf.sync(pathname);
            return res.status(200).send({ success: true });
        } catch (error) {
            return res.status(500).send({ error: errMsg, code: error.code });
        }
    },
    async getDefaultPool(req, res) {
        try {
            const defaultPool = await DefaultPool.findById(req.params.id);
            await defaultPool.populate('fighters').execPopulate();
            if (!defaultPool) {
                return res.status(404).send({ error: 'Unable to find this pool' });
            }
            return res.status(200).send({ defaultPool });
        } catch (error) {
            console.log(error);
            return res.status(500).send({ error: errMsg, code: error.code });
        }
    },
    async updateDefaultPool(req, res) {
        const validFields = ['fighters'];
        const valid = updates.every((field) => validFields.includes(field));

        if (!valid) {
            return res.status(400).send({ error: 'Invalid Fields' });
        }
        try {
            const defaultPool = await DefaultPool.findById(req.params.id);
            if (!defaultPool) {
                return res.status(404).send({ error: 'Unable to find this pool' });
            }
            if (defaultPool.createdBy !== req.user.username) {
                return res.status(401).send({ error: 'You cannot update a pool that is not yours' });
            }
            updates.forEach((field) => defaultPool[field] = req.body[field]);
            defaultPool.save(async (err, data) => {
                if (err) {
                    res.status(400).send({ error: 'Unable to create the pool' });
                }
                const pathname = path.join(__dirname, "..", "data", `${req.user.username}`, "pools", `${defaultPool.slug}`);
                const extracted = await extractFighters(pathname, req.body.fighters);
                if (extracted !== true) {
                    return res.status(400).send({ error: 'Unable to write file' });
                }
                return res.status(201).send({ defaultPool: data });
            });
            return res.status(200).send({ defaultPool });
        } catch (error) {
            console.log(error);
            return res.status(500).send({ error: error.errMsg, code: error.code });
        }
    },
    async indexOfUser(req, res) {
        try {
            if (!req.user.username) {
                return res.status(403).send({ error: 'You cannot retrieve data' });
            }
            const pools = await DefaultPool.find({ createdBy: req.user.username });
            if (!pools) {
                return res.status(400).send({ error: 'Unable to get the pools' });
            }
            return res.status(200).send({ defaultPools: pools });
        } catch (error) {
            console.log(error);
            return res.status(500).send({ error: error.errMsg, code: error.code });
        }
    }
}