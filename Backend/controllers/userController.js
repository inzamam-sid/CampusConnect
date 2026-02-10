const User = require("../models/User");

exports.getSeniors = async (req, res) => {
  try {
    const { department, search } = req.query;
    const query = { isSenior: true };

    if (department) query.department = department;
    if (search) query.firstName = { $regex: search, $options: "i" };

    const seniors = await User.find(query).select("-password");
    res.json(seniors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.registerSenior = async (req, res) => {
  try {
    const { department, year, bio } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user,
      { isSenior: true, department, year, bio },
      { new: true }
    ).select("-password");

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user)
      .select("-password")
      .populate("connections", "firstName lastName department year");

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
