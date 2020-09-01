require('dotenv').config();
const router = require("express").Router();
const {MongoConnection} = require("../common/utils");
const jwt = require("jsonwebtoken");
const client = require("redis").createClient(process.env.REDIS_URL);
require("../common/toTitle");

MongoConnection.connectToMongo();

/**
 * Route: /sprite
 * Endpoint: GET /sprite
 * URL Parameters: token (JSON Web Token used for authentication), name (the name of a Pokemon)
 * Sends a list of dens that the Pokemon can be found in
 */
router.get('/', (req, res) => {
    const token = req.query.token;
    jwt.verify(token, process.env.JWT_SECRET, function (errJWT){
        if (!errJWT) {
            client.get(req.query.name.toTitleCase() + "-sprite", (errRedis, resultRedis) => {
                if (resultRedis) {
                    res.status(200).json({"id": resultRedis});
                } else {
                    const collection = MongoConnection.db.collection('catch')
                    const cursor = collection.findOne({name: req.query.name.toTitleCase()});

                    cursor.then(document => {
                        if (document != null) {
                            client.set(req.query.name.toTitleCase() + "-sprite", document.id, "EX", 60 * 20, (err, result) => {
                                if (result) {
                                    res.status(200).json({"id": document.id});
                                } else {
                                    console.log(err)
                                }
                            })
                        } else {
                            res.status(404).json({"0": "Pokemon does not exist"});
                        }
                    })
                }
            })
        } else {
            res.status(401).send("Unauthorized")
        }
    })
})

module.exports = router;
