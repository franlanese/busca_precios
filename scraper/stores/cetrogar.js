const { chromium } = require('playwright');
const sendOffer = require('../sendOffer');

async function scrapeCetrogar(search) {
    const browser = await chromium.launch({ headless: true })
    const page = await browser.newPage();
    const url =  `https://www.cetrogar.com.ar/catalogsearch/result/?q=${encodeURIComponent(search)}`
    await page.goto(url, { timeout: 60000})
    await page.waitForTimeout(3000);

    const products = await page.$$eval('.product-item-info.product-card', cards => 
        cards.map(card => ({
            title: card.querySelector('.name-container')?.innerText,
            price: parseInt(card.querySelector('.price')?.innerText.replace(/\D/g, '')),
            url: card.href,
            image: card.querySelector('img')?.src
        }))
    );

    for (const product of products) {
        if (!product.title || !product.price) continue;
        
        await sendOffer({
            store: 'Cetrogar',
            title: product.title,
            price: product.price,
            url: product.url,
            image: product.image,
            category: 'celulares'
        })
    }
    
    await browser.close()
}

module.exports = scrapeCetrogar
