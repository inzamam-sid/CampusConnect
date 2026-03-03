import { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import SeniorCard from "../components/SeniorCard";

const Seniors = () => {
  const [seniors, setSeniors] = useState([]);

  useEffect(() => {
    const fetchSeniors = async () => {
      const res = await API.get("/users/seniors");
      setSeniors(res.data);
    };

    fetchSeniors();
  }, []);

  return (
    <>
      <Navbar />
      <div className="p-8">
        <h2 className="text-2xl font-semibold mb-6">
          Senior Directory
        </h2>

        <div className="grid grid-cols-3 gap-6">
          {seniors.map((senior) => (
            <SeniorCard key={senior._id} senior={senior} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Seniors;