// routes/bookedrooms.js
const express = require("express");
const BookedRooms = require("../../models/bookedrooms");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const bookedRooms = await BookedRooms.find({});
    res.status(200).json(bookedRooms);
  } catch (error) {
    console.error("Error fetching booked rooms:", error);
    res.status(500).json({ message: "Failed to fetch all booked rooms" });
  }
});

module.exports = router;
