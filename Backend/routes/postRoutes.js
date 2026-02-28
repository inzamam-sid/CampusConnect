const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  createPost,
  getFeed
} = require("../controllers/postController");
const { toggleLike } = require("../controllers/postController");
const { addComment, deleteComment } = require("../controllers/postController");

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

// Like or Unlike post
router.put("/like/:id", authMiddleware, toggleLike);

// Add comment
router.post("/comment/:id", authMiddleware, addComment);

// Delete comment
router.delete("/comment/:postId/:commentId", authMiddleware, deleteComment);

// router.get("/debug", (req, res) => {
//   res.json({ message: "Post routes working" });
// });
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5OGI0OTNhN2QyNWYxNjE0MDc5YWQyNCIsImlhdCI6MTc3MjMwMTkwN30.xgiGgiVwA_mUp_lDWPHWJp0dslPd6eRmXg_pTLAP4_w

module.exports = router;
