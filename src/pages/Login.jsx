import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const API_URL = import.meta.env.VITE_API_URL;

export default function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.get(
        `${API_URL}/users`
      );

      const users = response.data;
      const user = users.find(
        (u) => u.username === formData.username && u.password === formData.password
      );

      if (user) {
        localStorage.setItem("apiKey", "mock-key-" + user.id);
        localStorage.setItem("token", "mock-token-" + user.id);
        localStorage.setItem("userId", user.id);

        setSuccess(true);
        setTimeout(() => navigate("/leaves"), 2000);
      } else {
        alert("Invalid username or password");
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert("Network error: Unable to reach the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-700 to-blue-900 text-white relative">
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute top-5 bg-green-500 text-white px-5 py-3 rounded-xl shadow-lg font-semibold"
          >
            ✅ Login successful! Redirecting...
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white/10 p-10 rounded-2xl shadow-2xl w-full max-w-md"
        >
          <h1 className="text-3xl font-bold mb-6 text-center">Welcome Back</h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block mb-2 text-sm font-semibold text-white/90">
                Username
              </label>
              <input
                type="text"
                name="username"
                placeholder="Enter username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold text-white/90">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-400 font-semibold py-3 rounded-xl transition"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-center text-sm mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-300 hover:underline">
              Register
            </Link>
          </p>
        </motion.div>
      </div>
    </>
  );
}