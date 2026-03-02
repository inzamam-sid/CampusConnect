const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  sendRequest,
  acceptRequest,
  rejectRequest,
  getPendingRequests,
  getMyConnections
} = require("../controllers/connectionController");

// Send request
router.post("/request/:id", authMiddleware, sendRequest);

// Accept
router.put("/accept/:id", authMiddleware, acceptRequest);

// Reject
router.put("/reject/:id", authMiddleware, rejectRequest);

// Get pending
router.get("/pending", authMiddleware, getPendingRequests);

// Get connections
router.get("/", authMiddleware, getMyConnections);

module.exports = router;