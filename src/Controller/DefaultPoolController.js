const DefaultPool = require('../Model/DefaultPool');

module.exports = {
    async createDefaultPool(req, res) {
        const validFields = ['name', 'fighters'];
        const fields = Object.keys(req.body);
        const valid = fields.every((field) => validFields.includes(field));

        if (!valid) {
            return res.status(400).send({ error: 'Invalid Fields' });
        }
        try {
            const defaultPool = await DefaultPool.create({ ...req.body, createdBy: req.user.username });
            if (!defaultPool) {
                return res.status(400).send({ error: 'Unable to create the pool' });
            }
            return res.status(201).send({ defaultPool });
        } catch (error) {
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
            return res.sendStatus(200);
        } catch (error) {
            return res.status(500).send({ error: errMsg, code: error.code });
        }
    },
    async getDefaultPool(req, res) {
        try {
            const defaultPool = await DefaultPool.findById(req.params.id);
            await defaultPool.populate({ path: 'fighters' }).execPopulate();
            console.log(defaultPool.lFighters);
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
        const validFields = ['name', 'fighters'];
        const updates = Object.keys(req.body);
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
            await defaultPool.save();
            return res.status(200).send({ defaultPool });
        } catch (error) {
            console.log(error);
            return res.status(500).send({ error: errMsg, code: error.code });
        }
    }
}