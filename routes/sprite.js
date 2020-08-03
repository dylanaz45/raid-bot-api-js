require('dotenv').config();
const router = require("express").Router();
const {MongoConnection} = require("../common/utils");
const jwt = require("jsonwebtoken");
require("../common/toTitle");

MongoConnection.connectToMongo();

router.get('/', (req, res) => {
    const token = req.query.token;
    jwt.verify(token, process.env.JWT_SECRET, function (err){
        if (!err) {
            const collection = MongoConnection.db.collection('catch')
            const cursor = collection.findOne({name: req.query.name.toTitleCase()});
            cursor.then(document => {
                if (document != null) {
                    res.status(200).json({"id": document.id});
                } else {
                    res.status(200).json({"0": "Pokemon does not exist"});
                }
            })
        } else {
            res.status(200).json({access: "denied"})
        }
    })
})

module.exports = router;