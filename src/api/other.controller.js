const jwt = require("../common/verify")
const OtherCtrl = require("../dao/otherDAO")

class Other {
    /**
     * Route: /api/other/dadjoke
     * Endpoint: GET /api/other/dadjoke
     * URL Parameters: token (JSON Web Token used for authentication)
     * Sends a random dad joke
     */
    static async dadJoke(req, res) {
        if (jwt.verifyToken(req.query.token) === false) {
            res.status(401).send("Unauthorized")
            return
        }

        try {
            let ret = await OtherCtrl.getRandomJoke(req.app.locals.db)
            res.status(200).json(ret)
        } catch (err) {
            console.log(err)
            res.status(500).json(ret)
        }
    }

    /**
     * Route: /api/other/quote
     * Endpoint: GET /api/other/quote
     * URL Parameters: token (JSON Web Token used for authentication)
     * Sends a random quote
     */
    static async quote(req, res) {
        if (jwt.verifyToken(req.query.token) === false) {
            res.status(401).send("Unauthorized")
            return
        }

        try {
            let ret = await OtherCtrl.getRandomQuote(req.app.locals.db)
            res.status(200).json(ret)
        } catch (err) {
            console.log(err)
            res.status(500).json(ret)
        }
    }
}

module.exports = Other
