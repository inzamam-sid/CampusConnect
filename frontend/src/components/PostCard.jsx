import { useState } from "react";
import API from "../api/axios";

const PostCard = ({ post, refreshFeed }) => {
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);

  const handleLike = async () => {
    await API.put(`/posts/like/${post._id}`);
    refreshFeed();
  };

  const handleComment = async () => {
    if (!commentText.trim()) return;

    await API.post(`/posts/comment/${post._id}`, {
      text: commentText,
    });

    setCommentText("");
    refreshFeed();
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
      {/* User Info */}
      <div className="flex items-center gap-4 mb-3">
        <div className="w-12 h-12 bg-primary text-white flex items-center justify-center rounded-full font-bold">
          {post.user.firstName[0]}
        </div>
        <div>
          <h4 className="font-semibold">
            {post.user.firstName} {post.user.lastName}
          </h4>
        </div>
      </div>

      {/* Content */}
      <p className="mb-3">{post.content}</p>

      {/* Actions */}
      <div className="flex gap-6 mb-3">
        <button onClick={handleLike}>
          ❤️ {post.likes.length}
        </button>

        <button onClick={() => setShowComments(!showComments)}>
          💬 {post.comments.length}
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="border-t pt-3">
          {post.comments.map((comment) => (
            <div key={comment._id} className="mb-2">
              <span className="font-semibold">
                {comment.user.firstName}
              </span>{" "}
              {comment.text}
            </div>
          ))}

          <div className="flex mt-2 gap-2">
            <input
              type="text"
              placeholder="Write a comment..."
              className="flex-1 border rounded px-2 py-1"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button
              onClick={handleComment}
              className="bg-primary text-white px-3 rounded"
            >
              Post
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;