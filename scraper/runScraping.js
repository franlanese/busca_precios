const searches = require('./searches');
const scrapeCetrogar = require('./stores/cetrogar');
const scrapeOnCity = require('./stores/oncity');

async function runScraping() {
    console.log('Iniciando scraping... ');

    for (const search of searches) {
        //await scrapeCetrogar(search);
        await scrapeOnCity(search)

        await new Promise(r => setTimeout(r, 5000));
    }

    console.log("Scraping finalizado!")
}

module.exports = runScraping