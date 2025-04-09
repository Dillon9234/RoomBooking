const express = require("express");

const roomRoute = require("./[roomid]/route");
const roomNewRoute = require("./new/route");
const authenticate = require("../../../../middleware/auth");

const router = express.Router({ mergeParams: true });

router.use("/new", authenticate ,roomNewRoute);
router.use("/",authenticate, roomRoute);

module.exports = router;
