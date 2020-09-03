require('dotenv').config();
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const logger = require("../common/log")

/**
 * Route: /start
 * Endpoint: POST /start
 * URL Parameters: token (JSON Web Token used for authentication),
 *                 _id (the ID of the user who is registering raid),
 *                 name (the name of the user),
 *                 den (the den the user is hosting)
 * Inserts a document into the database, which allows the user to register their session
 */
router.post('/', async (req, res) => {
    const token = req.query.token;
    try {
        jwt.verify(token, process.env.JWT_SECRET)
    } catch (err) {
        res.status(401).send("Unauthorized")
        return
    }

    const db = req.app.locals.db;
    let cursor = await db.collection("raids").findOne({
        _id: req.query._id
    })

    if (cursor == null) {
        let post = {
            _id: req.query._id,
            name: req.query.name,
            date: new Date(),
            den: req.query.den
        };

        await db.collection("raids").insertOne(post);
        res.status(200).json({"1": "Success"})
    } else {
        res.status(200).json({"0": "Pre-existing raid exists"});
    }
})

module.exports = router;
