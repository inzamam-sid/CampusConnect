const mongoose = require("mongoose");

const connectionSchema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  to: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: { type: String, enum: ["pending", "accepted"], default: "pending" }
}, { timestamps: true });

module.exports = mongoose.model("Connection", connectionSchema);
