require('dotenv').config();
const router = require("express").Router();
const {MongoConnection} = require("../common/utils");
const jwt = require("jsonwebtoken");

MongoConnection.connectToMongo();

router.get('/', (req, res) => {
    const token = req.query.token;
    jwt.verify(token, process.env.JWT_SECRET, function (err){
        if (!err) {
            const collection = MongoConnection.db.collection('dad_jokes')
            const cursor = collection.aggregate([{$sample: {size: 1}}])

            cursor.toArray(function (err, document){
                res.status(200).json({joke: document[0].joke})
            })
        } else {
            res.status(200).json({access: "denied"})
        }
    })
})

module.exports = router;