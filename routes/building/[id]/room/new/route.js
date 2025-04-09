// routes/building/[id]/room/new.js
const express = require("express");
const Building = require("../../../../../models/building");
const Room = require("../../../../../models/room");

const router = express.Router();

router.post("/", async (req, res) => {
  const { number, capacity } = req.body;
  const { id } = req.params;

  try {
    const existingBuilding = await Building.findById(id);
    if (!existingBuilding) {
      return res.status(404).json("Building not found");
    }

    const existingRoom = await Room.findOne({ number, building: id });
    if (existingRoom) {
      return res
        .status(400)
        .json("Room with this number already exists in this building");
    }

    const newRoom = new Room({
      number,
      capacity,
      building: id,
    });

    await newRoom.save();

    await Building.findByIdAndUpdate(
      id,
      { $push: { rooms: newRoom._id } },
      { new: true }
    );

    const populatedRoom = await Room.findById(newRoom._id).populate(
      "building",
      "name"
    );

    res.status(201).json(populatedRoom);
  } catch (error) {
    console.error("Error creating room:", error);
    res.status(500).json("Failed to create a new room");
  }
});

module.exports = router;
