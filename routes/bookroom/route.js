// routes/bookings.js
const express = require("express");
const BookedRooms = require("../../models/bookedrooms");

const router = express.Router();

router.post("/", async (req, res) => {
  const { bookings, by } = req.body;

  try {
    if (bookings.length === 0) {
      return res.status(400).json("No rooms inputted");
    }

    const response = await fetch("http://localhost:3000/api/enquirerooms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ bookings, by }),
    });

    const data = await response.json();

    if (data.length > 0) {
      return res.status(400).json(data);
    }

    for (const booking of bookings) {
      const newBooking = new BookedRooms({
        date: booking.date,
        roomId: booking.roomId,
        by,
      });
      await newBooking.save();
    }

    res.status(201).json("Room(s) booked for all dates");
  } catch (error) {
    console.error(error);
    res.status(500).json("Failed to book room(s)");
  }
});

router.delete("/", async (req, res) => {
  const { bookings } = req.body;

  try {
    if (bookings.length === 0) {
      return res.status(400).json("No rooms inputted");
    }

    const deletePromises = bookings.map(async (booking) => {
      return await BookedRooms.findOneAndDelete({
        date: booking.date,
        roomId: booking.roomId,
      });
    });

    const results = await Promise.all(deletePromises);
    const deletedCount = results.filter((result) => result !== null).length;

    res.status(200).json(`Successfully deleted ${deletedCount} booking(s).`);
  } catch (error) {
    console.error(error);
    res.status(500).json("Failed to delete booking(s)");
  }
});

module.exports = router;
