const cron = require ('node-cron')
const runScraping = require('./runScraping');

cron.schedule('00 5 * * *', async () => {
    console.log('Cron diario ejecutado');
    await runScraping()
})