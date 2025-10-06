import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Plus, CheckCircle, XCircle } from "lucide-react";
import CreateLeaveModal from "../components/CreateLeaveModal";

export default function LeaveRequests() {
  const [leaves, setLeaves] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const token = localStorage.getItem("token");
  const apiKey = localStorage.getItem("apiKey");

  useEffect(() => {
    fetchLeaves();
  }, []);

  async function fetchLeaves() {
    try {
      const res = await axios.get(
        isAdmin ? "/api/v1/leave" : "/api/v1/leave/my",
        {
          headers: {
            "x-api-key": apiKey,
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLeaves(res.data.leaves || []);
    } catch (err) {
      console.error("Error fetching leaves:", err);
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
      fetchLeaves();
    } catch (err) {
      console.error("Error updating status:", err);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-700 to-blue-900 text-white p-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-between items-center mb-6"
        >
          <h2 className="text-3xl font-bold">Leave Requests</h2>
          {!isAdmin && (
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded-lg shadow-lg"
            >
              <Plus className="w-5 h-5" /> New Request
            </button>
          )}
        </motion.div>

        <div className="bg-white text-blue-800 rounded-2xl p-6 shadow-lg">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-100">
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
                    className="border-t border-blue-100 hover:bg-blue-50 transition"
                  >
                    <td className="p-3">{leave.employeeName || "You"}</td>
                    <td className="p-3 capitalize">{leave.type}</td>
                    <td className="p-3">
                      {leave.startDate} → {leave.endDate}
                    </td>
                    <td className="p-3">{leave.reason}</td>
                    <td
                      className={`p-3 font-semibold ${
                        leave.status === "approved"
                          ? "text-green-600"
                          : leave.status === "rejected"
                          ? "text-red-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {leave.status}
                    </td>
                    {isAdmin && (
                      <td className="p-3 flex gap-2">
                        <button
                          onClick={() => updateStatus(leave.id, "approved")}
                          className="bg-green-500 hover:bg-green-400 text-white px-3 py-1 rounded-lg flex items-center gap-1"
                        >
                          <CheckCircle className="w-4 h-4" /> Approve
                        </button>
                        <button
                          onClick={() => updateStatus(leave.id, "rejected")}
                          className="bg-red-500 hover:bg-red-400 text-white px-3 py-1 rounded-lg flex items-center gap-1"
                        >
                          <XCircle className="w-4 h-4" /> Reject
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center p-6 text-blue-500">
                    No leave requests yet.
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
          onSuccess={fetchLeaves}
        />
      )}
    </div>
  );
}
