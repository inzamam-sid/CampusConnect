import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    college: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/signup", form);
      alert("Signup successful! Please login.");
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Error");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-lightBg">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-96"
      >
        <h2 className="text-xl font-bold mb-4">Sign Up</h2>

        <input name="firstName" placeholder="First Name"
          onChange={handleChange} className="input" />

        <input name="lastName" placeholder="Last Name"
          onChange={handleChange} className="input" />

        <input name="email" placeholder="Email"
          onChange={handleChange} className="input" />

        <input name="password" type="password"
          placeholder="Password" onChange={handleChange}
          className="input" />

        <input name="college" placeholder="College"
          onChange={handleChange} className="input" />

        <button className="w-full bg-primary text-white py-2 rounded-lg mt-4">
          Sign Up
        </button>
        <p className="mt-4 text-sm text-center">
  Already have an account?{" "}
  <span
    className="text-primary cursor-pointer"
    onClick={() => navigate("/login")}
  >
    Login
  </span>
</p>
      </form>
    </div>
  );
};

export default Signup;