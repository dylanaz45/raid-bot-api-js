const router = require("express").Router();
const usersCtrl = require("./users.controller")

router.route("/login").get(usersCtrl.getAPIToken)

module.exports = router;
