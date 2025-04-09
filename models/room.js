const { Schema, model, models } = require("mongoose");

const RoomSchema = new Schema({
  number: {
    type: Number,
    required: [true, "Room number is required!"],
  },
  capacity: {
    type: Number,
    default: 0,
  },
  building: {
    type: Schema.Types.ObjectId,
    ref: "Building",
    required: [true, "Building reference is required!"],
  },
});

const Room = models.Room || model("Room", RoomSchema);

module.exports = Room;
