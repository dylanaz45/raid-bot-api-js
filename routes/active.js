require('dotenv').config();
const router = require("express").Router();
const {MongoConnection} = require("../common/utils");
const jwt = require("jsonwebtoken");

MongoConnection.connectToMongo();

/**
 * Route: /active
 * Endpoint: GET /active
 * URL Parameters: token (JSON Web Token used for authentication)
 * Sends a list of active raids if any exist
 * Format: {<index>: [<_id>, <den>], ...}
 */
router.get('/', (req, res) => {
    const token = req.query.token;
    jwt.verify(token, process.env.JWT_SECRET, function (err){
        if (!err) {
            const collection = MongoConnection.db.collection('raids')
            const cursor = collection.find();

            const promise = cursor.toArray();
            promise.then(raids => {
                if (raids.length > 0) {
                const ret = {}
                raids.forEach((item, index) => {
                    ret[index + 1] = [item._id, item.den];
                })
                res.status(200).json(ret);
                } else {
                    res.status(200).json({"0": "No active raids"})
                }
            })
        } else {
            res.status(200).json({access: "denied"})
        }
    })
})

module.exports = router;