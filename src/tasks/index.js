const Agenda = require('agenda');
const mongoConnectionString = 'mongodb://127.0.0.1:27017/kofrng';
const BestSummonController = require('../Controller/BestSummonController');

const agenda = new Agenda({db: {address: mongoConnectionString}});

agenda.define('set_best_summon_today', async job => {
    console.log('Best Summon Updated');
    await BestSummonController.saveBestSummon();
});

(async function(){
    await agenda.start();
    await agenda.every('10 minutes', 'set_best_summon_today');
})();