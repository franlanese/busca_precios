const express = require('express');
const router = express.Router();
const pool = require('../db');
const normalize = require('../utils/normalize')

router.post('/', async (req, res) => {

    console.log("Actualizacion de ofertas")

    const query = `
        UPDATE offers
        SET available = false 
        WHERE scraped_at::DATE < current_date
    `

    const result = await pool.query(query)

    res.json(result.rows[0])
});

module.exports = router