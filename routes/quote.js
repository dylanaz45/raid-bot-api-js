require('dotenv').config();
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const logger = require("../common/log")

/**
 * Route: /quote
 * Endpoint: GET /quote
 * URL Parameters: token (JSON Web Token used for authentication)
 * Sends a random quote
 */
router.get('/', async (req, res) => {
    const token = req.query.token;

    try {
        jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        res.status(401).send("Unauthorized")
        return
    }

    try {
        const db = req.app.locals.db;
        const cursor = await db.collection('quotes').aggregate([{
            $sample: {size: 1}
        }])

        cursor.toArray()
            .then(document => {
                res.status(200).json({
                    text: document[0].quoteText,
                    author: document[0].quoteAuthor})
            })
    } catch (err) {
        logger.warn("Failed to connect to quotes collection")
    }
})

module.exports = router;
