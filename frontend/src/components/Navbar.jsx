import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

const Navbar = () => {
  const { logout, token } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // Join user room
  useEffect(() => {
    if (token) {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      socket.emit("join", decoded.id);
    }
  }, [token]);

  // Listen for notifications
  useEffect(() => {
    socket.on("notification", (notif) => {
      setNotifications((prev) => [notif, ...prev]);
    });

    return () => socket.off("notification");
  }, []);

  return (
    <div className="bg-white shadow-sm px-8 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-primary">CampusConnect</h1>

      <div className="flex items-center gap-6">

        {/* 🔔 Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="text-xl"
          >
            🔔
          </button>

          {notifications.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 rounded-full">
              {notifications.length}
            </span>
          )}

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg p-4 z-50">
              <h4 className="font-semibold mb-2">Notifications</h4>

              {notifications.length === 0 && (
                <p className="text-gray-500 text-sm">No notifications</p>
              )}

              {notifications.map((notif, index) => (
                <div key={index} className="border-b py-2 text-sm">
                  {notif.message}
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;