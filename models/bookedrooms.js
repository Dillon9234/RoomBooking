const { models, model, Schema } = require("mongoose");

const BookedRoomsSchema = new Schema({
  date: {
    type: String,
    required: true,
  },
  roomId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Room",
  },
  by: {
    type: String,
    required: true,
  },
});

const BookedRooms =
  models.BookedRooms || model("BookedRooms", BookedRoomsSchema);

module.exports = BookedRooms;
