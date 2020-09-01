require('dotenv').config();
const router = require("express").Router();
const {MongoConnection} = require("../common/utils");
const jwt = require("jsonwebtoken");
const client = require("redis").createClient(process.env.REDIS_URL);

MongoConnection.connectToMongo();

/**
 * Route: /stats
 * Endpoint: GET /stats
 * URL Parameters: token (JSON Web Token used for authentication),
 *                 name (the name of a Pokemon),
 *                 tier (the Smogon tier to check)
 *
 * Tiers include [vgc, ubers, ou, uu, uu, ru, nu, pu, lc, monotype, doublesou, doublesuu, doublesubers, battlestadiumsingles]
 * Sends a Smogon set for the specified tier and generation. Will either send one or all sets
 *
 * A Smogon tier is required. If an empty name is provided, the MongoDB collection is queried to obtain the 50 top
 * Pokemon for the specified tier. If a Pokemon name is provided, the server sends statistics about the Pokemon if the
 * Pokemon is valid
 */
router.get('/', (req, res) => {
    const token = req.query.token;
    jwt.verify(token, process.env.JWT_SECRET, function (errJWT){
        if (!errJWT) {
            if (req.query.name === '') {
                client.get("-tier" + req.query.tier, (errRedis, resultRedis) => {
                    if (resultRedis) {
                        resultRedis = JSON.parse(resultRedis);
                        res.status(200).json(resultRedis);
                    } else {
                        const collection = MongoConnection.db.collection("statsgen8" + req.query.tier)
                        let pipeline = [
                            {
                                '$sort': {
                                    'usage': -1
                                }
                            }, {
                                '$limit': 50
                            }, {
                                '$project': {
                                    '_id': 0
                                }
                            }
                        ]
                        const cursor = collection.aggregate(pipeline)

                        cursor.toArray((err, documents) => {
                            client.set("-tier" + req.query.tier, JSON.stringify(documents), "EX", 60 * 60, (errSet, resultSet) => {
                                if (resultSet) {
                                    res.status(200).json(documents);
                                } else {
                                    console.log(errSet);
                                }
                            })
                        })
                    }
                })
            } else {
                client.get(req.query.name.toTitleCase() + "-tier" + req.query.tier, (errRedis, resultRedis) => {
                    if (resultRedis) {
                        resultRedis = JSON.parse(resultRedis);
                        res.status(200).json(resultRedis)
                    } else {
                        const collection = MongoConnection.db.collection("statsgen8" + req.query.tier)
                        let pipeline = [
                            {
                                '$match': {
                                    'name': req.query.name.toTitleCase()
                                }
                            }, {
                                '$project': {
                                    '_id': 0
                                }
                            }
                        ]
                        const cursor = collection.aggregate(pipeline)
                        const promise = cursor.toArray();

                        promise.then(document => {
                            if (document.length === 1) {
                                client.set(req.query.name.toTitleCase() + "-tier" + req.query.tier, JSON.stringify(document[0]), "EX", 60 * 60, (errSet, resultSet) => {
                                    if (resultSet) {
                                        res.status(200).json(document[0]);
                                    } else {
                                        console.log(errSet);
                                    }
                                })
                            } else {
                                res.status(404).send("Pokemon could not be found.")
                            }
                        })
                    }
                })
            }
        }
        else {
            res.status(401).send("Unauthorized")
        }
    })
})

module.exports = router;
