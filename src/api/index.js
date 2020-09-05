const router = require("express").Router();

/**
 * Route: /
 * Endpoint: GET /
 * The index of the application
 */
router.get('/', (req, res) => {
    res.status(200).send('Connected')
})

module.exports = router;
