const router = require("express").Router();
const {MongoConnection} = require("../common/utils");
const jwt = require("jsonwebtoken");

MongoConnection.connectToMongo();

/**
 * Route: /login
 * Endpoint: GET /login
 * URL Parameters: user, id
 * Sends a JSON Web Token if the credentials exist in the database
 */
router.get('/', (req, res) => {
    const collection = MongoConnection.db.collection('_users')
    const user = req.query.user;
    const id = req.query.id;
    const cursor = collection.findOne({user: user, id: id});

    cursor.then(document => {
        if (document != null) {
            const token = jwt.sign({user: document.user}, document.id)
            res.status(200).json({msg: token});
        } else {
            res.status(401).send("Unauthorized")
        }
    })
})

module.exports = router;
