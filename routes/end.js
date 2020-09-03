require('dotenv').config();
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const logger = require("../common/log")

/**
 * Route: /end
 * Endpoint: DELETE /end
 * URL Parameters: token (JSON Web Token used for authentication), _id (the ID of the user whose raid is to be terminated)
 * Deletes an existing raid if it exists
 */
router.delete('/', async (req, res) => {
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
        res.status(200).json({"0": "Raid not found"});
    } else {
        await db.collection("raids").deleteOne({_id: req.query._id});
        res.status(200).json({"1": "Success"});
    }
})

module.exports = router;
