const Connection = require("../models/Connection");
const User = require("../models/User");

// Send connection request
exports.sendRequest = async (req, res) => {
  try {
    const receiverId = req.params.id;

    if (receiverId === req.user) {
      return res.status(400).json({ message: "Cannot connect with yourself" });
    }

    // Check existing connection
    const existing = await Connection.findOne({
      $or: [
        { from: req.user, to: receiverId },
        { from: receiverId, to: req.user }
      ]
    });

    if (existing) {
      return res.status(400).json({ message: "Connection already exists or pending" });
    }

    const request = await Connection.create({
      from: req.user,
      to: receiverId
    });

    res.status(201).json({ message: "Connection request sent", request });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Accept request
exports.acceptRequest = async (req, res) => {
  try {
    const request = await Connection.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.to.toString() !== req.user) {
      return res.status(403).json({ message: "Not authorized" });
    }

    request.status = "accepted";
    await request.save();

    // Add to both users' connections list
    await User.findByIdAndUpdate(request.from, {
      $addToSet: { connections: request.to }
    });

    await User.findByIdAndUpdate(request.to, {
      $addToSet: { connections: request.from }
    });

    res.json({ message: "Connection accepted" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Reject request
exports.rejectRequest = async (req, res) => {
  try {
    const request = await Connection.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.to.toString() !== req.user) {
      return res.status(403).json({ message: "Not authorized" });
    }

    request.status = "rejected";
    await request.save();

    res.json({ message: "Connection rejected" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get my pending requests
exports.getPendingRequests = async (req, res) => {
  try {
    const requests = await Connection.find({
      to: req.user,
      status: "pending"
    }).populate("from", "firstName lastName department");

    res.json(requests);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get my connections
exports.getMyConnections = async (req, res) => {
  try {
    const user = await User.findById(req.user)
      .populate("connections", "firstName lastName department");

    res.json(user.connections);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};