import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export default function CreateLeaveModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    type: "",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const token = localStorage.getItem("token");
  const apiKey = localStorage.getItem("apiKey");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await axios.post("/api/v1/leave", form, {
        headers: {
          "x-api-key": apiKey,
          Authorization: `Bearer ${token}`,
        },
      });
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Error creating leave:", err);
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white text-blue-900 rounded-2xl shadow-lg p-6 w-[90%] max-w-md"
      >
        <h3 className="text-2xl font-bold mb-4">New Leave Request</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">Type</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2 mt-1"
            >
              <option value="">Select type</option>
              <option value="annual">Annual</option>
              <option value="sick">Sick</option>
              <option value="casual">Casual</option>
            </select>
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block font-medium">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-3 py-2 mt-1"
              />
            </div>
            <div className="flex-1">
              <label className="block font-medium">End Date</label>
              <input
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-3 py-2 mt-1"
              />
            </div>
          </div>
          <div>
            <label className="block font-medium">Reason</label>
            <textarea
              name="reason"
              value={form.reason}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2 mt-1 h-20"
            />
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-blue-400 text-blue-500 hover:bg-blue-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-400 text-white"
            >
              Submit
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
