require('dotenv').config();
const router = require("express").Router();
const {MongoConnection} = require("../common/utils");
const jwt = require("jsonwebtoken");
const client = require("redis").createClient(process.env.REDIS_URL);
require("../common/toTitle");

MongoConnection.connectToMongo();

/**
 * Route: /den_poke
 * Endpoint: GET /den_poke
 * URL Parameters: token (JSON Web Token used for authentication), poke (a Pokemon that can be found in Sword and Shield)
 * Sends a list of dens that the Pokemon can be found in
 */
router.get('/', (req, res) => {
    const token = req.query.token;
    jwt.verify(token, process.env.JWT_SECRET, function (errJWT){
        if (!errJWT) {
            client.get(req.query.name.toTitleCase() + "-den", (errRedis, resultRedis) => {
                if (resultRedis) {
                    res.status(200).json(JSON.parse(resultRedis));
                } else {
                    const collection = MongoConnection.db.collection('den_poke')
                    const cursor = collection.findOne({name: req.query.name.toTitleCase()});

                    cursor.then(document => {
                        if (document != null) {
                            const ret = {
                                "name": document.name,
                                "id": document.id,
                                "swsh": document.swsh,
                                "sword": document.sword,
                                "shield": document.shield
                            }

                            client.set(req.query.name.toTitleCase() + "-den", JSON.stringify(ret), "EX", 60 * 20, (err, result) => {
                                if (result) {
                                    res.status(200).json(ret);
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
