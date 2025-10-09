import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function AdminRequests() {
  const [users, setUsers] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [filteredLeaves, setFilteredLeaves] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ username: "", password: "", role: "user" });

  const token = localStorage.getItem("token");
  const apiKey = localStorage.getItem("apiKey");

  useEffect(() => {
    fetchUsers();
    fetchLeaves();
  }, []);

  useEffect(() => {
    const filtered = leaves.filter(
      (leave) =>
        leave.employeeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        leave.leaveType?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredLeaves(filtered);
  }, [searchTerm, leaves]);

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
      setFilteredLeaves(res.data || []);
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
      alert(" Failed to approve leave");
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
      alert(" Failed to reject leave");
    }
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-blue-300 via-blue-400 to-blue-600 text-white p-6 mt-16">
        <div className="max-w-7xl mx-auto space-y-10">

          {/* ========== USER MANAGEMENT ========== */}
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              <h2 className="text-2xl font-bold">👥 User Management</h2>
              <button
                onClick={() => setShowForm(!showForm)}
                className="bg-blue-700 hover:bg-blue-600 px-5 py-2 rounded-lg font-medium"
              >
                {showForm ? "Cancel" : "Add User"}
              </button>
            </div>

            {showForm && (
              <form
                onSubmit={handleCreateUser}
                className="bg-white text-blue-800 p-6 rounded-xl mb-6 shadow-lg"
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex flex-col flex-1">
                    <label className="text-sm font-semibold mb-1">Username</label>
                    <input
                      type="text"
                      placeholder="Enter username"
                      className="p-2 border rounded-md"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      required
                    />
                  </div>
                  <div className="flex flex-col flex-1">
                    <label className="text-sm font-semibold mb-1">Password</label>
                    <input
                      type="password"
                      placeholder="Enter password"
                      className="p-2 border rounded-md"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                    />
                  </div>
                  <div className="flex flex-col flex-1">
                    <label className="text-sm font-semibold mb-1">Role</label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="p-2 border rounded-md"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-6 py-2 rounded-lg mt-4 sm:mt-auto"
                  >
                    Create
                  </button>
                </div>
              </form>
            )}

            <div className="bg-white text-blue-800 rounded-xl p-4 shadow-lg overflow-x-auto">
              <table className="min-w-full text-left border-collapse">
                <thead>
                  <tr className="bg-blue-100">
                    <th className="p-3">Username</th>
                    <th className="p-3">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-t border-blue-100 hover:bg-blue-50">
                      <td className="p-3">{user.username}</td>
                      <td className="p-3 capitalize">{user.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ========== LEAVE MANAGEMENT ========== */}
          <div>
            <h2 className="text-2xl font-bold mb-4">📅 Leave Management</h2>

            {/* Search bar */}
            <div className="mb-4 flex justify-end">
              <input
                type="text"
                placeholder="Search by name or leave type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="p-2 w-full sm:w-80 rounded-lg text-blue-800 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="bg-white text-blue-800 rounded-xl p-4 shadow-lg overflow-x-auto">
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
                  {filteredLeaves.map((leave) => (
                    <tr key={leave.id} className="border-t border-blue-100 hover:bg-blue-50">
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
                      <td className="p-3 flex gap-2 justify-center flex-wrap">
                        <button
                          onClick={() => approveLeave(leave.id)}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => rejectLeave(leave.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm"
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredLeaves.length === 0 && (
                    <tr>
                      <td colSpan="5" className="text-center p-4 text-blue-600">
                        No leave requests found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
