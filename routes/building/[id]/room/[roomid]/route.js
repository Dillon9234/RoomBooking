// routes/building/[id]/room/[roomid].js
const express = require("express");
const Building = require("../../../../../models/building");
const Room = require("../../../../../models/room");

const router = express.Router();

router.get("/", async (req, res) => {
  const { id } = req.params;

  try {
    const building = await Building.findById(id).populate("rooms");
    if (!building) {
      return res.status(404).json("Building not found");
    }

    res.status(200).json(building);
  } catch (error) {
    console.error("Error fetching building:", error);
    res.status(500).json("Failed to fetch building");
  }
});

router.patch("/:roomid", async (req, res) => {
  const { number, capacity } = req.body;
  const { roomid } = req.params;

  try {
    const existingRoom = await Room.findById(roomid);
    if (!existingRoom) {
      return res.status(404).json("Room not found");
    }

    existingRoom.number = number;
    existingRoom.capacity = capacity;

    await existingRoom.save();

    const populatedRoom = await Room.findById(existingRoom._id).populate(
      "building",
      "name"
    );

    res.status(201).json(populatedRoom);
  } catch (error) {
    console.error("Error updating room:", error);
    res.status(500).json("Failed to update room");
  }
});

router.delete("/:roomid", async (req, res) => {
  const { id, roomid } = req.params;

  try {
    const deletedRoom = await Room.findByIdAndDelete(roomid);
    if (!deletedRoom) {
      return res.status(404).json("Room not found");
    }

    await Building.findByIdAndUpdate(
      id,
      { $pull: { rooms: roomid } },
      { new: true }
    );

    res.status(201).json("Room deleted");
  } catch (error) {
    console.error("Error deleting room:", error);
    res.status(500).json("Failed to delete room");
  }
});

module.exports = router;
