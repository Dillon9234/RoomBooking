// routes/building.js
const express = require("express");
const Building = require("../../../models/building");

const router = express.Router();

router.post("/", async (req, res) => {
  const { name } = req.body;

  try {
    const existingBuilding = await Building.findOne({ name });
    if (existingBuilding) {
      return res.status(403).json("Building already exists");
    }

    const newBuilding = new Building({ name });
    await newBuilding.save();

    res.status(201).json(newBuilding);
  } catch (error) {
    console.error(error);
    res.status(500).json("Failed to create a new building");
  }
});

module.exports = router;
