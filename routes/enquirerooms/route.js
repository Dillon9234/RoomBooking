// routes/bookedrooms.js
const express = require("express");
const BookedRooms = require("../../models/bookedrooms");

const router = express.Router();

router.post("/", async (req, res) => {
  const { bookings, by } = req.body;

  try {
    let conflicts = [];

    if (bookings.length === 0) return res.status(400).json("No rooms inputted");

    for (const booking of bookings) {
      const cur = await BookedRooms.findOne({
        date: booking.date,
        roomId: booking.roomId,
      });
      if (cur) {
        conflicts.push({
          date: booking.date,
          roomId: booking.roomId,
          bookedBy: by,
        });
      }
    }

    res.status(201).json(conflicts);
  } catch (error) {
    console.log(error);
    res.status(500).json("Failed to book room(s)");
  }
});

module.exports = router;
