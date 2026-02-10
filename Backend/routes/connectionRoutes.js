const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  sendRequest,
  acceptRequest,
  getMyConnections
} = require("../controllers/connectionController");

// Send connection request
router.post("/request/:id", authMiddleware, sendRequest);

// Accept connection request
router.put("/accept/:id", authMiddleware, acceptRequest);

// Get my connections
router.get("/", authMiddleware, getMyConnections);

module.exports = router;
