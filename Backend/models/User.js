const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  password: String,
  college: String,
  department: String,
  year: String,
  bio: String,
  isSenior: { type: Boolean, default: false },
  connections: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
