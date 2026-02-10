const Connection = require("../models/Connection");
const User = require("../models/User");

// Send request
exports.sendRequest = async (req, res) => {
  try {
    const existing = await Connection.findOne({
      from: req.user,
      to: req.params.id
    });

    if (existing) return res.status(400).json({ message: "Request already sent" });

    const request = await Connection.create({
      from: req.user,
      to: req.params.id
    });

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Accept request
exports.acceptRequest = async (req, res) => {
  try {
    const connection = await Connection.findById(req.params.id);

    connection.status = "accepted";
    await connection.save();

    await User.findByIdAndUpdate(connection.from, {
      $push: { connections: connection.to }
    });

    await User.findByIdAndUpdate(connection.to, {
      $push: { connections: connection.from }
    });

    res.json(connection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get my connections
exports.getMyConnections = async (req, res) => {
  try {
    const connections = await User.findById(req.user)
      .populate("connections", "firstName lastName department year");

    res.json(connections.connections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
