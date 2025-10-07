import { useEffect, useState } from "react";
import axios from "axios";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import enUS from "date-fns/locale/en-US"; // ✅ FIXED: use import, not require
import "react-big-calendar/lib/css/react-big-calendar.css";
import Navbar from "../components/Navbar";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function CalendarView() {
  const [events, setEvents] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  const token = localStorage.getItem("token");
  const apiKey = localStorage.getItem("apiKey");

  useEffect(() => {
    fetchLeaves();
  }, []);

  async function fetchLeaves() {
    try {
      const res = await axios.get(isAdmin ? "/api/v1/leave" : "/api/v1/leave/my", {
        headers: {
          "x-api-key": apiKey,
          Authorization: `Bearer ${token}`,
        },
      });

      const formatted = res.data.leaves.map((leave) => ({
        title: `${leave.employeeName || "You"} — ${leave.type} (${leave.status})`,
        start: new Date(leave.startDate),
        end: new Date(leave.endDate),
        allDay: true,
        status: leave.status,
      }));

      setEvents(formatted);
    } catch (err) {
      console.error("Error loading calendar data:", err);
    }
  }

  const eventStyleGetter = (event) => {
    let bgColor =
      event.status === "approved"
        ? "#16a34a"
        : event.status === "rejected"
        ? "#dc2626"
        : "#facc15";

    return {
      style: {
        backgroundColor: bgColor,
        borderRadius: "8px",
        color: "white",
        border: "none",
        display: "block",
        padding: "4px",
      },
    };
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-blue-200 via-blue-300 to-blue-500 p-6 mt-16">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-4 sm:p-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-blue-700 mb-4">
            Leave Calendar
          </h2>
          <div className="h-[80vh]">
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              eventPropGetter={eventStyleGetter}
              popup
            />
          </div>
        </div>
      </div>
    </>
  );
}
