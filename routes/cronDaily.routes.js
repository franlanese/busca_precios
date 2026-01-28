const express = require('express')
const runScraping = require('../scraper/runScraping')
const router = express.Router()

router.get("/", async (req, res) => {
    if (req.headers.authorization !== `Bearer ${process.env.CRON_TOKEN}`) {
        return res.status(401).send("Unauthorized. ")
    }
    try {


        await runScraping()
        res.status(200).send("OK")
    } catch (err) {
        res.status(500).send("Error")
    }
})

module.exports = router