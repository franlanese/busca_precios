const cron = require ('node-cron')
const runScraping = require('./runScraping');

cron.schedule('00 9 * * *', async () => {
    console.log('Cron diario ejecutado');
    await runScraping()
})