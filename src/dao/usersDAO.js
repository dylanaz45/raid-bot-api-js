const jwt = require("jsonwebtoken")

class UsersDAO {
    static async getUser(db, userInput) {
        let document = await db.collection("_users").findOne({
            user: userInput.user,
            id: userInput.id
        })
        if (!document) {
            return null
        } else {
            return jwt.sign({user: document.user}, document.id)
        }
    }
}

module.exports = UsersDAO
