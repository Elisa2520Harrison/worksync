import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";
import Navbar from "../components/Navbar";

export default function AdminLeaveRequests() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const apiKey = localStorage.getItem("apiKey");

  useEffect(() => {
    fetchAllLeaves();
  }, []);

  async function fetchAllLeaves() {
    try {
      setLoading(true);
      const res = await axios.get("/api/v1/leave", {
        headers: {
          "x-api-key": apiKey,
          Authorization: `Bearer ${token}`,
        },
      });
      setLeaves(res.data.leaves || []);
    } catch (err) {
      console.error("Error fetching leaves:", err);
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
      fetchAllLeaves();
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Update failed");
    }
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-blue-200 via-blue-300 to-blue-500 text-blue-900 p-6 mt-16">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold mb-6"
          >
            All Employee Leave Requests
          </motion.h2>

          <div className="bg-white rounded-xl p-6 shadow-lg overflow-x-auto">
            <table className="min-w-full border-collapse text-sm">
              <thead>
                <tr className="bg-blue-100 text-left">
                  <th className="p-3">Employee</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Duration</th>
                  <th className="p-3">Reason</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {leaves.length > 0 ? (
                  leaves.map((leave) => (
                    <tr key={leave.id} className="border-t border-blue-100">
                      <td className="p-3 font-medium">
                        {leave.employeeName || leave.employeeEmail || "Unknown"}
                      </td>
                      <td className="p-3">{leave.type}</td>
                      <td className="p-3">
                        {new Date(leave.startDate).toLocaleDateString()} →{" "}
                        {new Date(leave.endDate).toLocaleDateString()}
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
                      <td className="p-3 flex gap-2">
                        {leave.status === "pending" ? (
                          <>
                            <button
                              onClick={() => updateStatus(leave.id, "approved")}
                              className="flex items-center gap-1 bg-green-500 hover:bg-green-400 text-white px-3 py-1 rounded-lg"
                            >
                              <CheckCircle className="w-4 h-4" /> Approve
                            </button>
                            <button
                              onClick={() => updateStatus(leave.id, "rejected")}
                              className="flex items-center gap-1 bg-red-500 hover:bg-red-400 text-white px-3 py-1 rounded-lg"
                            >
                              <XCircle className="w-4 h-4" /> Reject
                            </button>
                          </>
                        ) : (
                          <span className="text-gray-400 text-sm">Completed</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center p-6 text-blue-500">
                      No leave requests found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
