const router = require("express").Router();
const jwt = require("jsonwebtoken");
const items = require("../data/items")

router.get("/", (req, res) => {
    const token = req.query.token;
    jwt.verify(token, process.env.JWT_SECRET, (err) => {
        if (!err) {
            const item = items.BattleItems[req.query.name]
            if (typeof item === 'undefined') {
                res.status(200).send({"0": "Undefined"})
            } else {
                res.status(200).send({name: item.name, desc: item.desc})
            }
        } else {
            res.status(401).send("Unauthorized")
        }
    })
})

module.exports = router
