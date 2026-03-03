import { useEffect, useState } from "react";
import API from "../api/axios";

const ConnectionRequests = () => {
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    const res = await API.get("/connections/pending");
    setRequests(res.data);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAccept = async (id) => {
    await API.put(`/connections/accept/${id}`);
    fetchRequests();
  };

  const handleReject = async (id) => {
    await API.put(`/connections/reject/${id}`);
    fetchRequests();
  };

  if (requests.length === 0) return null;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
      <h3 className="font-semibold mb-4">Connection Requests</h3>

      {requests.map((req) => (
        <div
          key={req._id}
          className="flex justify-between items-center mb-3"
        >
          <div>
            <p className="font-medium">
              {req.from.firstName} {req.from.lastName}
            </p>
            <p className="text-sm text-gray-500">
              {req.from.department}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => handleAccept(req._id)}
              className="bg-green-500 text-white px-3 py-1 rounded"
            >
              Accept
            </button>

            <button
              onClick={() => handleReject(req._id)}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ConnectionRequests;