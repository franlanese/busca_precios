require('./scraper/cron')
require('dotenv').config()
const express = require('express');

const productsRoutes = require('./routes/products.routes')
const newOfferRoutes = require('./routes/newOffer.routes')
const searchRoutes = require('./routes/search.routes')

const app = express();
const pool = require('./db');
const PORT = 4500;

app.use(express.json())

app.use('/products', productsRoutes)
app.use('/newOffer', newOfferRoutes)
app.use('/search', searchRoutes)

app.listen(PORT, () => {
    console.log(`API corriendo en http://localhost:${PORT}`);
});