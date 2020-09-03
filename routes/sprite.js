require('dotenv').config();
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const logger = require("../common/log")
const client = require("redis").createClient(process.env.REDIS_URL);
require("../common/toTitle");

/**
 * Route: /sprite
 * Endpoint: GET /sprite
 * URL Parameters: token (JSON Web Token used for authentication), name (the name of a Pokemon)
 * Sends a list of dens that the Pokemon can be found in
 */
router.get('/', (req, res) => {
    const token = req.query.token;
    try {
        jwt.verify(token, process.env.JWT_SECRET)
    } catch (err) {
        res.status(401).send("Unauthorized")
        return
    }

    client.get(req.query.name.toTitleCase() + "-sprite", async (err, result) => {
        if (result) {
            res.status(200).json({"id": result});
        } else {
            const db = req.app.locals.db;
            let cursor = await db.collection("catch").findOne({
                name: req.query.name.toTitleCase()
            })
            if (cursor == null) {
                res.status(404).json({"0": "Pokemon does not exist"});
            } else {
                await client.set(req.query.name.toTitleCase() + "-sprite", cursor.id, "EX", 60 * 20)
                res.status(200).json({"id": cursor.id});
            }
        }
    })
})

module.exports = router;
