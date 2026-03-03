// import { useState, useEffect } from "react";
// import API from "../api/axios";
// import Navbar from "../components/Navbar";
// import PostCard from "../components/PostCard";
// import CreatePostModal from "../components/CreatePostModal";
// import ConnectionRequests from "../components/ConnectionRequests";

// const Dashboard = () => {
//   const [posts, setPosts] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const fetchFeed = async () => {
//     const res = await API.get("/posts/feed");
//     setPosts(res.data);
//   };

//   useEffect(() => {
//     fetchFeed();
//   }, []);

//   return (
//     <>
//       <Navbar />

//       <div className="p-8">
//         <ConnectionRequests />
//         <button
//           onClick={() => setShowModal(true)}
//           className="bg-primary text-white px-4 py-2 rounded mb-6"
//         >
//           Create Post
//         </button>

//         {posts.map((post) => (
//           <PostCard key={post._id} post={post} refreshFeed={fetchFeed} />
//         ))}
//       </div>

//       {showModal && (
//         <CreatePostModal
//           closeModal={() => setShowModal(false)}
//           refreshFeed={fetchFeed}
//         />
//       )}
//     </>
//   );
// };

// export default Dashboard;







import { useState, useEffect } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import PostCard from "../components/PostCard";
import CreatePostModal from "../components/CreatePostModal";
import ConnectionRequests from "../components/ConnectionRequests";

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchFeed = async (pageNumber = 1) => {
    try {
      const res = await API.get(`/posts/feed?page=${pageNumber}`);

      setPosts(res.data.posts);          // ✅ correct
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchFeed(page);
  }, [page]);

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
        <div className="flex justify-center gap-4 mt-6">
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
        </div>
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