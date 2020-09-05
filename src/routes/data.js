const router = require("express").Router();
const jwt = require("jsonwebtoken");
const abilities = require("../data/abilities");
const items = require("../data/items");
const moves = require("../data/moves");
const dex = require("../data/pokedex");

function getData(name) {
    if (name in abilities.BattleAbilities) {
        let ability = abilities.BattleAbilities[name]
        return {
            dataType: "ability",
            name: ability.name,
            desc: typeof ability.desc == 'undefined' ? ability.shortDesc : ability.desc,
            rating: ability.rating
        }
    } else if (name in items.BattleItems) {
        let item = items.BattleItems[name]
        return {
            dataType: "item",
            name: item.name,
            desc: item.desc
        }
    } else if (name in moves.BattleMovedex) {
        let move = moves.BattleMovedex[name]
        return {
            dataType: "move",
            name: move.name,
            shortDesc: move.shortDesc,
            category: move.category,
            power: move.basePower,
            accuracy: move.accuracy,
            type: move.type,
            priority: move.priority,
            desc: move.desc !== 'undefined' ? move.desc : undefined
        }
    } else if (name in dex.BattlePokedex) {
        let poke = dex.BattlePokedex[name]
        return {
            dataType: "pokemon",
            num: poke.num,
                species: poke.species,
            types: poke.types,
            stats: poke.baseStats,
            abilities: poke.abilities,
            otherForms: poke.otherFormes !== 'undefined' ? poke.otherFormes : undefined
        }
    } else {
        return undefined
    }
}

/**
 * Route: /data
 * Endpoint: GET /data
 * URL Parameters: token (JSON Web Token used for authentication)
 *                 name (Pokemon name, ability, item, or move)
 * Sends Pokemon related information about the requested object
 */
router.get("/", (req, res) => {
    const token = req.query.token;
    try {
        jwt.verify(token, process.env.JWT_SECRET)
    } catch (err) {
        res.status(401).send("Unauthorized")
        return
    }


    const ret = getData(req.query.name)
    if (typeof ret === 'undefined') {
        res.status(404).send({"0": req.query.name + " does not exist"})
    } else {
        res.status(200).send(ret)
    }
})

module.exports = router
