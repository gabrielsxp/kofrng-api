const Banner = require('../Model/Banner');

module.exports = {
    async createBanner(req, res) {
        const validFields = ['name', 'image', 'cost', 'pool'];
        const fields = Object.keys(req.body);
        const valid = validFields.every((field) => fields.includes(field));

        if (!valid) {
            return res.status(400).send({ error: 'Invalid Fields' });
        }
        try {
            const banner = await Banner.create({...req.body, createdBy: req.user.username});
            if (!banner) {
                return res.status(400).send({ error: 'Unable to create banner' });
            }
            return res.status(201).send({ banner });
        } catch (error) {
            return res.status(500).send({ error: error.errmsg, code: error.code });
        }
    },
    async getBanner(req, res) {
        try {
            const banner = await Banner.findById(req.params.id);
            if (!banner) {
                return res.status(404).send({ error: 'Unable to find the refered banner' });
            }
            return res.status(200).send({ banner });
        } catch (error) {
            return res.status(500).send({ error: error.errmsg, code: error.code });
        }
    },
    async updateBanner(req, res) {
        const validUpdateFields = ['image', 'cost', 'pool'];
        const updates = Object.keys(req.body);
        const valid = updates.every((field) => validUpdateFields.includes(field));

        if (!valid) {
            return res.status(400).send({ error: 'Invalid Fields' });
        }

        try {
            const banner = await Banner.findById(req.params.id);
            if(banner.createdBy !== req.user.username){
                return res.status(401).send({error: 'You cannot update a banner that is not yours'});
            }
            if (!banner) {
                return res.status(404).send({ error: 'Unable to find the refered banner' });
            }
            validUpdateFields.forEach((field) => banner[field] = req.body[field]);
            return res.status(200).send({ banner });
        } catch(error){
            return res.status(500).send({error: error.errmsg, code: error.code});
        }
    },
    async deleteBanner(req, res){
        try {
            const banner = await Banner.findById(req.params.id);
            if(!banner){
                return res.status(404).send({error: 'Unable to find the refered banner'});
            }
            if(banner.createdBy !== req.user.username){
                return res.status(401).send({error: 'You cannot delete a banner that is not yours'});
            }
            await Banner.findByIdAndDelete(req.params.id);
            return res.sendStatus(200);
        } catch(error){
            return res.status(500).send({error: errmsg, code: error.code});
        }
    }
}