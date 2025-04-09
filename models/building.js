const { Schema, model, models } = require("mongoose");

const BuildingSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name is required!"],
  },
  rooms: [
    {
      type: Schema.Types.ObjectId,
      ref: "Room",
    },
  ],
});

const Building = models.Building || model("Building", BuildingSchema);

module.exports = Building;
