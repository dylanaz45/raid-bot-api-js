const jwt = require("../common/verify")
const PokemonDAO = require("../dao/pokemonDAO")
require("../common/toTitle");

let tiersStats = [
    'battlestadiumsingles',
    'doublesou',
    'doublesubers',
    'doublesuu',
    'lc',
    'monotype',
    'nu',
    'ou',
    'pu',
    'ru',
    'ubers',
    'uu',
    'vgc'
]
tiersStats = new Set(tiersStats)

let tiersSets = [
    '1v1',
    'battlestadiumsingles',
    'doublesou',
    'lc',
    'monotype',
    'nationaldex',
    'nu',
    'ou',
    'pu',
    'ru',
    'ubers',
    'uu',
    'vgc2020',
    'zu',
    ''
]

tiersSets = new Set(tiersSets)

class Pokemon {
    /**
     * Route: /api/pokemon/den_info
     * Endpoint: GET /api/pokemon/den_info
     * URL Parameters: token (JSON Web Token used for authentication), den (a Pokemon Sword and Shield den)
     * Sends the ability for a specified den
     */
    static async denInfo(req, res) {
        if (jwt.verifyToken(req.query.token) === false) {
            res.status(401).send("Unauthorized")
            return
        }

        try {
            let ret = await PokemonDAO.getDenInfo(req.app.locals.db, req.query.den)
            if (ret) {
                res.status(200).json(ret);
            } else {
                res.status(404).json({"0": "Den not found"});
            }
        } catch (err) {
            console.log(err)
            res.status(500).json(err)
        }
    }

    /**
     * Route: /api/pokemon/den_poke
     * Endpoint: GET /api/pokemon/den_poke
     * URL Parameters: token (JSON Web Token used for authentication), poke (a Pokemon that can be found in Sword and Shield)
     * Sends a list of dens that the Pokemon can be found in
     */
    static async denPoke(req, res) {
        if (jwt.verifyToken(req.query.token) === false) {
            res.status(401).send("Unauthorized")
            return
        }

        try {
            let ret = await PokemonDAO.getPokemonInfo(req.app.locals.db, req.query.name.toTitleCase())
            if (ret) {
                res.status(200).json(ret);
            } else {
                res.status(404).json({"0": "Pokemon does not exist"});
            }
        } catch (err) {
            console.log(err)
            res.status(500).json(err)
        }
    }

    /**
     * Route: /api/pokemon/sprite
     * Endpoint: GET /api/pokemon/sprite
     * URL Parameters: token (JSON Web Token used for authentication), name (the name of a Pokemon)
     * Sends a list of dens that the Pokemon can be found in
     */
    static async sprite(req, res) {
        if (jwt.verifyToken(req.query.token) === false) {
            res.status(401).send("Unauthorized")
            return
        }

        try {
            let ret = await PokemonDAO.getSprite(req.app.locals.db, req.query.name.toTitleCase())
            if (ret) {
                res.status(200).json(ret);
            } else {
                res.status(404).json({"0": "Pokemon does not exist"});
            }
        } catch (err) {
            console.log(err)
            res.status(500).json(err)
        }
    }

    /**
     * Route: /api/pokemon/data
     * Endpoint: GET /api/pokemon/data
     * URL Parameters: token (JSON Web Token used for authentication)
     *                 name (Pokemon name, ability, item, or move)
     * Sends Pokemon related information about the requested object
     */
    static async data(req, res) {
        if (jwt.verifyToken(req.query.token) === false) {
            res.status(401).send("Unauthorized")
            return
        }

        let ret = await PokemonDAO.getData(req.query.name.toLowerCase())
        if (ret) {
            res.status(200).json(ret)
        } else {
            res.status(404).json({"0": "Requested item does not exist"});
        }
    }

    /**
     * Route: /api/pokemon/set
     * Endpoint: GET /api/pokemon/set
     * URL Parameters: token (JSON Web Token used for authentication),
     *                 name (the name of a Pokemon),
     *                 tier (the Smogon tier to check),
     *                 gen (the generation for the Pokemon; only 7 and 8 are allowed)
     *                 size (to either response with one set or all available sets)
     * Sends a Smogon set for the specified tier and generation. Will either send one or all sets
     *
     * Verifies the JWT then checks the Redis cache to see if sets for the specified Pokemon and tier is available. If not,
     * a query is made to the MongoDB database. If a Pokemon set for the specified tier exists, all the sets for that
     * Pokemon are saved to the cache. Random sets can be sent when the name parameter is set to random
     */
    static async set(req, res) {
        if (jwt.verifyToken(req.query.token) === false) {
            res.status(401).send("Unauthorized")
            return
        }

        let input = {
            gen: parseInt(req.query.gen) || 8,
            tier: req.query.tier || '',
            all: parseInt(req.query.all) || 0
        }

        try {
            let ret
            if (req.query.name) {
                input['name'] = req.query.name.toTitleCase()
                ret = await PokemonDAO.getSetByName(req.app.locals.db, input)
            } else {
                ret = await PokemonDAO.getRandomSet(req.app.locals.db, input)
            }
            if (ret) {
                res.status(200).json(ret)
            } else {
                res.status(404).json({"0": "Pokemon not found"});
            }
        } catch (err) {
            console.log(err)
            res.status(500).json(err)
        }
    }

