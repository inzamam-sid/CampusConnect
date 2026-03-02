const Post = require("../models/Post");

exports.createPost = async (req, res) => {
  const post = await Post.create({
    user: req.user,
    content: req.body.content,
    tags: req.body.tags,
    image: req.file?.path
  });
  res.json(post);
};

exports.getFeed = async (req, res) => {
  const posts = await Post.find()
  .populate("user", "firstName lastName")
  .populate("comments.user", "firstName lastName")
  .sort({ createdAt: -1 });
  res.json(posts);
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
      // Unlike
      post.likes = post.likes.filter(
        (userId) => userId.toString() !== req.user
      );
    } else {
      // Like
      post.likes.push(req.user);
    }

    await post.save();

    res.json({
      message: alreadyLiked ? "Post unliked" : "Post liked",
      totalLikes: post.likes.length
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

