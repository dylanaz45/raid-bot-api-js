require('dotenv').config();
const router = require("express").Router();
const {MongoConnection} = require("../common/utils");
const jwt = require("jsonwebtoken");
const client = require("redis").createClient(process.env.REDIS_URL);

MongoConnection.connectToMongo();

/**
 * Route: /set
 * Endpoint: GET /set
 * URL Parameters: token (JSON Web Token used for authentication), name (the name of a Pokemon),
 *                 tier (the Smogon tier to check), size (to either response with one set or all available sets)
 * Sends a Smogon set for the specified tier. Will either send one or all sets
 *
 * Verifies the JWT then checks the Redis cache to see if sets for the specified Pokemon and tier is available. If not,
 * a query is made to the MongoDB database. If a Pokemon set for the specified tier exists, all the sets for that
 * Pokemon are saved to the cache. Random sets can be sent when the name parameter is set to random
 */
router.get('/', (req, res) => {
    const token = req.query.token;
    jwt.verify(token, process.env.JWT_SECRET, function (err){
        if (!err) {
            client.get(req.query.name.toTitleCase() + '-sets' + req.query.tier + req.query.gen, (err, result) => {
                if (result) {
                    result = JSON.parse(result)

                    if (req.query.size === "one") {
                        let keys = Object.keys(result)
                        res.status(200).json(result[keys[keys.length * Math.random() << 0]]);
                    }
                    else if (req.query.size === "all") {
                        res.status(200).json(result);
                    }
                }
                else {
                    const collection = MongoConnection.db.collection('gen' + req.query.gen + req.query.tier)
                    if (req.query.name.toTitleCase() === "Random") {
                        const cursor = collection.aggregate([{$sample: {size: 1}}])
                        cursor.toArray((err, document) =>{
                            res.status(200).json(document[0])
                        })
                    }
                    else {
                        const cursor = collection.find({name: req.query.name.toTitleCase()})
                        const promise = cursor.toArray();

                        promise.then(sets => {
                            if (sets.length > 0) {
                                const ret = {}
                                sets.forEach((item, index) => {
                                    ret[index + 1] = item;
                                })

                                client.set(req.query.name.toTitleCase() + '-sets' + req.query.tier + req.query.gen, JSON.stringify(ret), "EX", 60 * 60, (err, result) => {
                                    if (result) {
                                        if (req.query.size === "one") {
                                            const keys = Object.keys(ret)
                                            res.status(200).json(ret[keys[keys.length * Math.random() << 0]])
                                        }
                                        else if (req.query.size === "all") {
                                            res.status(200).json(ret)
                                        }
                                    }
                                    else {
                                        console.log(err)
                                    }
                                })
                            }
                            else {
                                res.status(404).json({"0": "Pokemon not found"});
                            }
                        })
                    }
                }
            })
        }
        else {
            res.status(401).send("Unauthorized")
        }
    })
})

/**
 * Route: /set
 * Endpoint: POST /set
 * URL Parameters: token (JSON Web Token used for authentication)
 *
 *
 */
router.post('/', (req, res) => {
   const token = req.query.token;
   jwt.verify(token, process.env.JWT_SECRET, (err) => {
       if (!err) {
           const collection = MongoConnection.db.collection('gen8')
           collection.insertMany(req.body, (err, result) => {
               if (result) {
                   res.status(200).json({"count": req.body.length})
               }
               else {
                   res.status(500)
               }
           })
       }
       else {
           res.status(401).send("Unauthorized")
       }
   })
})

module.exports = router;
