import { useState, useEffect, useRef } from "react"
import { Link, useNavigate, useLocation } from "react-router"
import { Menu, X, User, Calendar, Settings, Logout, ChevronDown } from "lucide-react";
import { nav } from "framer-motion/client";


export default function NavbarUser() {
    const [isOpen, setIsOpen] = usestate(false);
    const [isDropdownOpen, setIsDropDownOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState("");
    const [userRole, setUserRole] = useState("");
    const dropdwnRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        checkLoginStatus();

        window.addEventListener("storage", checkLoginStatus);
        return () => window.removeEventListener("storage", checkLoginStatus);
    }, []);

    const checkLoginStatus = () => {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        if (token && userId) {
            setIsLoggedIn(true);
            // Try to get username from token or localStorage
            try {
                const payload = JSON.parse(atob(token.split(".")[1]));
                setUserName(payload.username || payload.name || `User ${userId}`);
                setUserRole(payload.role === "admin" ? "Admin" : "Employee");
            } catch {
                setUserName(`User ${userId}`);
                setUserRole("Employee");
            }
        } else {
            setIsLoggedIn(false);
            setUserName("");
            setUserRole("");
        }
    };
    //   Handle clicks outside dropdown to close it
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleMenu = () => setIsOpen(!isOpen);
    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

    const isActive = (path) =>
        location.pathname === path ? "text-blue-400" : "text-white";

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("apiKey");
        localStorage.removeItem("userId");
        setIsLoggedIn(false);
        setIsDropdownOpen(false);
        navigate("/login");
    };

    // Gets initial avatar
    const getUserInitial = () => {
        if (userName) {
            return userName.charAt(0).toUpperCase();
        }
        return "U";
    };

    return (
        <nav className="w-full bg-blue-900 text-white shadow-lg fixed top-0 left-0 z-50">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center"></div>
        </nav>

    );

}