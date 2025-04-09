// routes/rooms.js
const express = require("express");
const Room = require("../../models/room");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const rooms = await Room.find({}).populate("building", "name");

    res.status(200).json(rooms);
  } catch (error) {
    console.error("Error fetching rooms:", error);
    res.status(500).json({ message: "Failed to fetch all rooms" });
  }
});

module.exports = router;
