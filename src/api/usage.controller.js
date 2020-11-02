const UsageDAO = require("../dao/usageDAO")

class UsageCtrl {
    /**
     * Route: /usage/rankings/:year/:month/:tier/:tier_rank/
     * Example: /usage/rankings/2020/08/gen8vgc2020/1760
     * Endpoint: GET /rankings
     * Send the Smogon usage rankings for the specified year, month, tier, and tier rank
     */
    static async rankings(req, res) {
        req.params.tier = req.params.tier.toLowerCase()
        try {
            let ret = await UsageDAO.getRankings(req.app.locals.db_stats, req.params)
            if (ret) {
                res.status(200).json(ret)
            } else {
                let error = {
                    'error': "Request could not be fulfilled with the following parameters",
                    'params': req.params
                }
                res.status(404).json(error);
            }
        } catch (err) {
            console.log(err)
            res.status(500).send("Server error. Please try again later.")
        }
    }

    /**
     * Route: /usage/recent/:tier/:pokemon
     * Example: /usage/recent/gen8vgc2020/Togekiss
     * Endpoint: GET /recent
     * Send the Smogon usage stats of the Pokemon for the specified tier. Stats will be the most recent and the top
     * rank in the tier
     */
    static async recent(req, res) {
        req.params.tier = req.params.tier.toLowerCase()
        req.params.pokemon = req.params.pokemon.toTitleCase()

        if (req.params.tier === "gen8ou" || req.params.tier === "gen8doublesou") {
            req.params.tier_rank = "1825"
        } else {
            req.params.tier_rank = "1760"
        }
        req.params.year = "2020"
        req.params.month = "10"

        try {
            let ret = await UsageDAO.getStats(req.app.locals.db_stats, req.params)
            if (ret) {
                res.status(200).json(ret)
            } else {
                let error = {
                    'error': "Request could not be fulfilled with the following parameters",
                    'params': req.params
                }
                res.status(404).json(error);
            }
        } catch (err) {
            console.log(err)
            res.status(500).send("Server error. Please try again later.")
        }
    }

    /**
     * Route: /usage/stats/:year/:month/:tier/:tier_rank/:pokemon
     * Example: /usage/stats/2020/08/gen8vgc2020/1760/Togekiss
     * Endpoint: GET /stats
     * Send the Smogon usage stats of the Pokemon for the specified year, month, tier, and tier rank
     */
    static async stats(req, res) {
        req.params.tier = req.params.tier.toLowerCase()
        req.params.pokemon = req.params.pokemon.toTitleCase()
        try {
            let ret = await UsageDAO.getStats(req.app.locals.db_stats, req.params)
            if (ret) {
                res.status(200).json(ret)
            } else {
                let error = {
                    'error': "Request could not be fulfilled with the following parameters",
                    'params': req.params
                }
                res.status(404).json(error);
            }
        } catch (err) {
            console.log(err)
            res.status(500).send("Server error. Please try again later.")
        }
    }
}

module.exports = UsageCtrl
