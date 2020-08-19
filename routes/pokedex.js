const router = require("express").Router();
const jwt = require("jsonwebtoken");
const dex = require("../data/pokedex")

router.get("/", (req, res) => {
    const token = req.query.token;
    jwt.verify(token, process.env.JWT_SECRET, (err) => {
        if (!err) {
            const poke = dex.BattlePokedex[req.query.name]
            if (typeof poke === 'undefined') {
                res.status(404).send({"0": "Pokemon does not exist"})
            } else {
                const ret = {
                    num: poke.num,
                    species: poke.species,
                    types: poke.types,
                    stats: poke.baseStats,
                    abilities: poke.abilities
                }
                if (poke.otherFormes !== 'undefined') {
                    ret['otherForms'] = poke.otherFormes
                }
                res.status(200).send(ret)
            }
        } else {
            res.status(401).send("Unauthorized")
        }
    })
})

module.exports = router
