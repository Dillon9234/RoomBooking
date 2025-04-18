import mongoose from "mongoose";

const SessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    unique: true,
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date },
});

export default mongoose.models.Session ||
  mongoose.model("Session", SessionSchema);
