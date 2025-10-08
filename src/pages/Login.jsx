import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ✅ Use your live API URL
      const response = await axios.post(
        "https://leave-management.devdigicoast.site/auth/login",
        {
          username: formData.username,
          password: formData.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // ✅ Extract API key and token
      const { apiKey, token } = response.data;

      // Save credentials locally
      localStorage.setItem("apiKey", apiKey);
      localStorage.setItem("token", token);

      alert("Login successful!");
      navigate("/leaves"); // redirect to main leave page
    } catch (error) {
      console.error("Login failed:", error);
      if (error.response) {
        alert(error.response.data.message || "Login failed on server.");
      } else if (error.request) {
        alert("Network error: Unable to reach the server.");
      } else {
        alert("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-700 to-blue-900 text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white/10 p-10 rounded-2xl shadow-2xl w-full max-w-md"
        >
          <h1 className="text-3xl font-bold mb-6 text-center">Welcome Back</h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg bg-white/20 placeholder-white/70 focus:outline-none"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg bg-white/20 placeholder-white/70 focus:outline-none"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-400 font-semibold py-3 rounded-xl transition"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-center text-sm mt-6">
            Don’t have an account?{" "}
            <Link to="/register" className="text-blue-300 hover:underline">
              Register
            </Link>
          </p>
        </motion.div>
      </div>
    </>
  );
}
