const { Schema, model, models } = require("mongoose");

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const User = models.User || model("User", UserSchema);

module.exports = User;
