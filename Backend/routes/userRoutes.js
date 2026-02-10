const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  getSeniors,
  registerSenior,
  getMyProfile
} = require("../controllers/userController");

// Get all seniors with filters
router.get("/seniors", authMiddleware, getSeniors);

// Register as senior
router.put("/register-senior", authMiddleware, registerSenior);

// Get logged in user profile
router.get("/profile", authMiddleware, getMyProfile);

module.exports = router;
