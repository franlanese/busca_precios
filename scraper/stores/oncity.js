const { chromium } = require('playwright');
const sendOffer = require('../sendOffer');

async function scrapeOnCity(search) {
    const browser = await chromium.launch({
        headless: true, args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage'
        ]
    })
    const page = await browser.newPage();

    const url = `https://www.oncity.com/${encodeURIComponent(search)}?_q=${encodeURIComponent(search)}&map=ft`

    await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 })
    await page.waitForTimeout(3000);

    async function autoScroll(page) {
        await page.evaluate(async () => {
            await new Promise((resolve) => {
                let totalHeight = 0;
                let distance = 100; // Distancia de cada scroll en píxeles
                let timer = setInterval(() => {
                    let scrollHeight = document.body.scrollHeight;
                    window.scrollBy(0, distance);
                    totalHeight += distance;

                    // Si llegamos al final de la página, nos detenemos
                    if (totalHeight >= scrollHeight) {
                        clearInterval(timer);
                        resolve();
                    }
                }, 150); // Velocidad del scroll (100ms)
            });
        });
    }

    let cargandoMas = true
    const verMasSelector = '.vtex-search-result-3-x-buttonShowMore';

    while (cargandoMas) {
        await autoScroll(page)
        await page.waitForTimeout(2000)

        const boton = page.getByText('Ver más productos');
        if (boton && await boton.isVisible()) {

            await boton.click({ force: true }).catch(() => { })
            await page.waitForTimeout(3000)
        } else {

            cargandoMas = false;
        }
    }

    const products = await page.$$eval('.vtex-search-result-3-x-galleryItem', cards =>
        cards.map(card => ({
            title: card.querySelector('.vtex-product-summary-2-x-nameContainer')?.innerText,
            price: parseInt(card.querySelector('.vtex-product-price-1-x-sellingPrice')?.innerText.replace(/\D/g, '')),
            url: card.querySelector('a').href,
            image: card.querySelector('img')?.src
        }))
    );



    for (const product of products) {
        if (!product.title || !product.price) continue;

        console.log(`${product.title} - ${product.price}`)
        await sendOffer({
            store: 'On City',
            title: product.title,
            price: product.price,
            url: product.url,
            image: product.image,
            category: 'celulares'
        })


    }


    await browser.close()
}

module.exports = scrapeOnCity
