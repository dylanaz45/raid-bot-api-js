const router = require("express").Router();
const usageCtrl = require("./usage.controller")

router.route("/rankings/:year/:month/:tier/:tier_rank").get(usageCtrl.rankings)
router.route("/recent/:tier/:pokemon").get(usageCtrl.recent)
router.route("/stats/:year/:month/:tier/:tier_rank/:pokemon").get(usageCtrl.stats)

module.exports = router;
