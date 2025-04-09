// routes/building/[id]/room.js
const express = require("express");
const Building = require("../../../models/building");

const router = express.Router({ mergeParams: true });

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const building = await Building.findById(id).populate("rooms");

    if (!building) {
      return res.status(404).json({ message: "Building not found" });
    }

    return res.status(200).json(building);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch building" });
  }
});

module.exports = router;
