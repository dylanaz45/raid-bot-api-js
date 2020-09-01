require('dotenv').config();
const router = require("express").Router();
const {MongoConnection} = require("../common/utils");
const jwt = require("jsonwebtoken");
const client = require("redis").createClient(process.env.REDIS_URL);

MongoConnection.connectToMongo();

// Counts the amount of keys in an Object
Object.size = function(obj) {
    let size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

/**
 * Route: /set
 * Endpoint: GET /set
 * URL Parameters: token (JSON Web Token used for authentication),
 *                 name (the name of a Pokemon),
 *                 tier (the Smogon tier to check),
 *                 gen (the generation for the Pokemon; only 7 and 8 are allowed)
 *                 size (to either response with one set or all available sets)
 * Sends a Smogon set for the specified tier and generation. Will either send one or all sets
 *
 * Verifies the JWT then checks the Redis cache to see if sets for the specified Pokemon and tier is available. If not,
 * a query is made to the MongoDB database. If a Pokemon set for the specified tier exists, all the sets for that
 * Pokemon are saved to the cache. Random sets can be sent when the name parameter is set to random
 */
router.get('/', (req, res) => {
    const token = req.query.token;
    jwt.verify(token, process.env.JWT_SECRET, function (errJWT){
        if (!errJWT) {
            client.get(req.query.name.toTitleCase() + '-sets' + req.query.tier + req.query.gen, (errReds, resultRedis) => {
                if (resultRedis) {
                    resultRedis = JSON.parse(resultRedis)

                    if (req.query.size === "one") {
                        let keys = Object.keys(resultRedis)
                        res.status(200).json(resultRedis[keys[keys.length * Math.random() << 0]]);
                    }
                    else if (req.query.size === "all") {
                        res.status(200).json(resultRedis);
                    }
                }
                else {
                    const collection = MongoConnection.db.collection('gen' + req.query.gen + req.query.tier)

                    if (req.query.name.toTitleCase() === "Random") {
                        let pipeline = [
                            {
                                '$sample': {
                                    'size': 1
                                }
                            }, {
                                '$project': {
                                    '_id': 0
                                }
                            }
                        ]
                        const cursor = collection.aggregate(pipeline)
                        cursor.toArray((err, document) =>{
                            res.status(200).json(document[0])
                        })
                    }
                    else {
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
 * Inserts Showdown/Smogon sets of Pokemon into a MongoDB collection. This is intended to be used by my poke-insert
 * script in my pokepaste-parser GitHub repo
 */
router.post('/', (req, res) => {
   const token = req.query.token;
   jwt.verify(token, process.env.JWT_SECRET, (errJWT) => {
       if (!errJWT) {
           const collection = MongoConnection.db.collection('gen8')
           collection.insertMany(req.body, (errDB, resultDB) => {
               if (resultDB) {
                   // Updates the cache for a Pokemon if the cached data is now outdated
                   req.body.forEach(set => {
                       client.get(set['name'] + '-sets8', (errRedis, resultRedis) => {
                           if (resultRedis) {
                               resultRedis = JSON.parse(resultRedis)
                               resultRedis[Object.size(resultRedis) + 1] = set

                               client.set(set['name'] + '-sets8', JSON.stringify(resultRedis), "EX", 60 * 60, (err3, result3) => {
                                   if (result3) {
                                       //pass
                                   }
                               })
                           }
                       })
                   })
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
