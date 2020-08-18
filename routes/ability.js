const router = require("express").Router();
const jwt = require("jsonwebtoken");
const abilities = require("../data/abilities")

router.get("/", (req, res) => {
    const token = req.query.token;
    jwt.verify(token, process.env.JWT_SECRET, (err) => {
        if (!err) {
            const ability = abilities.BattleAbilities[req.query.name]
            if (typeof ability === 'undefined') {
                res.status(200).send({"0": "Undefined"})
            } else {
                const ret = {}
                ret['name'] = ability.name
                if (typeof ability.desc === 'undefined') {
                    ret['desc'] = ability.shortDesc
                } else {
                    ret['desc'] = ability.desc
                }
                ret['rating'] = ability.rating
                res.status(200).send(ret)
            }
        } else {
            res.status(401).send("Unauthorized")
        }
    })
})

module.exports = router
