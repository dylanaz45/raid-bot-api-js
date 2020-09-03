require('dotenv').config();
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const logger = require("../common/log")
const client = require("redis").createClient(process.env.REDIS_URL);

/**
 * Route: /den_info
 * Endpoint: GET /den_info
 * URL Parameters: token (JSON Web Token used for authentication), den (a Pokemon Sword and Shield den)
 * Sends the ability for a specified den
 */
router.get('/', (req, res) => {
    const token = req.query.token;
    try {
        jwt.verify(token, process.env.JWT_SECRET)
    } catch (err) {
        res.status(401).send("Unauthorized")
        return
    }

    client.get(req.query.den, async (err, result) => {
        if (result) {
            res.status(200).json(JSON.parse(result));
        } else {
            const db = req.app.locals.db.collection("den_info")
            const cursor = await db.findOne({
                den: req.query.den
            })
            if (cursor == null) {
                res.status(404).json({"0": "Den not found"});
            } else {
                const ret = {
                    "den": req.query.den,
                    "ability": cursor.ability
                }
                await client.set(req.query.den, JSON.stringify(ret), "EX", 60 * 20)
                res.status(200).json(ret);
            }
        }
    })
})

module.exports = router;
