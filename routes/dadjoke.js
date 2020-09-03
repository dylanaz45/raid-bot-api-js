require('dotenv').config();
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const logger = require("../common/log")

/**
 * Route: /dadjoke
 * Endpoint: GET /dadjoke
 * URL Parameters: token (JSON Web Token used for authentication)
 * Sends a random dad joke
 */
router.get('/', async (req, res) => {
    const token = req.query.token;

    try {
        jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        res.status(401).send("Unauthorized")
    }

    try {
        const db = req.app.locals.db
        const cursor = await db.collection('dad_jokes').aggregate([{
            $sample: {size: 1}
        }])

        cursor.toArray()
            .then(document => {
                res.status(200).json({
                    joke: document[0].joke
                })
            })
    } catch (err) {
        logger.warn("Failed to connect to dad jokes collection")
    }
})

module.exports = router;
