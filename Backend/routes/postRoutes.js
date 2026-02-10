const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  createPost,
  getFeed
} = require("../controllers/postController");

const multer = require("multer");

// Image upload config
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// Create post
router.post("/", authMiddleware, upload.single("image"), createPost);

// Get all posts (Feed)
router.get("/feed", authMiddleware, getFeed);

module.exports = router;
