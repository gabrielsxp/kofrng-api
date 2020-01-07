const GlobalStatistics = require('../Model/GlobalStatistics');
const SummonController = require('./SummonController');

module.exports = {
    async banner(req, res) {
        try {

            return res.status(200).send({});
        } catch (error) {
            return res.status(500).send({ error });
        }
    }
}