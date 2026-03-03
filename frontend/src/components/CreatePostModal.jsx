import { useState } from "react";
import API from "../api/axios";

const CreatePostModal = ({ closeModal, refreshFeed }) => {
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("content", content);
    formData.append("tags", tags);
    if (image) formData.append("image", image);

    try {
      await API.post("/posts", formData);
      refreshFeed(); // refresh feed after post
      closeModal();
    } catch (error) {
      alert("Error creating post");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white p-6 rounded-xl w-96">
        <h2 className="text-lg font-semibold mb-4">Create a Post</h2>

        <form onSubmit={handleSubmit}>
          <textarea
            placeholder="What's happening on campus?"
            className="w-full border p-2 rounded mb-3"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <input
            type="text"
            placeholder="Tags (comma separated)"
            className="w-full border p-2 rounded mb-3"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />

          <input
            type="file"
            className="mb-3"
            onChange={(e) => setImage(e.target.files[0])}
          />

          <button className="w-full bg-primary text-white py-2 rounded-lg">
            Publish Post
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;