import { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await API.get("/users/profile");
      setUser(res.data);
    };

    fetchProfile();
  }, []);

  if (!user) return null;

  return (
    <>
      <Navbar />
      <div className="p-8">
        <div className="bg-white p-8 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold">
            {user.firstName} {user.lastName}
          </h2>

          <p className="text-gray-600">{user.college}</p>
          <p className="text-gray-600">{user.department}</p>

          <div className="flex gap-10 mt-6">
            <div>
              <p className="font-bold text-lg">
                {user.connections.length}
              </p>
              <p className="text-gray-500">Connections</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;