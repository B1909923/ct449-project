const express = require("express");
const auths = require("../controllers/auth.controller");
const router = express.Router();

router.route("/").get(auths.findAll);

router.route("/sign-up").post(auths.create);
router.route("/login").post(auths.login);
router.route("/:id").get(auths.findOne);

module.exports = router;
