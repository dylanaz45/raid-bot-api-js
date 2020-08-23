const router = require("express").Router();

/**
 * Route: /
 * Endpoint: GET /
 * The index of the application
 */
router.get('/', (req, res) => {
    res.status(200).json({msg: 'Connected'})
})

module.exports = router;
