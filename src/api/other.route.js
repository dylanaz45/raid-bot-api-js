const router = require("express").Router();
const otherCtrl = require("./other.controller")

router.route("/dadjoke").get(otherCtrl.dadJoke)
router.route("/quote").get(otherCtrl.quote)

module.exports = router;
