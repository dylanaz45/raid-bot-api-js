require('dotenv').config();
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const logger = require("../common/log")

/**
 * Route: /active
 * Endpoint: GET /active
 * URL Parameters: token (JSON Web Token used for authentication)
 * Sends a list of active raids if any exist
 * Format: {<index>: [<_id>, <den>], ...}
 */
router.get('/', async (req, res) => {
    const token = req.query.token;
    try {
        jwt.verify(token, process.env.JWT_SECRET)
    } catch (err) {
        res.status(401).send("Unauthorized")
        return
    }

    const db = req.app.locals.db;
    const cursor = db.collection("raids").find();
    cursor.toArray()
        .then(raids => {
            if (raids.length > 0) {
                const ret = {}
                raids.forEach((item, index) => {
                    ret[index + 1] = [item._id, item.den];
                })
                res.status(200).json(ret);
            } else {
                res.status(200).json({"0": "No active raids"});
            }
        })
})

module.exports = router;
