const router = require("express").Router();
const pokemonCtrl = require("./pokemon.controller")

router.route("/den_info").get(pokemonCtrl.denInfo)
router.route("/den_poke").get(pokemonCtrl.denPoke)
router.route("/sprite").get(pokemonCtrl.sprite)
router.route("/data").get(pokemonCtrl.data)
router.route("/set").get(pokemonCtrl.set)
router.route("/set").post(pokemonCtrl.insertSets)
router.route("/search_sets").get(pokemonCtrl.searchSets)
router.route("/build_team").get(pokemonCtrl.buildTeam)
router.route("/stats").get(pokemonCtrl.stats)
router.route("/search_stats").get(pokemonCtrl.searchStats)
router.route("/stat_rankings").get(pokemonCtrl.statRankings)

module.exports = router;
