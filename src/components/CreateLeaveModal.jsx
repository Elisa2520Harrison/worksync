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
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const apiKey = localStorage.getItem("apiKey");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    if (!form.startDate || !form.endDate || !form.reason) {
      alert("Please fill all fields.");
      return false;
    }
    if (new Date(form.startDate) > new Date(form.endDate)) {
      alert("Start date cannot be after end date.");
      return false;
    }
    return true;
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const payload = {
        startDate: form.startDate,
        endDate: form.endDate,
        reason: `${form.type ? `[${form.type}] ` : ""}${form.reason}`,
      };

      await axios.post("https://leave-management.devdigicoast.site/leaves", payload, {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          Authorization: `Bearer ${token}`,
        },
      });

      onSuccess();
      onClose();
    } catch (err) {
      console.error("Error creating leave:", err?.response?.data || err);
      alert(err?.response?.data?.message || "Failed to submit leave request.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.18 }}
        className="bg-white text-blue-900 rounded-2xl shadow-lg p-6 w-[94%] max-w-md"
      >
        <h3 className="text-2xl font-bold mb-4">New Leave Request</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Type</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="">Select type (optional)</option>
              <option value="annual">Annual</option>
              <option value="sick">Sick</option>
              <option value="casual">Casual</option>
              <option value="unpaid">Unpaid</option>
            </select>
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block font-medium mb-1">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div className="flex-1">
              <label className="block font-medium mb-1">End Date</label>
              <input
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium mb-1">Reason</label>
            <textarea
              name="reason"
              value={form.reason}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2 h-28"
            />
          </div>

          <div className="flex justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-blue-400 text-blue-600 hover:bg-blue-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
