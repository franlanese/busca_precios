const express = require('express');
const router = express.Router();
const offers = require('../data/offers');
const pool = require('../db');

router.get('/', async (req, res) => {
    const { q, category } = req.query;

    if (!q) {
        return res
        .status(400)
        .json({ error: 'q es requerido' })
    }

    const terms = q.toLowerCase().split(/\s+/).filter(t => t.length > 0);
    
    let whereClauses = [];
    let values = [];
    let idx = 1

    for (const term of terms) {
        whereClauses.push(`normalized_title LIKE $${idx++}`)
        values.push(`%${term}%`)
    }

    if (category) {
        whereClauses.push(`category = $${idx++}`);
        values.push(category)
    }

    const query = `
        SELECT *
        FROM offers
        WHERE ${whereClauses.join(' AND ')}
        ORDER BY price ASC
        LIMIT 50
    `
    const result = await pool.query(query, values)

    console.log("result: ", result)
    res.json(result.rows)
});

module.exports = router