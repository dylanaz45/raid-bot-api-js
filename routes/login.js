const router = require("express").Router();
const {MongoConnection} = require("../common/utils");
const jwt = require("jsonwebtoken");

MongoConnection.connectToMongo();

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
            res.status(200).json({msg: "Access denied"});
        }
    })
})

module.exports = router;