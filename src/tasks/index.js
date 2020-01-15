const Agenda = require('agenda');
const moment = require('moment');
const dotenv = require('dotenv').config();

let mongoConnectionString = '';
if(process.env.ENV === 'production'){
    mongoConnectionString = `mongodb://${process.env.MONGOOSE_DB_USER}:${process.env.MONGOOSE_DB_PASSWORD}@${process.env.MONGOOSE_DB_URL}/kofastools`;
} else {
    mongoConnectionString = 'mongodb://127.0.0.1:27017/kofrng';
}
const BestSummonController = require('../Controller/BestSummonController');
const GlobalStatiticsController = require('../Controller/GlobalStatisticsController');

const agenda = new Agenda({db: {address: mongoConnectionString}});

agenda.define('set_best_summon_today', async job => {
    console.log('Best Summon Updated');
    await BestSummonController.saveBestSummon();
});

agenda.define('set_today_stats', async job => {
    console.log('Today Stats Updated');
    await GlobalStatiticsController.setGlobalStats('today');
});

agenda.define('set_yesterday_stats', async job => {
    console.log('Yesterday Stats Updated');
    await GlobalStatiticsController.setGlobalStats('yesterday');
});

agenda.define('set_week_stats', async job => {
    console.log('This Week Stats Updated');
    await GlobalStatiticsController.setGlobalStats('week');
});

agenda.define('set_month_stats', async job => {
    console.log('Last 30 Days Stats Updated');
    await GlobalStatiticsController.setGlobalStats('month');
});

agenda.define('set_total_rubies_stats', async job => {
    console.log('Total Rubies Stats Updated');
    await GlobalStatiticsController.setGlobalStats('rubies');
});

(async function(){
    await agenda.start();
    await agenda.every('10 minutes', 'set_best_summon_today');
    await agenda.every('60 minutes', 'set_today_stats');
    await agenda.every('60 minutes', 'set_total_rubies_stats');
    await agenda.schedule(moment(new Date()).add(1, 'days').startOf('day').toISOString(), 'set_yesterday_stats');
    await agenda.schedule(moment(new Date()).endOf('week').toISOString(), 'set_week_stats');
    await agenda.schedule(moment(new Date()).endOf('month').toISOString(), 'set_month_stats');
})();