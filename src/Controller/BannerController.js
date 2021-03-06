const Banner = require('../Model/Banner');
const Summon = require('../Model/Summon');
const BestSummon = require('../Controller/BestSummonController');
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
            const bannerSlug = req.body.name.toLowerCase().replace(/\s/g, "_").replace(/-/g, "_") + '_' + req.user.username;
            const banner = await Banner.create({
                ...req.body,
                slug: bannerSlug,
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
        } catch (error) {
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
    async getDescribedBanner(req, res) {
        try {
            const banner = await (await Banner.findOne({ slug: req.params.slug }).populate('pool')).execPopulate({});
            if (!banner) {
                return res.status(404).send({ error: 'Unable to find the refered banner' });
            }
            var bronzeFighters = null;
            var silverFighters = null;
            var goldFighters = null;
            var fesFighters = null;
            var asFighters = null;

            //Calcula o numero de cada tipo de lutador da pool que pertence ao banner
            if (banner.pool) {
                for(let i in banner.pool.fighters){
                    await banner.populate(`pool.fighters.${i}`).execPopulate({});
                }
                const fighters = banner.pool.fighters;
                bronzeFighters = fighters.reduce((total, fighter) => {
                    if (fighter.rarity === 'Bronze') {
                        total++;
                    }
                    return total;
                }, 0);

                silverFighters = fighters.reduce((total, fighter) => {
                    if (fighter.rarity === 'Silver') {
                        total++;
                    }
                    return total;
                }, 0);

                goldFighters = fighters.reduce((total, fighter) => {
                    if (fighter.rarity === 'Gold' && !fighter.isFes && !fighter.isAS) {
                        total++;
                    }
                    return total;
                }, 0);

                fesFighters = fighters.reduce((total, fighter) => {
                    if (fighter.isFes) {
                        total++;
                    }
                    return total;
                }, 0);

                asFighters = fighters.reduce((total, fighter) => {
                    if (fighter.isAS) {
                        total++;
                    }
                    return total;
                }, 0);
            }
            //Calcula a probabilidade total dos lutadores especiais
            let sumFesRates = 0;
            if(banner.fesRates.length > 0){
                sumFesRates = banner.fesRates.reduce((total, obj) => {
                    total += obj.rate;
                    return total;
                }, 0);
            }
            let sumASRates = 0;
            if(banner.asRates.length > 0){
                sumASRates = banner.asRates.reduce((total, obj) => {
                    total += obj.rate;
                    return total;
                }, 0);
            }
            //Descreve a probabilidade real de cada lutador de cada tipo
            const bronzeRates = banner.rates[1] - banner.rates[0];
            const silverRates = banner.rates[2] - banner.rates[1];
            const goldRates = banner.rates[3] - banner.rates[2];
            const realGoldRates = (goldRates - (sumFesRates + sumASRates));
            const rates = {
                bronze: bronzeRates > 0 ? (bronzeRates/bronzeFighters) : 0,
                silver: silverRates > 0 ? (silverRates/silverFighters) : 0,
                gold: realGoldRates > 0 ? (realGoldRates/goldFighters) : 0,
            };
            const numberOfFighters = {
                bronze: bronzeFighters,
                silver: silverFighters,
                gold: goldFighters,
                fes: fesFighters,
                as: asFighters
            };
            const resp = {
                banner,
                rates,
                numberOfFighters
            };
            return res.status(200).send(resp);
        } catch (error) {
            console.log(error);
            return res.status(500).send({ error: error.errmsg, code: error.code });
        }
    },
    async fanBanners(req, res) {
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
            await Summon.deleteMany({ belongsTo: banner._id });
            await Banner.deleteOne({ _id: req.params.id });
            await BestSummon.saveBestSummon();

            return res.status(200).send({ success: true });
        } catch (error) {
            console.log(error);
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