const Post = require("../models/Post");
const Notification = require("../models/Notification");

exports.createPost = async (req, res) => {
  try {
    const newPost = await Post.create({
      user: req.user,
      content: req.body.content,
      tags: req.body.tags,
      image: req.file?.path
    });

    const populatedPost = await Post.findById(newPost._id)
      .populate("user", "firstName lastName department")
      .populate("comments.user", "firstName lastName");

    const io = req.app.get("io");
    io.emit("newPost", populatedPost);

    res.status(201).json(populatedPost);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getFeed = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 5; // posts per page
    const skip = (page - 1) * limit;

    const totalPosts = await Post.countDocuments();

    const posts = await Post.find()
      .populate("user", "firstName lastName department")
      .populate("comments.user", "firstName lastName")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limit),
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




//const Post = require("../models/Post");

// Like or Unlike Post

exports.toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const alreadyLiked = post.likes.includes(req.user);

    if (alreadyLiked) {
      post.likes = post.likes.filter(
        (userId) => userId.toString() !== req.user
      );
    } else {
      post.likes.push(req.user);
    }

    await post.save();

    // 🔥 Get populated post for frontend consistency
    const updatedPost = await Post.findById(post._id)
      .populate("user", "firstName lastName department")
      .populate("comments.user", "firstName lastName");

    // 🔥 Emit to all connected clients
    const io = req.app.get("io");
    io.emit("postUpdated", updatedPost);

    if (!alreadyLiked && post.user.toString() !== req.user) {

      const notification = await Notification.create({
        user: post.user,       // receiver
        sender: req.user,      // who liked
        type: "like",
        message: "Someone liked your post"
      });

      // 🔥 Emit only to post owner
      io.to(post.user.toString()).emit("notification", notification);
    }

    res.json({
      message: alreadyLiked ? "Post unliked" : "Post liked",
      totalLikes: updatedPost.likes.length
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};








// Add Comment
exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Comment text required" });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const newComment = {
      user: req.user,
      text
    };

    post.comments.push(newComment);
    await post.save();

    // 🔥 Get fully populated post
    const updatedPost = await Post.findById(post._id)
      .populate("user", "firstName lastName department")
      .populate("comments.user", "firstName lastName");

    // 🔥 Emit to all connected users
    const io = req.app.get("io");
    io.emit("postUpdated", updatedPost);

    res.status(201).json({
      message: "Comment added",
      totalComments: post.comments.length
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// Delete Comment
exports.deleteComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = post.comments.id(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Only comment owner can delete
    if (comment.user.toString() !== req.user) {
      return res.status(403).json({ message: "Not authorized" });
    }

    comment.remove();
    await post.save();

    res.json({ message: "Comment deleted" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

