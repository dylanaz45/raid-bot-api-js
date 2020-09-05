const jwt = require("jsonwebtoken");

function verifyToken(token) {
    try {
        jwt.verify(token, process.env.JWT_SECRET)
        return true
    } catch (err) {
        return false
    }
}

module.exports.verifyToken = verifyToken
