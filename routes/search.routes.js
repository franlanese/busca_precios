const express = require('express');
const router = express.Router();
const offers = require('../data/offers');
const pool = require('../db');
const SEARCH_LIMIT = require('../utils/constants')

router.get('/', async (req, res) => {
    const { q, category, store, page = 1 } = req.query;

    console.log("query: ", q, category, store)

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
            whereClauses.push(`normalized_title ILIKE $${idx++}`)
            values.push(`%${term}%`)
        }
    }

    if (category) {
        const categoriesList = String(category).split(',').map(c => c.toLowerCase().trim())

        whereClauses.push(`category = ANY($${idx++})`);
        values.push(categoriesList)
    }

    if (store) {
        const storesList = String(store).split(',').map(c => c.toLowerCase().trim())
        whereClauses.push(`store = ANY($${idx++})`)
        values.push(storesList)
    }

    const currentPage = Math.max(1, parseInt(page) || 1);
    const offset = (currentPage - 1) * SEARCH_LIMIT;

    const additionalFilters = whereClauses.length > 0 ? ` AND ${whereClauses.join(' AND ')}` : '';

    const query = `
        SELECT *
        FROM offers
        WHERE available = TRUE${additionalFilters}
        ORDER BY price ASC
        LIMIT $${idx++} 
        OFFSET $${idx}
    `;

    values.push(SEARCH_LIMIT, offset);
    
    try {
        const result = await pool.query(query, values);
        console.log("QUERY DB: ", query, values);
        res.json(result.rows);
    } catch (error) {
        console.error("Error ejecutando busqueda:", error);
        res.status(500).json({ error: 'Error en el servidor al realizar la búsqueda' });
    }
});

module.exports = router