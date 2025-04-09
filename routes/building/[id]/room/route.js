const express = require("express");

const roomRoute = require("./[roomid]/route");
const roomNewRoute = require("./new/route");

const router = express.Router({ mergeParams: true });

router.use("/new", roomNewRoute);
router.use("/", roomRoute);

module.exports = router;
