const searches = require('./searches');
const scrapeCetrogar = require('./stores/cetrogar');

async function runScraping() {
    console.log('Iniciando scraping... ');

    for (const search of searches) {
        await scrapeCetrogar(search);

        await new Promise(r => setTimeout(r, 5000));
    }

    console.log("Scraping finalizado!")
}

module.exports = runScraping