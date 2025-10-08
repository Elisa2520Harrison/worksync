import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import CreateLeaveModal from "../components/CreateLeaveModal";
import Navbar from "../components/Navbar";

export default function UserLeaveRequests() {
  const [leaves, setLeaves] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const apiKey = localStorage.getItem("apiKey");

  useEffect(() => {
    fetchMyLeaves();
  }, []);

  async function fetchMyLeaves() {
    try {
      setLoading(true);
      const res = await axios.get("/api/v1/leave/my", {
        headers: {
          "x-api-key": apiKey,
          Authorization: `Bearer ${token}`,
        },
      });
      setLeaves(res.data.leaves || []);
    } catch (err) {
      console.error("Error fetching your leaves:", err);
      if (err.response?.status === 401) {
        localStorage.clear();
        window.location.href = "/login";
      }
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center min-h-screen text-white bg-blue-400">
          <p>Loading your leave requests...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-blue-300 via-blue-400 to-blue-600 text-white p-6 mt-16">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-between items-center mb-6"
          >
            <h2 className="text-3xl font-bold">My Leave Requests</h2>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded-lg shadow-lg"
            >
              <Plus className="w-5 h-5" /> New Request
            </button>
          </motion.div>

          <div className="bg-white/10 rounded-xl p-6 shadow-lg overflow-x-auto">
            <table className="min-w-full border-collapse text-sm">
              <thead>
                <tr className="bg-blue-100 text-blue-900">
                  <th className="p-3 text-left">Type</th>
                  <th className="p-3 text-left">Duration</th>
                  <th className="p-3 text-left">Reason</th>
                  <th className="p-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {leaves.length > 0 ? (
                  leaves.map((leave) => (
                    <tr key={leave.id} className="border-t border-blue-200">
                      <td className="p-3 capitalize">{leave.type}</td>
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
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center p-6 text-blue-100">
                      No leave requests yet. Create your first one!
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
              fetchMyLeaves();
            }}
          />
        )}
      </div>
    </>
  );
}
