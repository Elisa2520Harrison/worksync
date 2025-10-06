import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react"; 

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);

  const isActive = (path) =>
    location.pathname === path ? "text-blue-400" : "text-white";

  return (
    <nav className="w-full bg-blue-900 text-white shadow-lg fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Brand Logo */}
        <Link to="/" className="text-2xl font-bold">
          Work<span className="text-blue-400">Sync</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className={`${isActive("/")} hover:text-blue-300 transition font-medium`}
          >
            Home
          </Link>
          <Link
            to="/login"
            className={`${isActive("/login")} hover:text-blue-300 transition font-medium`}
          >
            Login
          </Link>
          <Link
            to="/register"
            className={`${isActive("/register")} hover:text-blue-300 transition font-medium`}
          >
            Register
          </Link>

          <Link to="/login">
            <button className="bg-white text-blue-900 font-semibold px-5 py-2 rounded-xl shadow-md hover:bg-blue-100 transition">
              Get Started
            </button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-white focus:outline-none"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden bg-blue-800 px-6 py-4 space-y-4">
          <Link
            onClick={() => setIsOpen(false)}
            to="/"
            className="block text-white hover:text-blue-300 transition"
          >
            Home
          </Link>
          <Link
            onClick={() => setIsOpen(false)}
            to="/login"
            className="block text-white hover:text-blue-300 transition"
          >
            Login
          </Link>
          <Link
            onClick={() => setIsOpen(false)}
            to="/register"
            className="block text-white hover:text-blue-300 transition"
          >
            Register
          </Link>
        </div>
      )}
    </nav>
  );
}
