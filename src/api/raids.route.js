const router = require("express").Router();
const raidsCtrl = require("./raids.controller")

router.route("/start").post(raidsCtrl.start)
router.route("/end").delete(raidsCtrl.end)
router.route("/active").get(raidsCtrl.active)

module.exports = router;
