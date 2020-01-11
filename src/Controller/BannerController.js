const Banner = require('../Model/Banner');
const moment = require('moment');

module.exports = {
    async createBanner(req, res) {
        const validFields = ['name', 'image', 'singleCost', 'multiCost', 'pool', 'rates', 'fesRates', 'asRates', 'start', 'end'];
        const fields = Object.keys(req.body);
        const valid = validFields.every((field) => fields.includes(field));

        if (!valid) {
            return res.status(400).send({ error: 'Invalid Fields' });
        }
        try {
            const banner = await Banner.create({
                ...req.body,
                createdBy: req.user.username
            });
            if (!banner) {
                return res.status(400).send({ error: 'Unable to create banner' });
            }
            return res.status(201).send({ banner });
        } catch (error) {
            console.log(error);
            return res.status(500).send({ error: error.errmsg, code: error.code });
        }
    },
    async getBySlug(req, res) {
        try {
            const banner = await Banner.findOne({ slug: req.params.slug });
            if (!banner) {
                return res.status(400).send({ error: 'Unable to find the refered banner' });
            }
            return res.status(200).send({ banner });
        } catch (error) {
            return res.status(500).send({ error: error.errmsg, code: error.code });
        }
    },
    async index(req, res) {
        try {
            const banners = await Banner.find({}).exec();
            if (!banners) {
                return res.status(400).send({ error: 'Unable to find banners' });
            }
            return res.status(200).send({ banners });
        } catch (error) {
            return res.status(400).send({ error: error.errMsg, code: error.code });
        }
    },
    async adminIndex(req, res) {
        try {
            const banners = await Banner.find({ createdBy: 'admin' }).exec();
            if (!banners) {
                return res.status(400).send({ error: 'Unable to find banners' });
            }
            return res.status(200).send({ banners });
        } catch (error) {
            return res.status(400).send({ error: error.errMsg, code: error.code });
        }
    },
    async getByName(req, res) {
        try {
            const name = req.body.name;
            const banners = await Banner.find({ createdBy: { $ne: 'admin' }, name: { $regex: new RegExp(name), $options: 'i' } });
            console.log(banners);
        return res.status(200).send({ banners });
    } catch(error) {
        return res.status(500).send({ error });
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
async fanBanners(req, res) {
    const start = moment(new Date()).startOf('day');
    try {
        const banners = await Banner.find({ createdBy: { $ne: 'admin' } }).limit(10).sort('-createdAt');
        return res.status(200).send({ banners });
    } catch (error) {
        return res.status(500).send({ error });
    }
},
async updateBanner(req, res) {
    const validFields = ['name', 'image', 'singleCost', 'multiCost', 'pool', 'rates', 'fesRates', 'asRates', 'start', 'end'];
    const updates = Object.keys(req.body);
    const valid = updates.every((field) => validFields.includes(field));

    if (!valid) {
        return res.status(400).send({ error: 'Invalid Fields' });
    }

    try {
        const banner = await Banner.findById(req.params.id);
        if (banner.createdBy !== req.user.username) {
            return res.status(401).send({ error: 'You cannot update a banner that is not yours' });
        }
        if (!banner) {
            return res.status(404).send({ error: 'Unable to find the refered banner' });
        }
        updates.forEach((field) => banner[field] = req.body[field]);
        await banner.save();
        return res.status(200).send({ banner });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: error.errmsg, code: error.code });
    }
},
async indexOfUser(req, res) {
    try {
        if (!req.user.username) {
            return res.status(403).send({ error: 'You cannot retrieve data' });
        }
        const banners = await Banner.find({ createdBy: req.user.username });
        if (!banners) {
            return res.status(400).send({ error: 'Unable to get the banners' });
        }
        return res.status(200).send({ banners });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: error.errMsg, code: error.code });
    }
},
async deleteBanner(req, res) {
    try {
        const banner = await Banner.findById(req.params.id);
        if (!banner) {
            return res.status(404).send({ error: 'Unable to find the refered banner' });
        }
        if (banner.createdBy !== req.user.username) {
            return res.status(401).send({ error: 'You cannot delete a banner that is not yours' });
        }
        await Banner.findByIdAndDelete(req.params.id);
        return res.status(200).send({ success: true });
    } catch (error) {
        return res.status(500).send({ error: errmsg, code: error.code });
    }
},
async filterByDate(req, res) {
    try {
        const date = req.params.date;
        var banners = [];
        var lastBanners = [];
        const day = moment(new Date()).startOf('day');
        const today = moment(new Date()).startOf('day').toISOString();
        const lastWeek = day.subtract(7, 'days').startOf('day').toISOString();
        const lastMonth = day.subtract(30, 'days').startOf('day').toISOString();
        const last3Months = day.subtract(90, 'days').startOf('day').toISOString();
        const last6MOnths = day.subtract(180, 'days').startOf('day').toISOString();

        /**
         * 0: last week
         * 1: last month
         * 2: last 3 months
         * 3: last 6 months
         */
        switch (date) {
            case '0':
                lastBanners = await Banner.find(
                    {
                        createdBy: 'admin',
                        start: { $gte: lastWeek, $lte: today }
                    });
                banners = banners.concat(lastBanners);
                break;
            case '1':
                lastBanners = await Banner.find(
                    {
                        createdBy: 'admin',
                        start: { $gte: lastMonth, $lte: today }
                    });
                banners = banners.concat(lastBanners);
                break;

            case '2':
                lastBanners = await Banner.find(
                    {
                        createdBy: 'admin',
                        start: { $gte: last3Months, $lte: today }
                    });
                banners = banners.concat(lastBanners);
                break;

            case '3':
                lastBanners = await Banner.find(
                    {
                        createdBy: 'admin',
                        start: { $gte: last6MOnths, $lte: today }
                    });
                banners = banners.concat(lastBanners);
                break;
            default:
                lastBanners = await Banner.find(
                    {
                        createdBy: 'admin',
                        start: { $gte: last6MOnths, $lte: today }
                    });
                banners = banners.concat(lastBanners);
                break;
        }
        return res.status(200).send({ banners });
    } catch (error) {
        console.log(error);
        return res.sendStatus(200);
    }
}
}