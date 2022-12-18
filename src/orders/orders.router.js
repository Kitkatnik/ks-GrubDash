const router = require("express").Router();
const controller = require("./orders.controller");

router
    .route("/")
    .get(controller.list)
    .post(controller.create)

module.exports = router;
