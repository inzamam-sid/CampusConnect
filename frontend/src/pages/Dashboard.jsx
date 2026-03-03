import { io } from "socket.io-client";
import { useState, useEffect, useContext } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import PostCard from "../components/PostCard";
import CreatePostModal from "../components/CreatePostModal";
import ConnectionRequests from "../components/ConnectionRequests";
import { AuthContext } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";



const socket = io("http://localhost:5000");


const Dashboard = () => {
    const { token } = useContext(AuthContext);
    //const decoded = jwtDecode(token);
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [page, setPage] = useState(1);
 // const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  //const [notifications, setNotifications] = useState([]);

  // ✅ JOIN SOCKET ROOM
  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);

      socket.emit("join", decoded.id); // or decoded._id depending on your token
    }
  }, [token]);

  const fetchFeed = async () => {
  if (loading || !hasMore) return;

  setLoading(true);

  try {
    const res = await API.get(`/posts/feed?page=${page}`);

    if (res.data.posts.length === 0) {
      setHasMore(false); // no more data
    } else {
      setPosts((prev) => [...prev, ...res.data.posts]);
      setPage((prev) => prev + 1);
    }
  } catch (error) {
    console.error(error);
  }

  setLoading(false);
};
useEffect(() => {
  fetchFeed();
}, []);

  
useEffect(() => {
  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 100
    ) {
      fetchFeed();
    }
  };

  window.addEventListener("scroll", handleScroll);

  return () => window.removeEventListener("scroll", handleScroll);
}, [page, loading, hasMore]);

    // 🔥 NEW POST (Real-time create)
  useEffect(() => {
  socket.on("newPost", (newPost) => {
    setPosts((prev) => {
      const exists = prev.find(p => p._id === newPost._id);
      if (exists) return prev;

      return [newPost, ...prev];
    });
  });

  return () => socket.off("newPost");
}, []);

  

  // 🔥 POST UPDATED (Like / Comment)
  useEffect(() => {
    socket.on("postUpdated", (updatedPost) => {
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === updatedPost._id ? updatedPost : post
        )
      );
    });

    return () => socket.off("postUpdated");
  }, []);

   useEffect(() => {
    socket.on("notification", (notification) => {
      console.log("New notification:", notification);
      // Later you can store this in state
    });

    return () => socket.off("notification");
  }, []);
  return (
    <>
      <Navbar />

      <div className="p-8">
        <ConnectionRequests />

        <button
          onClick={() => setShowModal(true)}
          className="bg-primary text-white px-4 py-2 rounded mb-6"
        >
          Create Post
        </button>

        {posts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            refreshFeed={() => fetchFeed(page)}  // refresh current page
          />
        ))}

        {/* ✅ Pagination Section */}
        {/* <div className="flex justify-center gap-4 mt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>

          <span className="px-4 py-2">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div> */}
      </div>

      {showModal && (
        <CreatePostModal
          closeModal={() => setShowModal(false)}
          refreshFeed={() => fetchFeed(page)}  // refresh after creating post
        />
      )}
    </>
  );
};

export default Dashboard;