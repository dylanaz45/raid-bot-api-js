require('dotenv').config();
const router = require("express").Router();
const {MongoConnection} = require("../common/utils");
const jwt = require("jsonwebtoken");

MongoConnection.connectToMongo();

router.post('/', (req, res) => {
    const token = req.query.token;
    jwt.verify(token, process.env.JWT_SECRET, function (err){
        if (!err) {
            const collection = MongoConnection.db.collection('raids')
            const cursor = collection.findOne({_id: req.query._id});
            cursor.then(document => {
                if (document == null) {
                    const post = {
                        _id: req.query._id,
                        name: req.query.name,
                        date: new Date(),
                        den: req.query.den
                    };
                    collection.insertOne(post);
                    res.status(200).json({"1": "Success"});
                } else {
                    res.status(200).json({"0": "Pre-existing raid exists"});
                }
            })
        } else {
            res.status(200).json({access: "denied"})
        }
    })
})

module.exports = router;