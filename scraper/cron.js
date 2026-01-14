const cron = require ('node-cron')
const runScraping = require('./runScraping');

cron.schedule('0 3 * * *', async () => {
    console.log('Cron diario ejecutado');
    await runScraping()
})