require('dotenv').config();
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const logger = require("../common/log")
const client = require("redis").createClient(process.env.REDIS_URL);
require("../common/toTitle");

/**
 * Route: /den_poke
 * Endpoint: GET /den_poke
 * URL Parameters: token (JSON Web Token used for authentication), poke (a Pokemon that can be found in Sword and Shield)
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

    client.get(req.query.name.toTitleCase() + "-den", async (err, result) => {
        if (result) {
            res.status(200).json(JSON.parse(result));
        } else {
            const db = req.app.locals.db;
            let cursor = await db.collection("den_poke").findOne({
                name: req.query.name.toTitleCase()
            })
            if (cursor == null) {
                res.status(404).json({"0": "Pokemon does not exist"});
            } else {
                const ret = {
                    "name": cursor.name,
                    "id": cursor.id,
                    "swsh": cursor.swsh,
                    "sword": cursor.sword,
                    "shield": cursor.shield
                }
                await client.set(req.query.name.toTitleCase() + "-den", JSON.stringify(ret))
                res.status(200).json(ret);
            }
        }
    })
})

module.exports = router;
