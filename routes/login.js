const router = require("express").Router();
const jwt = require("jsonwebtoken");

/**
 * Route: /login
 * Endpoint: GET /login
 * URL Parameters: user, id
 * Sends a JSON Web Token if the credentials exist in the database
 */
router.get('/', async (req, res) => {
    const db = req.app.locals.db.collection('_users')
    const user = req.query.user;
    const id = req.query.id;
    const cursor = await db.findOne({
        user: user,
        id: id
    });
    if (cursor == null) {
        res.status(401).send("Unauthorized")
    } else {
        const token = jwt.sign({user: document.user}, document.id)
        res.status(200).json({msg: token});
    }
})

module.exports = router;
