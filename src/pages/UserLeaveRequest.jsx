import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Plus, CheckCircle } from "lucide-react";
import CreateLeaveModal from "../components/CreateLeaveModal";
import Navbar from "../components/Navbar";

export default function UserLeaveRequests() {
  const [leaves, setLeaves] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const apiKey = localStorage.getItem("apiKey");

  const checkAdminStatus = () => {
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.role === "admin" || payload.isAdmin === true;
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
      const endpoint = adminStatus
        ? "https://leave-management.devdigicoast.site/leaves"
        : "https://leave-management.devdigicoast.site/leaves/mine";

      const res = await axios.get(endpoint, {
        headers: {
          "x-api-key": apiKey,
          Authorization: `Bearer ${token}`,
        },
      });

      setLeaves(res.data.leaves || res.data || []);
    } catch (err) {
      console.error("Error fetching leaves:", err);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("apiKey");
        window.location.href = "/login";
      }
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id) {
    try {
      await axios.patch(
        `https://leave-management.devdigicoast.site/leaves/${id}/approve`,
        {},
        {
          headers: {
            "x-api-key": apiKey,
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchLeaves(isAdmin);
      alert("Leave approved successfully!");
    } catch (err) {
      console.error("Error approving leave:", err);
      alert("Failed to approve leave");
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-b from-blue-300 via-blue-400 to-blue-600 text-white flex items-center justify-center">
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
      <div className="min-h-screen bg-gradient-to-b from-blue-300 via-blue-400 to-blue-600 text-white p-4 sm:p-6 mt-16">
        <div className="max-w-6xl mx-auto w-full">
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
                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded-lg shadow-lg transition"
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
                  <th className="p-3 text-left">Start Date</th>
                  <th className="p-3 text-left">End Date</th>
                  <th className="p-3 text-left">Reason</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Rejection Reason</th>
                  {isAdmin && <th className="p-3 text-left">Action</th>}
                </tr>
              </thead>

              <tbody>
                {leaves.length > 0 ? (
                  leaves.map((leave) => (
                    <tr
                      key={leave.id}
                      className="border-t border-blue-100 hover:bg-blue-100 transition text-sm sm:text-base"
                    >
                      <td className="p-3 font-medium">
                        {isAdmin ? leave.employeeName || "Employee" : "You"}
                      </td>

                      <td className="p-3">
                        {leave.start_date
                          ? new Date(leave.start_date).toLocaleDateString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )
                          : "N/A"}
                      </td>

                      <td className="p-3">
                        {leave.end_date
                          ? new Date(leave.end_date).toLocaleDateString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )
                          : "N/A"}
                      </td>

                      <td className="p-3">{leave.reason}</td>

                      {/*  Status Column */}
                      <td className="p-3 font-semibold">
                        <span
                          className={`px-2 py-1 rounded-lg text-sm ${
                            leave.status === "Approved"
                              ? "bg-green-100 text-green-700"
                              : leave.status === "Rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {leave.status || "Pending"}
                        </span>
                      </td>

                      {/*  Rejection Reason Column */}
                      <td className="p-3 italic text-gray-600">
                        {leave.rejection_reason || "—"}
                      </td>

                      {isAdmin && (
                        <td className="p-3">
                          <button
                            onClick={() => updateStatus(leave.id)}
                            className="bg-green-500 hover:bg-green-400 text-white px-3 py-1 rounded-lg flex items-center gap-1 justify-center transition-colors"
                          >
                            <CheckCircle className="w-4 h-4" /> Approve
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={isAdmin ? 7 : 6}
                      className="text-center p-6 text-blue-500"
                    >
                      {isAdmin
                        ? "No leave requests yet."
                        : "You have no leave requests yet."}
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
