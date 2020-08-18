require('dotenv').config();
const router = require("express").Router();
const {MongoConnection} = require("../common/utils");
const jwt = require("jsonwebtoken");

MongoConnection.connectToMongo();

/**
 * Route: /end
 * Endpoint: DELETE /end
 * URL Parameters: token (JSON Web Token used for authentication), _id (the ID of the user whose raid is to be terminated)
 * Deletes an existing raid if it exists
 */
router.delete('/', (req, res) => {
    const token = req.query.token;
    jwt.verify(token, process.env.JWT_SECRET, function (err){
        if (!err) {
            const collection = MongoConnection.db.collection('raids')
            const cursor = collection.findOne({_id: req.query._id});
            cursor.then(document => {
                if (document != null) {
                    collection.deleteOne({_id: req.query._id});
                    res.status(200).json({"1": "Success"});
                } else {
                    res.status(200).json({"0": "Raid not found"});
                }
            })
        } else {
            res.status(401).send("Unauthorized")
        }
    })
})

module.exports = router;
