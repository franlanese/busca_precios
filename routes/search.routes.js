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

    const terms = q.toLowerCase().split(/\s+/).filter(t => t.length > 0);
    
    const whereClauses = terms.map((_, i) => `normalized_title LIKE $${i + 1}`)
    const query = `
        SELECT *
        FROM offers
        WHERE ${whereClauses.join(' AND ')}
        ORDER BY price ASC
        LIMIT 50
    `

    const values = terms.map(t => `%${t}%`)
    const result = await pool.query(query, values)

    console.log("result: ", result)
    res.json(result.rows)
});

module.exports = router