    /**
     * Route: /api/pokemon/set
     * Endpoint: POST /api/pokemon/set
     * URL Parameters: token (JSON Web Token used for authentication)
     *
     * Inserts Showdown/Smogon sets of Pokemon into a MongoDB collection. This is intended to be used by my poke-insert
     * script in my pokepaste-parser GitHub repo
     */
    static async insertSets(req, res) {
        if (jwt.verifyToken(req.query.token) === false) {
            res.status(401).send("Unauthorized")
            return
        }

        try {
            let ret = await PokemonDAO.insertSets(req.app.locals.db, req.body)
            res.status(200).json({"count": ret})
        } catch (err) {
            console.log(err)
            res.status(500).json(err)
        }
    }

    static async searchSets(req, res) {

    }

    static async buildTeam(req, res) {
        if (jwt.verifyToken(req.query.token) === false) {
            res.status(401).send("Unauthorized")
            return
        }

        let input = {}
        let hasTier = false
        if (typeof req.query.tier === 'string' || req.query.tier instanceof String) {
            if (tiersSets.has(req.query.tier.toLowerCase())) {
                input.tier = req.query.tier.toLowerCase()
                hasTier = true
            }
        }
        if (!hasTier) {
            input.tier = ''
        }
        input.filter = req.query.filter || ''

        try {
            let team;
            if (input.filter.toLowerCase() === 'tr') {
                team = await PokemonDAO.getRandomTRTeam(req.app.locals.db, input)
            } else {
                team = await PokemonDAO.getRandomTeam(req.app.locals.db, input)
            }
            res.status(200).json(team)
        } catch (err) {
            console.log(err)
            res.status(500).json(err)
        }
    }

    /**
     * Route: /api/pokemon/stats
     * Endpoint: GET /api/pokemon/stats
     * URL Parameters: token (JSON Web Token used for authentication),
     *                 name (the name of a Pokemon),
     *                 tier (the Smogon tier to check)
     * If a Pokemon name is provided, the server sends statistics about the Pokemon if the
     * Pokemon is valid
     */
    static async stats(req, res) {
        if (jwt.verifyToken(req.query.token) === false) {
            res.status(401).send("Unauthorized")
            return
        }

        let input = {}
        let hasTier = false
        if (typeof req.query.tier === 'string' || req.query.tier instanceof String) {
            if (tiersStats.has(req.query.tier.toLowerCase())) {
                input.tier = req.query.tier.toLowerCase()
                hasTier = true
            }
        }
        if (!hasTier) {
            input.tier = 'vgc'
        }
        if (typeof req.query.name === 'string' || req.query.name instanceof String) {
            input.name = req.query.name.toTitleCase()
        } else {
            input.name = 'Porygon-Z'
        }

        try {
            let ret = await PokemonDAO.getPokemonStats(req.app.locals.db, input)
            if (ret) {
                res.status(200).json(ret)
            } else {
                res.status(404).json({"0": "Pokemon not found"});
            }
        } catch (err) {
            console.log(err)
            res.status(500).json(err)
        }
    }

    static async searchStats(req, res) {

    }

    static async statRankings(req, res) {
        if (jwt.verifyToken(req.query.token) === false) {
            res.status(401).send("Unauthorized")
            return
        }

        let input = {}
        let hasTier = false
        if (typeof req.query.tier === 'string' || req.query.tier instanceof String) {
            if (tiersStats.has(req.query.tier.toLowerCase())) {
                input.tier = req.query.tier.toLowerCase()
                hasTier = true
            }
        }
        if (!hasTier) {
            input.tier = 'vgc'
        }
        input.rank = parseInt(req.query.rank) || 0

        try {
            let ret
            if (input.rank) {
                ret = await PokemonDAO.getRankX(req.app.locals.db, input)
            } else {
                ret = await PokemonDAO.getRankings(req.app.locals.db, input)
            }
            res.status(200).json(ret)
        } catch (err) {
            console.log(err)
            res.status(500).json(ret)
        }
    }
}

module.exports = Pokemon
