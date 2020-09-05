const UsersCtrl = require("../dao/usersDAO")

class Users {
    static async getAPIToken(req, res) {
        try {
            let input = {
                user: req.query.user,
                id: req.query.id
            }
            let ret = await UsersCtrl.getUser(req.app.locals.db, input)
            if (ret) {
                res.status(200).send(ret)
            } else {
                res.status(401).send("Unauthorized")
            }
        } catch (err) {
            console.log(err)
            res.status(500).json(err)
        }
    }
}

module.exports = Users
