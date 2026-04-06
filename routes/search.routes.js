const express = require('express');
const router = express.Router();
const offers = require('../data/offers');
const pool = require('../db');
const SEARCH_LIMIT = require('../utils/constants')

router.get('/', async (req, res) => {
    const { q, category , page = 1} = req.query;

    console.log("query: ", q, category)

    if (!q && !category) {
        return res
        .status(400)
        .json({ error: 'q o category es requerido' })
    }
    
    let whereClauses = [];
    let values = [];
    let idx = 1

    
    if (q) {
        const terms = q.toLowerCase().split(/\s+/).filter(t => t.length > 0);
        
        for (const term of terms) {
        whereClauses.push(`normalized_title LIKE $${idx++}`)
        values.push(`%${term}%`)
        }
    }

    if (category) {
        const categoriesList = String(category).split(',').map(c => c.toLowerCase().trim())

        whereClauses.push(`category = ANY($${idx++})`);
        values.push(categoriesList)
    }

    const offset = (Number(page) - 1) * SEARCH_LIMIT

    const query = `
        SELECT *
        FROM offers
        WHERE ${whereClauses.join(' AND ')}
        ORDER BY price ASC
        LIMIT $${idx++} 
        OFFSET $${idx}
    `;

    values.push(SEARCH_LIMIT, offset)
    const result = await pool.query(query, values)

    console.log("QUERY DB: ", query)

    console.log("result: ", result)
    res.json(result.rows)
});

module.exports = router