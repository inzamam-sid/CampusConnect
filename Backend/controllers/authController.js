const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
  const { firstName, lastName, email, password, college } = req.body;

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ firstName, lastName, email, password: hashed, college });

  res.json({ token: jwt.sign({ id: user._id }, process.env.JWT_SECRET) });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(400).json({ message: "Invalid credentials" });

  res.json({ token: jwt.sign({ id: user._id }, process.env.JWT_SECRET) });
};
