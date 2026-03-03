import { useState, useContext } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", form);
      login(res.data.token);
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-lightBg">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-96"
      >
        <h2 className="text-xl font-bold mb-4">Login</h2>

        <input name="email" placeholder="Email"
          onChange={handleChange} className="input" />

        <input name="password" type="password"
          placeholder="Password" onChange={handleChange}
          className="input" />

        <button className="w-full bg-primary text-white py-2 rounded-lg mt-4">
          Login
          
        </button>
        <p className="mt-4 text-sm text-center">
  Don't have an account?{" "}
  <span
    className="text-primary cursor-pointer"
    onClick={() => navigate("/signup")}
  >
    Sign Up
  </span>
</p>
      </form>
    </div>
  );
};

export default Login;