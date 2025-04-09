// routes/building/[id]/edit.js
const express = require("express");
const Building = require("../../../../models/building");
const Room = require("../../../../models/room");
const { Types } = require("mongoose");

const router = express.Router();

router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid building ID" });
    }

    const building = await Building.findById(id);
    if (!building) {
      return res.status(404).json({ message: "Building not found" });
    }

    const existingBuilding = await Building.findOne({ name, _id: { $ne: id } });
    if (existingBuilding) {
      return res
        .status(400)
        .json({ message: "Building with this name already exists" });
    }

    building.name = name;
    await building.save();

    res.status(200).json(building);
  } catch (error) {
    console.error("Error updating building:", error);
    res.status(500).json({ message: "Failed to update building" });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid building ID" });
    }

    const building = await Building.findById(id);
    if (!building) {
      return res.status(404).json({ message: "Building not found" });
    }

    const rooms = await Room.find({ building: id });
    if (rooms.length > 0) {
      return res.status(400).json({
        message: "Cannot delete building with rooms. Remove all rooms first.",
      });
    }

    await Building.findByIdAndDelete(id);

    res.status(200).json({ message: "Building deleted successfully" });
  } catch (error) {
    console.error("Error deleting building:", error);
    res.status(500).json({ message: "Failed to delete building" });
  }
});

module.exports = router;
