import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function AdminRequests() {
  const [users, setUsers] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ username: "", password: "", role: "user" });

  const token = localStorage.getItem("token");
  const apiKey = localStorage.getItem("apiKey");

  useEffect(() => {
    fetchUsers();
    fetchLeaves();
  }, []);

  async function fetchUsers() {
    try {
      const res = await axios.get("https://leave-management.devdigicoast.site/users", {
        headers: {
          "x-api-key": apiKey,
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(res.data || []);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  }

  async function fetchLeaves() {
    try {
      const res = await axios.get("https://leave-management.devdigicoast.site/leaves", {
        headers: {
          "x-api-key": apiKey,
          Authorization: `Bearer ${token}`,
        },
      });
      setLeaves(res.data || []);
    } catch (err) {
      console.error("Error fetching leaves:", err);
    }
  }

  async function handleCreateUser(e) {
    e.preventDefault();
    try {
      await axios.post("https://leave-management.devdigicoast.site/users", formData, {
        headers: {
          "x-api-key": apiKey,
          Authorization: `Bearer ${token}`,
        },
      });
      alert("✅ User created successfully!");
      setShowForm(false);
      fetchUsers();
    } catch (err) {
      console.error("Error creating user:", err);
      alert("❌ Failed to create user");
    }
  }

  // ✅ FIXED: Use correct endpoints for approve/reject
  async function approveLeave(id) {
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
      alert("✅ Leave approved successfully!");
      fetchLeaves();
    } catch (err) {
      console.error("Error approving leave:", err);
      alert("❌ Failed to approve leave");
    }
  }

  async function rejectLeave(id) {
    const reason = prompt("Enter reason for rejection:");
    if (!reason) return;
    try {
      await axios.patch(
        `https://leave-management.devdigicoast.site/leaves/${id}/reject`,
        { reason },
        {
          headers: {
            "x-api-key": apiKey,
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("✅ Leave rejected successfully!");
      fetchLeaves();
    } catch (err) {
      console.error("Error rejecting leave:", err);
      alert("❌ Failed to reject leave");
    }
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-blue-300 via-blue-400 to-blue-600 text-white p-6 mt-16">
        <div className="max-w-6xl mx-auto space-y-10">
          {/* ========== USER MANAGEMENT ========== */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">👥 User Management</h2>
              <button
                onClick={() => setShowForm(!showForm)}
                className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg"
              >
                {showForm ? "Cancel" : "Add User"}
              </button>
            </div>

            {showForm && (
              <form
                onSubmit={handleCreateUser}
                className="bg-blue-50 text-blue-800 p-4 rounded-xl mb-6"
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="text"
                    placeholder="Username"
                    className="p-2 border rounded-md flex-1"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    required
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    className="p-2 border rounded-md flex-1"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="p-2 border rounded-md flex-1"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                  <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-lg">
                    Create
                  </button>
                </div>
              </form>
            )}

            <div className="bg-blue-50 text-blue-800 rounded-xl p-4 shadow-lg overflow-x-auto">
              <table className="min-w-full text-left border-collapse">
                <thead>
                  <tr className="bg-blue-100">
                    <th className="p-3">Username</th>
                    <th className="p-3">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-t border-blue-100">
                      <td className="p-3">{user.username}</td>
                      <td className="p-3">{user.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ========== LEAVE MANAGEMENT ========== */}
          <div>
            <h2 className="text-2xl font-bold mb-4">📅 Leave Management</h2>
            <div className="bg-blue-50 text-blue-800 rounded-xl p-4 shadow-lg overflow-x-auto">
              <table className="min-w-full text-left border-collapse">
                <thead>
                  <tr className="bg-blue-100">
                    <th className="p-3">Employee</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Date Range</th>
                    <th className="p-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {leaves.map((leave) => (
                    <tr key={leave.id} className="border-t border-blue-100">
                      <td className="p-3">{leave.employeeName}</td>
                      <td className="p-3">{leave.leaveType}</td>
                      <td
                        className={`p-3 font-semibold ${
                          leave.status === "Approved"
                            ? "text-green-600"
                            : leave.status === "Rejected"
                            ? "text-red-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {leave.status}
                      </td>
                      <td className="p-3">
                        {leave.startDate} → {leave.endDate}
                      </td>
                      <td className="p-3 flex gap-2 justify-center">
                        <button
                          onClick={() => approveLeave(leave.id)}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => rejectLeave(leave.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg"
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
