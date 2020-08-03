require('dotenv').config();
const router = require("express").Router();
const {MongoConnection} = require("../common/utils");
const jwt = require("jsonwebtoken");

MongoConnection.connectToMongo();

router.get('/', (req, res) => {
    const token = req.query.token;
    jwt.verify(token, process.env.JWT_SECRET, function (err){
        if (!err) {
            const collection = MongoConnection.db.collection('den_info')
            const cursor = collection.findOne({den: req.query.den});
            cursor.then(document => {
                if (document != null) {
                    res.status(200).json({"den": req.query.den, "ability": document.ability});
                } else {
                    res.status(200).json({"0": "Den not found"});
                }
            })
        } else {
            res.status(200).json({access: "denied"})
        }
    })
})

module.exports = router;