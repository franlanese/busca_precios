const express = require('express');
const router = express.Router();
const pool = require('../db');
const normalize = require('../utils/normalize')

router.post('/', async (req, res) => {
    const {
        store,
        title,
        brand,
        model,
        price,
        url,
        image,
        category
    } = req.body

    const normalizedTitle = normalize(title)

    const query = `
        INSERT INTO offers
        (store, title, normalized_title, brand, model, price, url, image, category, scraped_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
        ON CONFLICT(url)
        DO UPDATE SET
            price = EXCLUDED.price,
            updated_at = NOW(),
            scraped_at = NOW()
        RETURNING *
    `

    const values = [
        store,
        title,
        normalizedTitle,
        brand,
        model,
        price,
        url,
        image,
        category
    ]

    const result = await pool.query(query, values)
    console.log("result: ", result)
    res.json(result.rows[0])
});

module.exports = router