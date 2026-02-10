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
  const posts = await Post.find().populate("user", "firstName lastName").sort({ createdAt: -1 });
  res.json(posts);
};
