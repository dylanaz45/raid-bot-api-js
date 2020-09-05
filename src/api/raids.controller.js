const jwt = require("../common/verify")
const RaidDAO = require("../dao/raidsDAO")

class Raids {
    /**
     * Route: /sprite
     * Endpoint: GET /sprite
     * URL Parameters: token (JSON Web Token used for authentication), name (the name of a Pokemon)
     * Sends a list of dens that the Pokemon can be found in
     */
    static async start(req, res) {
        if (jwt.verifyToken(req.query.token) === false) {
            res.status(401).send("Unauthorized")
            return
        }

        try {
            let ret = await RaidDAO.startRaid(req.app.locals.db, req.query)
            if (ret) {
                res.status(200).json({"1": "Success"})
            } else {
                res.status(200).json({"0": "Pre-existing raid exists"});
            }
        } catch (err) {
            console.log(err)
            res.status(500).json(err)
        }
    }

    /**
     * Route: /end
     * Endpoint: DELETE /end
     * URL Parameters: token (JSON Web Token used for authentication), _id (the ID of the user whose raid is to be terminated)
     * Deletes an existing raid if it exists
     */
    static async end(req, res) {
        if (jwt.verifyToken(req.query.token) === false) {
            res.status(401).send("Unauthorized")
            return
        }

        try {
            let ret = await RaidDAO.endRaid(req.app.locals.db, req.query._id)
            if (ret) {
                res.status(200).json({"1": "Success"})
            } else {
                res.status(200).json({"0": "Raid not found"});
            }
        } catch (err) {
            console.log(err)
            res.status(500).json(err)
        }
    }

    /**
     * Route: /active
     * Endpoint: GET /active
     * URL Parameters: token (JSON Web Token used for authentication)
     * Sends a list of active raids if any exist
     * Format: {<index>: [<_id>, <den>], ...}
     */
    static async active(req, res) {
        if (jwt.verifyToken(req.query.token) === false) {
            res.status(401).send("Unauthorized")
            return
        }

        try {
            let ret = await RaidDAO.getRaids(req.app.locals.db)
            if (!ret) {
                res.status(200).json({"0": "Raid not found"});
            } else {
                res.status(200).json(ret)
            }
        } catch (err) {
            console.log(err)
            res.status(500).json(err)
        }
    }
}

module.exports = Raids
