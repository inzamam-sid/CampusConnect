import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

//  const Navbar = () => {
  return (
    <div className="bg-white shadow-sm px-8 py-4 flex items-center justify-between">
      <h1 className="text-xl font-bold text-primary">CampusConnect</h1>

      <input
        type="text"
        placeholder="Search students, posts, topics..."
        className="w-1/3 px-4 py-2 border rounded-lg bg-gray-100"
      />

      {/* <div className="flex items-center gap-6">
        <Link to="/" className="font-medium text-gray-600 hover:text-primary">
          Feed
        </Link>
        <Link to="/seniors" className="font-medium text-gray-600 hover:text-primary">
          Seniors
        </Link>
        <Link to="/profile" className="bg-primary text-white px-4 py-2 rounded-lg">
          Profile
        </Link>
      </div> */}
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
};


export default Navbar;