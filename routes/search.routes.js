const express = require('express');
const router = express.Router();
const offers = require('../data/offers');
const pool = require('../db');

router.get('/', async (req, res) => {
    const q = req.query.q;

    if (!q) {
        return res
        .status(400)
        .json({ error: 'q es requerido' })
    }

    // const terms = q.toLowerCase().split(' ');
    
    const query = `
        SELECT *
        FROM offers
        WHERE normalized_title LIKE '%' || $1 || '%'
        ORDER BY price ASC
        LIMIT 50
    `

    const result = await pool.query(query, [q])

    console.log("result: ", result)
    res.json(result.rows)
});

module.exports = router