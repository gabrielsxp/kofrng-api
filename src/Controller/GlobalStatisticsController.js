const GlobalStatistics = require('../Model/GlobalStatistics');
const SummonController = require('./SummonController');

module.exports = {
    async getDetailedRubiesStats(req, res) {
        try {
            let rubiesStats = await SummonController.totalRubiesSpentPerDate(req.query.days, req.query.user, req.query.banner);
            return res.status(200).send({ rubies: rubiesStats });
        } catch (error) {
            console.log(error);
            return res.status(500).send({ error });
        }
    },
    async getDetailedFightersStats(req, res) {
        try {
            let fighters = await SummonController.totalFightersCollectedPerDate(req.query.days, req.user._id, req.query.banner);
            return res.status(200).send({ fighters });
        } catch (error) {
            console.log(error);
            return res.status(500).send({ error });
        }
    },
    async createGlobalStats(req, res) {
        const stats = new GlobalStatistics({ ...req.body });
        await stats.save();
        return res.sendStatus(201);
    },
    async getAllStats(req, res) {
        try {
            const [stats] = await GlobalStatistics.find({});
            return res.status(200).send({ stats });
        } catch (error) {
            return res.status(200).send({ error: 'Unable to get the stats' });
        }
    },
    async setGlobalStats(type) {
        try {
            var current = null;
            current = await GlobalStatistics.findOne({ name: 'global_stats' });
            switch (type) {
                case 'today':

                    const totalRubiesToday = await SummonController.totalRubiesToday();
                    const totalBronzeToday = await SummonController.totalFightersOfTypeOfToday('Bronze');
                    const totalSilverToday = await SummonController.totalFightersOfTypeOfToday('Silver');
                    const totalGoldToday = await SummonController.totalFightersOfTypeOfToday('Gold');
                    const totalFesToday = await SummonController.totalSpecialFightersOfToday('fes');
                    const totalASToday = await SummonController.totalSpecialFightersOfToday('as');

                    current.totalRubiesToday = totalRubiesToday;
                    current.totalBronzeToday = totalBronzeToday;
                    current.totalSilverToday = totalSilverToday;
                    current.totalGoldToday = totalGoldToday;
                    current.totalFesToday = totalFesToday;
                    current.totalASToday = totalASToday;

                    await current.save();
                    break;

                case 'yesterday':

                    const totalRubiesYesterday = await SummonController.totalRubiesYesterday();
                    const totalSilverYesterday = await SummonController.totalFightersOfTypeOfYesterday('Silver');
                    const totalBronzeYesterday = await SummonController.totalFightersOfTypeOfYesterday('Bronze');
                    const totalGoldYesterday = await SummonController.totalFightersOfTypeOfYesterday('Gold');
                    const totalFesYesterday = await SummonController.totalSpecialFightersOfYesterday('fes');
                    const totalASYesterday = await SummonController.totalSpecialFightersOfYesterday('as');

                    current.totalRubiesYesterday = totalRubiesYesterday;
                    current.totalBronzeYesterday = totalBronzeYesterday;
                    current.totalSilverYesterday = totalSilverYesterday;
                    current.totalGoldYesterday = totalGoldYesterday;
                    current.totalFesYesterday = totalFesYesterday;
                    current.totalASYesterday = totalASYesterday;

                    await current.save();
                    break;

                case 'week':

                    const totalRubiesWeek = await SummonController.totalRubiesWeek();
                    const totalBronzeLastWeek = await SummonController.totalFightersOfTypeOfWeek('Bronze');
                    const totalSilverLastWeek = await SummonController.totalFightersOfTypeOfWeek('Silver');
                    const totalGoldLastWeek = await SummonController.totalFightersOfTypeOfWeek('Gold');
                    const totalFesLastWeek = await SummonController.totalSpecialFightersOfWeek('fes');
                    const totalASLastWeek = await SummonController.totalSpecialFightersOfWeek('as');

                    current.totalRubiesWeek = totalRubiesWeek;
                    current.totalBronzeWeek = totalBronzeLastWeek;
                    current.totalSilverWeek = totalSilverLastWeek;
                    current.totalGoldWeek = totalGoldLastWeek;
                    current.totalFesWeek = totalFesLastWeek;
                    current.totalASWeek = totalASLastWeek;

                    await current.save();
                    break;

                case 'Week':

                    const totalRubiesMonth = await SummonController.totalRubiesMonth();
                    const totalBronzeLastMonth = await SummonController.totalFightersOfTypeOfMonth('Bronze');
                    const totalSilverLastMonth = await SummonController.totalFightersOfTypeOfMonth('Silver');
                    const totalGoldLastMonth = await SummonController.totalFightersOfTypeOfMonth('Gold');
                    const totalFesLastMonth = await SummonController.totalSpecialFightersOfMonth('fes');
                    const totalASLastMonth = await SummonController.totalSpecialFightersOfMonth('as');

                    current.totalRubiesMonth = totalRubiesMonth;
                    current.totalBronzeLastMonth = totalBronzeLastMonth;
                    current.totalSilverLastMonth = totalSilverLastMonth;
                    current.totalGoldLastMonth = totalGoldLastMonth;
                    current.totalFesLastMonth = totalFesLastMonth;
                    current.totalASMonth = totalASLastMonth;

                    await current.save();
                    break;

                default:
                    current = await GlobalStatistics.findOne({ name: 'global_stats' });
                    const totalRubies = await SummonController.totalRubies();

                    current.totalRubies = totalRubies;

                    await current.save();
                    break;
            }
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    }
}