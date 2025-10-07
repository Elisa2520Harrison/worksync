import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Plus, CheckCircle, XCircle } from "lucide-react";
import CreateLeaveModal from "../components/CreateLeaveModal";
import Navbar from "../components/Navbar";

export default function LeaveRequests() {
  const [leaves, setLeaves] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const apiKey = localStorage.getItem("apiKey");

  // Function to decode JWT and check if user is admin
  const checkAdminStatus = () => {
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role === 'admin' || payload.isAdmin === true;
    } catch (err) {
      console.error("Error decoding token:", err);
      return false;
    }
  };

  useEffect(() => {
    const adminStatus = checkAdminStatus();
    setIsAdmin(adminStatus);
    fetchLeaves(adminStatus);
  }, []);

  async function fetchLeaves(adminStatus) {
    try {
      setLoading(true);
      const endpoint = adminStatus ? "/api/v1/leave" : "/api/v1/leave/my";
      const res = await axios.get(endpoint, {
        headers: {
          "x-api-key": apiKey,
          Authorization: `Bearer ${token}`,
        },
      });
      setLeaves(res.data.leaves || []);
    } catch (err) {
      console.error("Error fetching leaves:", err);
      // Handle unauthorized error - redirect to login
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("apiKey");
        window.location.href = "/login";
      }
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id, status) {
    try {
      await axios.patch(
        `/api/v1/leave/${id}/status`,
        { status },
        {
          headers: {
            "x-api-key": apiKey,
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchLeaves(isAdmin);
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update leave status");
    }
  }

  // Add loading state
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-b from-blue-300 via-blue-400 to-blue-600 text-white p-6 mt-16 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
            <p className="mt-4">Loading leave requests...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-blue-300 via-blue-400 to-blue-600 text-white p-4 sm:p-6 mt-16 overflow-x-hidden">
        <div className="max-w-5xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4"
          >
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold">Leave Requests</h2>
              <p className="text-blue-100 mt-1">
                {isAdmin ? "All employee leave requests" : "Your leave requests"}
              </p>
            </div>
            {!isAdmin && (
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded-lg shadow-lg transition-colors"
              >
                <Plus className="w-5 h-5" /> New Request
              </button>
            )}
          </motion.div>

          <div className="bg-blue-50 text-blue-800 rounded-2xl p-4 sm:p-6 shadow-lg overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-blue-100 text-sm sm:text-base">
                  <th className="p-3 text-left">Employee</th>
                  <th className="p-3 text-left">Type</th>
                  <th className="p-3 text-left">Duration</th>
                  <th className="p-3 text-left">Reason</th>
                  <th className="p-3 text-left">Status</th>
                  {isAdmin && <th className="p-3 text-left">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {leaves.length > 0 ? (
                  leaves.map((leave) => (
                    <tr
                      key={leave.id}
                      className="border-t border-blue-100 hover:bg-blue-100 transition text-sm sm:text-base"
                    >
                      {/* Employee Column - Shows actual names for admin, "You" for normal users */}
                      <td className="p-3 font-medium">
                        {isAdmin ? (leave.employeeName || leave.employeeEmail || "Unknown Employee") : "You"}
                      </td>
                      <td className="p-3 capitalize">{leave.type}</td>
                      <td className="p-3">
                        {new Date(leave.startDate).toLocaleDateString()} → {new Date(leave.endDate).toLocaleDateString()}
                      </td>
                      <td className="p-3">{leave.reason}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            leave.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : leave.status === "rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {leave.status}
                        </span>
                      </td>
                      {isAdmin && leave.status === "pending" && (
                        <td className="p-3 flex flex-col sm:flex-row gap-2">
                          <button
                            onClick={() => updateStatus(leave.id, "approved")}
                            className="bg-green-500 hover:bg-green-400 text-white px-3 py-1 rounded-lg flex items-center gap-1 justify-center transition-colors"
                          >
                            <CheckCircle className="w-4 h-4" /> Approve
                          </button>
                          <button
                            onClick={() => updateStatus(leave.id, "rejected")}
                            className="bg-red-500 hover:bg-red-400 text-white px-3 py-1 rounded-lg flex items-center gap-1 justify-center transition-colors"
                          >
                            <XCircle className="w-4 h-4" /> Reject
                          </button>
                        </td>
                      )}
                      {isAdmin && leave.status !== "pending" && (
                        <td className="p-3 text-gray-500 text-sm">
                          Completed
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td 
                      colSpan={isAdmin ? 6 : 5} 
                      className="text-center p-6 text-blue-500"
                    >
                      {isAdmin ? "No leave requests from employees yet." : "No leave requests yet. Create your first request!"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {showModal && (
          <CreateLeaveModal 
            onClose={() => setShowModal(false)} 
            onSuccess={() => {
              setShowModal(false);
              fetchLeaves(isAdmin);
            }} 
          />
        )}
      </div>
    </>
  );
}