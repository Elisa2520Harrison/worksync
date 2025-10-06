import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import dashboardillustration from "../assets/dashboardillustration.svg";
import { Link } from "react-router";
import Navbar from "../components/Navbar";
import Register from "./Register";

export default function Home() {
    return (
        <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-b from-blue-600 to-blue-900 text-white flex flex-col pt-24">
          
            {/* Hero Section */}
            <section className="flex flex-col lg:flex-row items-center justify-between px-10 lg:px-20 flex-grow ">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-xl space-y-6 text-center lg:text-left"
                >
                    <h2 className="text-5xl lg:text-6xl font-extrabold leading-tight">
                        Streamline Your Team's <span className="text-blue-300">Workflow</span>
                    </h2>
                    <p className="text-lg text-blue-100">
                        Manage tasks, leaves, and collaboration all in one place. WorkSync brings productivity and people together.
                    </p>
                    <div className="flex justify-center lg:justify-start">
                      <Link to="Register"> <button className="bg-blue-500 hover:bg-blue-400 text-white font-semibold px-6 py-3 flex items-center gap-2 rounded-2xl shadow-lg">
                            Get Started
                            <ArrowRight className="w-5 h-5" />
                        </button></Link>

                    </div>
                </motion.div>

                <motion.img
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    src={dashboardillustration}
                    alt="WorkSync Dashboard"
                    className="w-full lg:w-1/2 mt-10 lg:mt-0 drop-shadow-2xl"
                />

            </section>

            {/* Features */}
            <section id="features" className="bg-white text-blue-800 py-20 px-10 lg:px-20">
                <h3 className="text-4xl font-bold text-center mb-12">Why Choose WorkSync?</h3>
                <div className="grid md:grid-cols-3 gap-10 text-center">
                    <div className="bg-blue-50 p-8 rounded-2xl shadow-md hover:shadow-xl transition">
                        <h4 className="text-2xl font-semibold mb-3">Smart Scheduling</h4>
                        <p>Sync leaves, meetings, and availability seamlessly to keep everyone aligned.</p>
                    </div>
                    <div className="bg-blue-50 p-8 rounded-2xl shadow-md hover:shadow-xl transition">
                        <h4 className="text-2xl font-semibold mb-3">Role-Based Access</h4>
                        <p>Admins, managers, and users get dashboards tailored to their needs.</p>
                    </div>
                    <div className="bg-blue-50 p-8 rounded-2xl shadow-md hover:shadow-xl transition">
                        <h4 className="text-2xl font-semibold mb-3">Responsive Design</h4>
                        <p>Access your workspace from any device with a clean, modern interface.</p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-blue-950 text-blue-200 text-center py-6">
                <p>© {new Date().getFullYear()} WorkSync. All rights reserved.</p>
            </footer>
        </div>
        </>
    );
}