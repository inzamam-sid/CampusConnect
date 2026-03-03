import { useEffect, useState } from "react";
import API from "../api/axios";

const SeniorCard = ({ senior }) => {
  const [status, setStatus] = useState("none");

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    const res = await API.get("/connections");
    const isConnected = res.data.find(
      (conn) => conn._id === senior._id
    );

    if (isConnected) {
      setStatus("connected");
    }
  };

  const handleConnect = async () => {
    await API.post(`/connections/request/${senior._id}`);
    setStatus("pending");
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h4 className="font-semibold">
        {senior.firstName} {senior.lastName}
      </h4>

      <p className="text-gray-600 mb-4">
        {senior.department} · {senior.year}
      </p>

      {status === "connected" && (
        <button className="w-full bg-gray-400 text-white py-2 rounded">
          Connected
        </button>
      )}

      {status === "pending" && (
        <button className="w-full bg-yellow-500 text-white py-2 rounded">
          Pending
        </button>
      )}

      {status === "none" && (
        <button
          onClick={handleConnect}
          className="w-full bg-primary text-white py-2 rounded"
        >
          Connect
        </button>
      )}
    </div>
  );
};

export default SeniorCard;