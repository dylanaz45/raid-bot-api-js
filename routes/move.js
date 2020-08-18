const router = require("express").Router();
const jwt = require("jsonwebtoken");
const moves = require("../data/moves")

router.get("/", (req, res) => {
    const token = req.query.token;
    jwt.verify(token, process.env.JWT_SECRET, (err) => {
        if (!err) {
            const move = moves.BattleMovedex[req.query.name]
            if (typeof move === 'undefined') {
                res.status(200).send({"0": "Undefined"})
            } else {
                const ret = {name: move.name,
                    shortDesc: move.shortDesc,
                    category: move.category,
                    power: move.basePower,
                    accuracy: move.accuracy,
                    type: move.type,
                    priority: move.priority
                }
                if (typeof move.desc != 'undefined') {
                    ret['desc'] = move.desc
                }
                res.status(200).send(ret)
            }
        } else {
            res.status(401).send("Unauthorized")
        }
    })
})

module.exports = router
