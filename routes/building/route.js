const express = require("express");
const Building = require("../../models/building");

const router = express.Router();

const buildingRoute = require("./[id]/route");
const buildingNewRoute = require("./new/route");
const buildingEditRoute = require("./[id]/edit/route");
const roomRoute = require("./[id]/room/route");
const authenticate = require("../../middleware/auth");

router.get("/", async (req, res) => {
  try {
    const buildings = await Building.find({}).populate("rooms");
    res.status(200).json(buildings);
  } catch (error) {
    console.error("Error fetching buildings:", error);
    res.status(500).json({ message: "Failed to fetch buildings" });
  }
});

router.post("/", authenticate, async (req, res) => {
  try {
    const { name } = req.body;

    const existingBuilding = await Building.findOne({ name });
    if (existingBuilding) {
      return res
        .status(400)
        .json({ message: "Building with this name already exists" });
    }

    const newBuilding = new Building({ name });
    await newBuilding.save();

    res.status(201).json(newBuilding);
  } catch (error) {
    console.error("Error creating building:", error);
    res.status(500).json({ message: "Failed to create building" });
  }
});

router.use("/:id/new", authenticate, buildingNewRoute);
router.use("/:id/edit",authenticate, buildingEditRoute);
router.use("/:id/room", roomRoute);
router.use("/", buildingRoute);

module.exports = router;
